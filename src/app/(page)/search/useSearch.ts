import useSWR from 'swr';

const swrFetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch CV (status ${res.status})`);
  }

  return await res.json();
};

export function useSearchCv(name: string) {
  const { data, error, isLoading, mutate } = useSWR(`api/find-cv?name=${name}`, swrFetcher);

  const refresh = () => mutate();

  return {
    cvs: data as CvData[],
    error,
    loading: isLoading,
    refresh,
  };
}
