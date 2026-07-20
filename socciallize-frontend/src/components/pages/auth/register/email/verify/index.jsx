"use client";

import CstmInput from "@/components/layout/input";
import style from "./index.module.css";
import CstmButton from "@/components/layout/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

export default function Code_Verify() {
  const [InputCode, setInputCode] = useState("");
  const SearchParams = useSearchParams();
  const token = SearchParams.get("token");
  const email = SearchParams.get("email");
  const router = useRouter();

  useEffect(() => {
    if (!token || !email) {
      router.push("/email-send");
    }
  }, [token, email, router]);

  if (!token || !email) {
    return null;
  }

  const SendCodeToApi = async function (e) {
    e.preventDefault();

    console.log(`Enviando -> ${InputCode} - ${token}`);

    try {
      const resp = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/register/email-verify`,
        { UserCode: InputCode, token: token },
      );

      if (resp) {
        router.push(`create-account?email=${email}`);
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
