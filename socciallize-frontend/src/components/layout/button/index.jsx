import style from "./index.module.css";

export default function CstmButton({ Text, Type, ...rest }) {
  return (
    <button type={Type} className={style.Button} {...rest}>
      {Text}
    </button>
  );
}
