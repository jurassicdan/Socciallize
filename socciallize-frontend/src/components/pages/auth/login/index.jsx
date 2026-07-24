"use client";

import CstmInput from "@/components/layout/input";
import style from "./index.module.css";
import CstmButton from "@/components/layout/button";
import { useState } from "react";
import axios from "axios";
import useAuth from "@/helpers/isAuth";

export default function Login() {
  const { loading } = useAuth({ redirectIfAuth: true });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (loading) {
    return null;
  }

  const SendLoginReq = async function (e) {
    e.preventDefault();

    try {
      const resp = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/login`,
        {
          email: email,
          password: password,
        },
        { withCredentials: true },
      );

      if (resp.data.success) {
        window.location.href = "/";
      }
    } catch (err) {
      console.log("Erro ao tentar entrar na sua conta: ", err);
    }
  };

  return (
    <form className={style.main_Container} onSubmit={SendLoginReq}>
      <CstmInput
        type="email"
        placeholder="Seuemail@exemplo.com"
        spellchecker="false"
        autoComplete="off"
        id="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        minLength={1}
        maxLength={255}
        required
      />

      <CstmInput
        type="password"
        placeholder="Sua senha."
        spellchecker="false"
        autoComplete="off"
        id="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        minLength={6}
        maxLength={255}
        required
      />

      <CstmButton Text={"Entrar"} Type={"submit"} />
    </form>
  );
}
