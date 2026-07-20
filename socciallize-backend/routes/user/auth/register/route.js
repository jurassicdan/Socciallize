import express from "express";
import { prisma } from "../../../../database.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import JWT from "jsonwebtoken";
import "dotenv/config";
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/email-send", async (req, res) => {
  const { email } = req.body;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({
      erro: "Coloque um e-mail válido",
    });
  }

  try {
    const EmailExists = await prisma.user.findUnique({
      where: { email: email },
    });

    if (EmailExists) {
      return res.status(400).json({
        erro: "E-mail já registrado!",
      });
    }
  } catch (err) {
    console.log("Erro ao verificar banco de dados: ", err);
  }

  const VerifyCode = String(Math.floor(1000000 + Math.random() * 9000000));
  const VerifyCodeHash = await bcrypt.hash(VerifyCode, 16);

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    try {
      const info = await transporter.sendMail({
        from: "Socciallize <Sociallite.app2026@gmail.com>",
        to: email,
        subject: "Boas-vindas ao Socciallize!",
        text: "Obrigado por participar de nosso site! Para continuar a criação da sua conta, você terá que colocar esses 7 números abaixo na tela do seu navegador!",
        html: `
        <h2 style="font-size: 2rem; width: 100%">Boas-vindas ao Socciallize!</h2>
        
        <h4 style="font-size: 1.50rem">Obrigado por nos escolher!</h4>
        <p style="font-size: 1rem;">Para continuar a criação da sua conta, coloque os 7 números abaixo no seu navegador</p>

        <br>

        <p style="font-size: 1.15rem; text-decoration: underline"><strong>${VerifyCode}</strong></p>
        `,
      });
    } catch (err) {
      console.log("Erro ao tentar enviar e-mail: ", err);
    }
  } catch (err) {
    console.log("Erro ao tentar enviar e-mail: ", err);
  }

  const Token = JWT.sign({ code: VerifyCodeHash }, JWT_SECRET, {
    expiresIn: "5m",
  });

  res.cookie("token", Token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 5 * 60 * 1000,
  });

  return res.status(200).json({
    message: "Código enviado no email!",
    token: Token,
  });
});

router.post("/email-verify", (req, res) => {
  const { UserCode, token } = req.body;

  if (!UserCode || !token) {
    return res.status(400).json({
      erro: "Valores inexistentes.",
    });
  }

  try {
    const decoded = JWT.verify(token, JWT_SECRET);

    const isMatch = bcrypt.compare(String(UserCode), String(decoded.code));

    if (isMatch) {
      return res.status(200).json({
        message: "E-mail verificado com sucesso!",
      });
    } else {
      return res.status(400).json({
        erro: "O código precisa ser o mesmo do código enviado pelo e-mail.",
      });
    }
  } catch (err) {
    console.log("Erro ao verificar os códigos: ", err);
    return res.status(400).json({
      erro: "Código inválido ou expirado. Solicite um novo código.",
    });
  }
});

router.post("/final", async (req, res) => {
  const { email, age, name, username, password, confirmpassword } = req.body;

  const usernameRegex = /^[a-z0-9._-]+$/;

  if (!age || typeof age !== "number") {
    return res.status(400).json({
      erro: "Coloque uma idade válida",
    });
  }

  if (age <= 10) {
    return res.status(400).json({
      erro: "ops, parece que você não tem a idade mínima para estar aqui!",
    });
  }

  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      erro: "Coloque um nome de perfil válido.",
    });
  }

  if (!username || typeof username !== "string" || username.trim() === "") {
    return res.status(400).json({
      erro: "Coloque um nome de usuário válido.",
    });
  }

  if (!usernameRegex.test(username)) {
    return res.status(400).json({
      erro: "O nome de usuário só pode conter letras minúsculas!",
    });
  }

  if (!password || typeof password !== "string" || password.trim() === "") {
    return res.status(400).json({
      erro: "Coloque uma senha válida.",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      erro: "A senha precisa ter 6 ou mais caracteres!",
    });
  }

  if (!confirmpassword || confirmpassword !== password) {
    return res.status(400).json({
      erro: "Coloque a mesma senha nos dois campos.",
    });
  }

  try {
    const EmailExists = await prisma.user.findUnique({
      where: { email: email },
    });

    if (EmailExists) {
      return res.status(400).json({
        erro: "E-mail já registrado!",
      });
    }

    const UsernameExists = await prisma.user.findUnique({
      where: { username: username },
    });

    if (UsernameExists) {
      return res.status(400).json({
        erro: "Nome de usuário já existe!",
      });
    }
  } catch (err) {
    console.log(err);
  }

  try {
    const Salt = await bcrypt.genSalt(16);
    const HashPassword = await bcrypt.hash(password, Salt);
    const resp = await prisma.user.create({
      data: {
        name: name,
        email: email,
        age: age,
        password: HashPassword,
        username: username,
      },
    });
  } catch (err) {
    console.log(err);
  }

  res.status(201).json({
    message: "Usuário criado com sucesso!",
  });
});

export default router;
