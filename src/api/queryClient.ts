import { QueryClient } from '@tanstack/react-query';

// One QueryClient instance for the whole app — created once, provided at
// the root in App.tsx via <QueryClientProvider>. Angular comparison:
// conceptually similar to a singleton HttpClient + a shared in-memory
// cache service, but TanStack Query gives you the caching, retries, and
// invalidation logic for free.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});
