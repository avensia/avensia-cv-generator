import useSWR from 'swr';

const swrFetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch data (status ${res.status})`);
  }

  return await res.json();
};

export function useCvWithRole() {
  const { data, error, isLoading, mutate } = useSWR('/api/cv-with-role', swrFetcher);

  const refresh = () => mutate();

  return {
    cvWithRole: data as CvDataWithRole[],
    error,
    loading: isLoading,
    refresh,
  };
}
