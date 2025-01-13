export const useApi = (endpoint: string, options = {}) => {
  const config = useRuntimeConfig();
  return useFetch(`${config.public.apiBase}${endpoint}`, options);
};
