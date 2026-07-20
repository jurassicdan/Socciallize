import GuestHome from "@/components/pages/home/guest";
import UserHome from "@/components/pages/home/user";

export default function Home() {
  const logged = false;

  if (logged) {
    return <UserHome />;
  }

  return <GuestHome />;
}
