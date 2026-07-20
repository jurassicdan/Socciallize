import CstmLink from "@/components/layout/Link";
import style from "./index.module.css";

export default function GuestHome() {
  return (
    <div className={style.main_Container}>
      <header>
        <h2>Bem-vindo ao Socciallize!</h2>

        <p>Converse com o mundo!</p>
      </header>
      <main>
        <CstmLink
          LinkTo={"/email-send"}
          className={"border-link"}
          Text={"Criar uma conta"}
        />

        <CstmLink
          LinkTo={"/login"}
          className={"no-border-link"}
          Text={"Entrar em uma conta"}
        />
      </main>
    </div>
  );
}
