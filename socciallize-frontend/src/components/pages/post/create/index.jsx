"use client";

import CstmInput from "@/components/layout/input";
import style from "./index.module.css";
import CstmButton from "@/components/layout/button";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import useAuth from "@/helpers/isAuth";

export default function Create_Post() {
  const { loading } = useAuth({ requireAuth: true });
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  if (loading) {
    return null;
  }

  const SendPostFrom = async function (e) {
    e.preventDefault();

    const resp = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/post/create`,
      {
        title: title,
        content: content,
      },
      { withCredentials: true },
    );

    if (resp.data?.success) {
      router.push("/");
    }
  };

  return (
    <form className={style.main_Container} onSubmit={SendPostFrom}>
      <CstmInput
        type="text"
        placeholder="Titulo da postagem"
        spellchecker="false"
        autoComplete="off"
        id="title"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        minLength={1}
        maxLength={255}
        required
      />

      <textarea
        id="content"
        name="content"
        minLength={1}
        maxLength={10000}
        spellCheck="false"
        autoComplete="off"
        placeholder="Escreva o que está pensando no momento"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <CstmButton Text={"Enviar postagem"} Type={"submit"} />
    </form>
  );
}
