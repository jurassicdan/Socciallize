"use client";

import style from "./index.module.css";
import { FaHome, FaPlus, FaUser, FaBell } from "react-icons/fa";
import { Link } from "next-view-transitions";
import useAuth from "@/helpers/isAuth";

export default function CstmNav() {
  const { user, loading } = useAuth({ requireAuth: false });

  if (loading) {
    return null;
  }

  const UserBtn = function () {
    if (user) {
      return (
        <div className={style.links_Container}>
          <ul>
            <li>
              <Link href={"/"}>
                <FaHome />
              </Link>
            </li>
            <li>
              <Link href={"/create-post"}>
                <FaPlus />
              </Link>
            </li>
            <li>
              <Link href={"/notifications"}>
                <FaBell />
              </Link>
            </li>
            <li>
              <Link href={`/profile/?username=${user.username}`}>
                <FaUser />
                <small>{user.username}</small>
              </Link>
            </li>
          </ul>
        </div>
      );
    }
  };
  return (
    <nav className={style.main_Container}>
      <div className={style.title_Container}>
        <h1>
          <Link href={"/"}>Socciallize</Link>
        </h1>
      </div>

      <UserBtn />
    </nav>
  );
}
