import style from "./index.module.css"

export default function DisplayConfig({ children, className }) {
    return (
        <div className={style[className]}>{children}</div>
    )
}