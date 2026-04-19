import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export enum PriorityTier {
  Tier1 = 0,
  Tier2 = 1,
  Tier3 = 2,
}

export enum ContactType {
  Commercial = 0,
  Financial  = 1,
}

export interface Contact {
  firstName: string;
  lastName:  string;
  email:     string;
  phone:     string;
  type:      ContactType;
}

export interface ContactInput {
  firstName: string;
  lastName:  string;
  email:     string;
  phone:     string;
}

export interface Client {
  id:              string;
  name:            string;
  legalName:       string;
  vatNumber:       string;
  businessAddress: string;
  industry:        string;
  priority:        PriorityTier;
  createdAt:       string;
  contacts:        Contact[];
}

export interface CreateClientInput {
  name:               string;
  legalName:          string;
  vatNumber:          string;
  businessAddress:    string;
  industry:           string;
  priority:           PriorityTier;
  commercialContact?: ContactInput;
  financialContact?:  ContactInput;
}

export const useClients = () => {
  const queryClient = useQueryClient();

  const clientsQuery = useQuery({
    queryKey: ['clients'],
    queryFn: () => api.get<Client[]>('/api/clients'),
  });

  const createClientMutation = useMutation({
    mutationFn: (newClient: CreateClientInput) =>
      api.post<Client>('/api/clients', newClient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });

  return {
    clients:      clientsQuery.data ?? [],
    isLoading:    clientsQuery.isLoading,
    error:        clientsQuery.error,
    createClient: createClientMutation.mutateAsync,
    isCreating:   createClientMutation.isPending,
  };
};
