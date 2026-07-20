import style from "./index.module.css";

export default function CstmInput({ ...rest }) {
  return <input {...rest} className={style.Input} />;
}
