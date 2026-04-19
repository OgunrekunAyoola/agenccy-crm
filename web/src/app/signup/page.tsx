'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/LayoutPrimitives';
import Link from 'next/link';
import { Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score, label: 'Weak', color: 'bg-rose-500' };
  if (score <= 2) return { score, label: 'Fair', color: 'bg-amber-500' };
  if (score <= 3) return { score, label: 'Good', color: 'bg-yellow-500' };
  return { score, label: 'Strong', color: 'bg-emerald-500' };
}

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agencyName: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, user, loading } = useAuth();
  const { t } = useTranslation('auth');
  const router = useRouter();

  const strength = getPasswordStrength(formData.password);

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard');
  }, [user, loading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.agencyName.trim()) errors.agencyName = t('register.errors.agencyNameRequired');
    if (!formData.fullName.trim()) errors.fullName = t('register.errors.fullNameRequired');
    if (!formData.email.trim()) {
      errors.email = t('register.errors.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = t('register.errors.emailInvalid');
    }
    if (!formData.password) {
      errors.password = t('register.errors.passwordRequired');
    } else if (formData.password.length < 8) {
      errors.password = t('register.errors.passwordTooShort');
    } else if (strength.score < 3) {
      errors.password = t('register.errors.passwordTooWeak');
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = t('register.errors.confirmRequired');
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = t('register.errors.confirmMismatch');
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await register(formData.email, formData.password, formData.fullName, formData.agencyName);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('register.errors.registrationFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md shadow-xl border-indigo-50">
        <CardHeader className="text-center space-y-1">
          <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <Building2 className="text-white h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">{t('signup.title')}</CardTitle>
          <CardDescription>{t('signup.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4" noValidate>
            <div className="bg-indigo-50/50 p-4 rounded-lg border border-indigo-100/50">
              <Input
                label={t('signup.agencyName')}
                name="agencyName"
                placeholder={t('signup.agencyNamePlaceholder')}
                value={formData.agencyName}
                onChange={handleChange}
                required
                className="bg-white"
                error={fieldErrors.agencyName}
              />
            </div>
            <Input
              label={t('signup.fullName')}
              name="fullName"
              placeholder={t('signup.fullNamePlaceholder')}
              value={formData.fullName}
              onChange={handleChange}
              required
              error={fieldErrors.fullName}
            />
            <Input
              label={t('signup.email')}
              name="email"
              type="email"
              placeholder={t('signup.emailPlaceholder')}
              value={formData.email}
              onChange={handleChange}
              required
              error={fieldErrors.email}
            />
            <div className="space-y-1">
              <Input
                label={t('signup.password')}
                name="password"
                type="password"
                placeholder={t('signup.passwordPlaceholder')}
                value={formData.password}
                onChange={handleChange}
                required
                error={fieldErrors.password}
              />
              {formData.password.length > 0 && (
                <div className="space-y-1 pt-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          i <= strength.score ? strength.color : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${strength.score <= 2 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {t(`register.strength.${strength.label.toLowerCase()}`)} {t('register.strength.suffix')}
                  </p>
                </div>
              )}
            </div>
            <Input
              label={t('signup.confirmPassword')}
              name="confirmPassword"
              type="password"
              placeholder={t('signup.confirmPasswordPlaceholder')}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              error={fieldErrors.confirmPassword}
            />
            {error && (
              <div role="alert" className="p-3 text-sm rounded-md bg-destructive/10 text-destructive border border-destructive/20 animate-in fade-in slide-in-from-top-1">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" isLoading={isSubmitting} disabled={isSubmitting}>
              {t('signup.submit')}
            </Button>
            <p className="text-center text-sm text-muted-foreground pt-2">
              {t('signup.alreadyHave')}{' '}
              <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                {t('signup.signIn')}
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
