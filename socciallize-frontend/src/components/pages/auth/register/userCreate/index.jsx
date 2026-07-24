"use client";

import CstmInput from "@/components/layout/input";
import style from "./index.module.css";
import CstmButton from "@/components/layout/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import useAuth from "@/helpers/isAuth";

export default function Final_User() {
  const { loading } = useAuth({ redirectIfAuth: true });
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const router = useRouter();

  useEffect(() => {
    const StorageEmail = sessionStorage.getItem("token");

    if (!StorageEmail) {
      router.push("/email-send");
    } else {
      setToken(StorageEmail);
    }
  }, [router]);

  if (!token) {
    return null;
  }

  if (loading) {
    return null;
  }
  const SendUserToApi = async function (e) {
    e.preventDefault();

    try {
      const resp = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/register/final`,
        {
          token: token,
          name: name,
          username: username,
          password: password,
          confirmpassword: confirmPassword,
        },
        { withCredentials: true },
      );

      if (resp.data.success) {
        window.location.href = "/";
      }
    } catch (err) {
      console.log("Erro ao acessar o servidor.", err);
    }
  };

  return (
    <form className={style.main_Container} onSubmit={SendUserToApi}>
      <CstmInput
        type="text"
        placeholder="Seu Nome de exibição."
        spellchecker="false"
        autoComplete="off"
        id="name"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        minLength={1}
        maxLength={255}
        required
      />

      <CstmInput
        type="text"
        placeholder="Seu Nome de identificação"
        spellchecker="false"
        autoComplete="off"
        id="usernam"
        name="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
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

      <CstmInput
        type="password"
        placeholder="Confirme Sua senha."
        spellchecker="false"
        autoComplete="off"
        id="confirmPassword"
        name="confirmPassword"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        minLength={6}
        maxLength={255}
        required
      />

      <CstmButton Text={"Criar conta"} Type={"submit"} />
    </form>
  );
}
