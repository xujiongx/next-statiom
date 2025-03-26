import { useState, useEffect } from 'react';
import { authApi, UserInfo } from '@/api/auth';

export function useAuth() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const { data } = await authApi.getSession();
        setUser(data.user);
      } catch (err) {
        setError(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { user, loading, error, isLoggedIn: !!user };
}
