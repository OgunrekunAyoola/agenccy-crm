import { signals } from './signals';

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export function isApiError(err: unknown): err is ApiError {
  return err instanceof ApiError;
}

const rawBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// In the browser, always use relative paths (/api/...) so requests flow through
// the Next.js rewrite in next.config.ts, which proxies to the backend server-side.
// This keeps cookies on the app's own domain (agency-ccrm.netlify.app) where
// proxy.ts can read them for server-side route protection.
// In SSR context (no window), use the absolute URL for direct backend access.
const API_BASE_URL = typeof window !== 'undefined' ? '' : rawBase.replace(/\/$/, '');

/**
 * Returns `Bearer <token>` when a valid access token exists in localStorage,
 * or undefined when no usable token is present.
 *
 * Returning undefined (not an empty string) lets callers omit the Authorization
 * header entirely. An absent header is unambiguous: the backend falls through to
 * cookie auth without any token-parsing step. `Authorization: ` or
 * `Authorization: Bearer null` can trigger malformed-credential rejection in
 * strict auth middleware before the HttpOnly cookie is ever checked.
 */
function bearerToken(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  const token = localStorage.getItem('access_token');
  if (!token || token === 'null' || token === 'undefined') return undefined;
  return `Bearer ${token}`;
}

// --- Shared refresh-token serialization ---
// The backend uses rotating single-use refresh tokens: RefreshTokenAsync revokes
// the consumed token before persisting the replacement. A second concurrent call
// with the now-dead token receives a non-2xx response, which would trigger a false
// session-expiry for an otherwise authenticated user.
//
// Fix: all concurrent 401-handlers await the same in-flight promise rather than
// independently calling /api/auth/refresh.
//
// Lifecycle:
//   Created on the first 401 that enters the refresh path.
//   All subsequent concurrent 401-handlers get the same promise via the guard.
//   Cleared in .finally() once settled so the next refresh cycle starts fresh.
//   Resolves (void) on success; rejects with ApiError on failure.
//   signals.emit('401') fires exactly once, inside this promise, on failure —
//   not once per caller.
let inflightRefresh: Promise<void> | null = null;

function ensureTokenRefresh(): Promise<void> {
  if (inflightRefresh) return inflightRefresh;

  inflightRefresh = (async () => {
    try {
      const refreshResponse = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json().catch(() => ({}));
        if ((refreshData as { accessToken?: string }).accessToken) {
          localStorage.setItem('access_token', (refreshData as { accessToken: string }).accessToken);
        }
        // Resolves — all waiting callers will retry with the updated token.
      } else {
        // Refresh definitively failed — session is unrecoverable.
        // Emit the signal here so it fires exactly once regardless of how many
        // callers are awaiting this promise.
        localStorage.removeItem('access_token');
        signals.emit('401', 'Your session has expired. Please sign in again.');
        throw new ApiError(401, 'Your session has expired. Please sign in again.');
      }
    } catch (err) {
      if (err instanceof ApiError) throw err;
      // Network-level failure reaching /api/auth/refresh (e.g. offline).
      // All waiting callers receive this single rejection.
      localStorage.removeItem('access_token');
      signals.emit('401', 'Your session has expired. Please sign in again.');
      throw new ApiError(401, 'Your session has expired. Please sign in again.');
    }
  })().finally(() => {
    // Clear after settlement so the next refresh cycle creates a new request
    // rather than re-awaiting an already-resolved promise.
    inflightRefresh = null;
  });

  return inflightRefresh;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const authHeader = bearerToken();
  const fetchOptions: RequestInit = {
    ...options,
    headers: {
      ...headers,
      ...(authHeader ? { Authorization: authHeader } : {}),
    },
    credentials: 'include',
  };

  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  let response = await fetch(`${API_BASE_URL}${normalizedEndpoint}`, fetchOptions);

  // --- 401 Auto-refresh ---
  // Skip /auth/me: a 401 there means "no session" (normal for unauthenticated
  // visitors) — not "session expired mid-use". Triggering a refresh attempt
  // here causes signals.emit('401') to fire on every public page load, which
  // overlays the landing page and login form with the "Session Expired" modal.
  if (
    response.status === 401 &&
    !endpoint.includes('/auth/login') &&
    !endpoint.includes('/auth/me') &&
    !endpoint.includes('/auth/refresh')
  ) {
    try {
      // All concurrent 401-handlers await the same shared promise.
      // See ensureTokenRefresh() for the serialization contract.
      await ensureTokenRefresh();

      // Refresh succeeded — rebuild headers from scratch so the now-expired
      // Bearer value is never forwarded on the retry.
      const retryToken = bearerToken();
      const retryOptions: RequestInit = {
        ...fetchOptions,
        headers: {
          ...headers,
          ...(retryToken ? { Authorization: retryToken } : {}),
        },
      };
      response = await fetch(`${API_BASE_URL}${normalizedEndpoint}`, retryOptions);
      // Falls through to the !response.ok block below to handle the retry result.
    } catch (err) {
      if (err instanceof ApiError) {
        // ensureTokenRefresh already emitted the signal and cleared local state.
        throw err;
      }
      // Safety net: unexpected throw type — should not be reachable in practice.
      localStorage.removeItem('access_token');
      signals.emit('401', 'Your session has expired. Please sign in again.');
      throw new ApiError(401, 'Your session has expired. Please sign in again.');
    }
  }

  // --- Error handling with user-visible states ---
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message =
      (errorData as { message?: string; Message?: string }).message ||
      (errorData as { message?: string; Message?: string }).Message ||
      `API error: ${response.status}`;

    // --- Global Signals for Failsafe UI ---
    if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/me')) {
      signals.emit('401', message);
    } else if (response.status === 403) {
      signals.emit('403', message);
    } else if (response.status >= 500) {
      signals.emit('500', 'A server error occurred.');
    }

    // Show a toast only for actionable client errors (e.g. 400 Bad Request,
    // 409 Conflict, 422 Unprocessable). Skip 401/403 (handled by signals),
    // and 404 (handled by each component's own empty/error state — no toast
    // needed, the resource simply doesn't exist).
    const shouldToast =
      response.status >= 400 &&
      response.status < 500 &&
      response.status !== 401 &&
      response.status !== 403 &&
      response.status !== 404;

    if (shouldToast) {
      const { toast } = await import('sonner');
      toast.error(message);
    }

    throw new ApiError(response.status, message);
  }

  // --- Guard 204 No Content / 205 Reset Content (no body to parse) ---
  if (response.status === 204 || response.status === 205) {
    return null as unknown as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, body?: unknown) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body ?? {}),
    }),
  patch: <T>(endpoint: string, body: unknown) =>
    apiRequest<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
  put: <T>(endpoint: string, body: unknown) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  delete: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'DELETE' }),
};
