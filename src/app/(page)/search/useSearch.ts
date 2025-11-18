import useSWR from 'swr';

const swrFetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch CV (status ${res.status})`);
  }

  return await res.json();
};

export function useSearchCv() {
  const { data, error, isLoading, mutate } = useSWR('api/find-cv', swrFetcher);

  const refresh = () => mutate();

  return {
    cvs: data,
    error,
    loading: isLoading,
    refresh,
  };
}
