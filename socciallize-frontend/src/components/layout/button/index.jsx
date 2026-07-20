import style from "./index.module.css";

export default function CstmButton({ Text, Type }) {
  return (
    <button type={Type} className={style.Button}>
      {Text}
    </button>
  );
}
