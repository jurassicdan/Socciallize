import style from "./index.module.css";
import { FaHome, FaPlus, FaUser, FaBell } from "react-icons/fa";
import { Link } from "next-view-transitions";

export default function CstmNav() {
  return (
    <nav className={style.main_Container}>
      <div className={style.title_Container}>
        <h1>
          <Link href={"/"}>Socciallize</Link>
        </h1>
      </div>

      <div className={style.links_Container}>
        <ul>
          <li>
            <Link href={"/"}>
              <FaHome />
            </Link>
          </li>
          <li>
            <Link href={"/posts/create"}>
              <FaPlus />
            </Link>
          </li>
          <li>
            <Link href={"/notifications"}>
              <FaBell />
            </Link>
          </li>
          <li>
            <Link href={"/my-account"}>
              <FaUser />
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
