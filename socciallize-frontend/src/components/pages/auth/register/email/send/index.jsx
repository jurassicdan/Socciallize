"use client";

import CstmInput from "@/components/layout/input";
import style from "./index.module.css";
import CstmButton from "@/components/layout/button";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import useAuth from "@/helpers/isAuth";

export default function Email_Send() {
  const { loading } = useAuth({ redirectIfAuth: true });
  const [email, setEmail] = useState("");
  const router = useRouter();

  if (loading) {
    return null;
  }

  const SendEmailToApi = async function (e) {
    e.preventDefault();

    try {
      const resp = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/register/email-send`,
        { email },
      );

      if (resp) {
        sessionStorage.setItem("email", email);
        router.push(`email-verify`);
      }
    } catch (err) {
      console.log("Erro ao se conectar com o servidor: ", err);
    }
  };

  return (
    <form className={style.main_Container} onSubmit={SendEmailToApi}>
      <p>Coloque seu e-mail no campo abaixo!</p>
      <CstmInput
        type="email"
        placeholder="seuemail@exemplo.com"
        spellchecker="false"
        autoComplete="off"
        id="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        maxLength={255}
        required
      />

      <small>mandaremos um código no seu e-mail.</small>

      <CstmButton Text={"Registrar E-mail"} Type={"submit"} />
    </form>
  );
}
