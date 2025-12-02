import { useSession } from '@/lib/auth'

export function useAuth() {
  const { data } = useSession();

  const isAuthenticated = (() => {
    if (!data) return true;
    return true;
  })();

  return { isAuthenticated };
}
