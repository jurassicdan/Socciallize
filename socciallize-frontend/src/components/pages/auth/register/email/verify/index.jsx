"use client";

import CstmInput from "@/components/layout/input";
import style from "./index.module.css";
import CstmButton from "@/components/layout/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import useAuth from "@/helpers/isAuth";

export default function Code_Verify() {
  const { loading } = useAuth({ redirectIfAuth: true });
  const [InputCode, setInputCode] = useState("");
  const [email, setEmail] = useState("");

  const router = useRouter();

  useEffect(() => {
    const Storageemail = sessionStorage.getItem("email");
    if (!Storageemail) {
      router.push("/email-send");
    } else {
      setEmail(Storageemail);
    }
  }, [router]);

  if (!email) {
    return null;
  }
  if (loading) {
    return null;
  }

  const SendCodeToApi = async function (e) {
    e.preventDefault();

    try {
      const resp = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/register/email-verify`,
        { UserCode: InputCode, email: email },
      );

      if (resp.data.success) {
        sessionStorage.setItem("token", resp.data.token);
        router.push(`create-account`);
      } else {
        console.log("Erro ao verificar código");
      }
    } catch (err) {
      console.log("Erro ao enviar código: ", err);
    }
  };

  return (
    <form className={style.main_Container} onSubmit={SendCodeToApi}>
      <p>Mandamos um código para o e-mail. Coloque-o abaixo.</p>
      <CstmInput
        type="text"
        placeholder="0000000"
        spellchecker="false"
        autoComplete="off"
        id="InputCode"
        name="InputCode"
        autoFocus="true"
        value={InputCode}
        onChange={(e) => setInputCode(e.target.value)}
        maxLength={7}
        minLength={7}
        required
      />

      <CstmButton Text={"Verificar código"} Type={"submit"} />
    </form>
  );
}
