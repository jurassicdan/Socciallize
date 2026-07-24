import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function useAuth({
  requireAuth = false,
  redirectIfAuth = false,
} = {}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function CheckAuth() {
      try {
        const resp = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
          withCredentials: true,
        });

        if (resp.data.authenticated) {
          setUser(resp.data.user);

          if (redirectIfAuth) {
            router.push("/");
          }
        }
      } catch (err) {
        setUser(null);

        if (requireAuth) router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    CheckAuth();
  }, [requireAuth, redirectIfAuth, router]);

  return { user, loading };
}
