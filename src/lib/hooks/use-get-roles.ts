import useSWR from 'swr';

const swrFetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch data (status ${res.status})`);
  }

  return await res.json();
};

export function useGetRoles() {
  const { data, error, isLoading } = useSWR(`/api/get-roles`, swrFetcher, { revalidateOnFocus: false });

  return {
    data: data as Roles[],
    error,
    loading: isLoading,
  };
}
