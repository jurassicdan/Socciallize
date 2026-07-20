// Importando dependências

import express from "express";
import "dotenv/config";
import cors from "cors";

// Importando a rotas do servidor

const PORT = process.env.PORT || 5000;
import Register from "./routes/user/auth/register/route.js";

// Iniciando o App
const app = express();
app.use(
  cors({
    origin: process.env.NEXT_PUBLIC_API_URL,
    credentials: true,
  }),
);
app.use(express.json());

// Rotas

app.use("/register", Register);

// Iniciando o servidor
app.listen(PORT, () => console.log("Server ", PORT));
