import useSWR from 'swr';

const swrFetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch user auth (status ${res.status})`);
  }

  return await res.json();
};

export function useUserRole() {
  const { data, error, isLoading } = useSWR(`/api/user-role`, swrFetcher, { revalidateOnFocus: false });

  return {
    data: (data as { userRole: string }) || null,
    error,
    loading: isLoading,
  };
}
