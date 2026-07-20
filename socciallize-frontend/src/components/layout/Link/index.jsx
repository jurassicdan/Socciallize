import { Link } from "next-view-transitions";
import style from "./index.module.css";

export default function CstmLink({ Text, LinkTo, className }) {
  return (
    <Link href={LinkTo} className={`${style[className]} ${style.link} `}>
      {Text}
    </Link>
  );
}
