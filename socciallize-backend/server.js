// Importando dependências

import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";

// Importando a rotas do servidor

const PORT = process.env.PORT || 5000;
import Register from "./routes/user/auth/register/route.js";
import Login from "./routes/user/auth/login/route.js";
import isAuth from "./routes/user/auth/isAuth/route.js";
import Post from "./routes/posts/route.js";
import { ensureAuth } from "./middleware/auth.js";
import Profile from "./routes/user/post/route.js";

// Iniciando o App
const app = express();
app.use(
  cors({
    origin: process.env.NEXT_PUBLIC_API_URL,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

// Rotas

app.use("/register", Register);
app.use("/login", Login);
app.use("/me", isAuth);
app.use("/post", ensureAuth, Post);
app.use("/profile", ensureAuth, Profile);
// Iniciando o servidor
app.listen(PORT, () => console.log("Server ", PORT));
