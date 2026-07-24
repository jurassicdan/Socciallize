"use client";

import GuestHome from "@/components/pages/home/guest";
import UserHome from "../components/pages/home/user";
import useAuth from "@/helpers/isAuth";

export default function Home() {
  const { user, loading } = useAuth(false);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (user) {
    return <UserHome />;
  }

  return <GuestHome />;
}
