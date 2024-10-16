export const fetchData = async <TDataType>({
  url,
  requestInit,
}: {
  url: string;
  requestInit?: RequestInit;
}): Promise<TDataType> => {
  const response = await fetch(new URL(url), requestInit);

  if (!response.ok) {
    throw new Error(`Failed to fetch data!, url=${url}`);
  }

  return <TDataType>response.json();
};
