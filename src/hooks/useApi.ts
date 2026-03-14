import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { http } from '../services/http';

type HttpError = Error & { status?: number; code?: string };

export function useApiQuery<T>(
  key: string[],
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
  options?: Omit<UseQueryOptions<T, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<T, HttpError>({
    queryKey: key,
    queryFn: () => http.get<T>(path, params),
    ...options,
  });
}

export function useApiMutation<TData = unknown, TBody = unknown>(
  method: 'post' | 'put' | 'patch' | 'delete',
  path: string | ((variables: TBody) => string),
  options?: Omit<UseMutationOptions<TData, HttpError, TBody>, 'mutationFn'> & {
    invalidateKeys?: string[][];
  },
) {
  const queryClient = useQueryClient();
  const { invalidateKeys, ...mutationOptions } = options ?? {};

  return useMutation<TData, HttpError, TBody>({
    mutationFn: (body) => {
      const url = typeof path === 'function' ? path(body) : path;
      return method === 'delete'
        ? http.delete<TData>(url)
        : http[method]<TData>(url, body);
    },
    onSuccess: (...args) => {
      invalidateKeys?.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
      mutationOptions.onSuccess?.(...args);
    },
    ...mutationOptions,
  });
}
