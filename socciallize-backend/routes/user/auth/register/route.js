import express from "express";
import { prisma } from "../../../../database.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import JWT from "jsonwebtoken";
import "dotenv/config";
import { Prisma } from "@prisma/client";
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

    const VerifyCode = String(Math.floor(1000000 + Math.random() * 9000000));
    const VerifyCodeHash = await bcrypt.hash(VerifyCode, 10);

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.verifyCode.upsert({
      where: { email: email },
      update: {
        Code: VerifyCodeHash,
        expiresAt: expiresAt,
      },
      create: {
        email: email,
        Code: VerifyCodeHash,
        expiresAt: expiresAt,
      },
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
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

    return res.status(200).json({
      message: "Código enviado no email!",
    });
  } catch (err) {
    console.log("Erro ao verificar banco de dados: ", err);

    return res.status(500).json({
      erro: "Erro interno ao tentar enviar o email.",
    });
  }
});

router.post("/email-verify", async (req, res) => {
  const { UserCode, email } = req.body;
  if (!UserCode || !email) {
    return res.status(400).json({
      erro: "Código ou e-mail faltando!",
    });
  }

  let Verification;

  try {
    Verification = await prisma.verifyCode.findUnique({
      where: { email: email },
    });
  } catch (err) {
    console.log("Erro ao tentar acessar banco de dados: ", err);
    return res.status(500).json({
      erro: "Erro interno no servidor ao verificar e-mail.",
    });
  }

  if (!Verification) {
    return res.status(400).json({
      erro: "Nenhum código válido para este e-mail.",
    });
  }

  if (Verification.expiresAt < new Date()) {
    await prisma.verifyCode.delete({ where: { email } });
    return res.status(400).json({
      erro: "O código expirou. solicite um novo",
    });
  }

  const isMatch = await bcrypt.compare(UserCode, Verification.Code);

  if (!isMatch) {
    return res.status(400).json({
      erro: "O código precisa ser o mesmo código enviado pelo seu e-mail!",
    });
  }

  const token = JWT.sign({ email: email, verified: true }, JWT_SECRET, {
    expiresIn: "10m",
  });

  return res.status(201).json({
    message: "E-mail verificado com sucesso!",
    success: true,
    token: token,
  });
});

router.post("/final", async (req, res) => {
  const { name, username, password, confirmpassword, token } = req.body;
  if (!token) {
    return res.status(400).json({
      erro: "O token não foi fornecido corretamente.",
    });
  }

  let decoded;

  try {
    decoded = JWT.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(400).json({
      erro: "Token inválido ou expirado.",
    });
  }

  if (!decoded.verified || !decoded.email) {
    return res.status(400).json({
      erro: "O token não foi fornecido corretamente.",
    });
  }

  let VerifiedEmail;

  try {
    VerifiedEmail = await prisma.verifyCode.findUnique({
      where: { email: decoded.email },
    });
  } catch (err) {
    console.log("Erro ao verificar e-mail: ", err);
    return res.status(500).json({
      erro: "Erro interno ao verificar e-mail.",
    });
  }

  if (!VerifiedEmail) {
    return res.status(400).json({
      erro: "O e-mail não foi verificado.",
    });
  }

  const email = decoded.email;
  const usernameRegex = /^[a-z0-9._-]+$/;

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

    return res.status(500).json({
      erro: "Erro ao verificar se usuário já existe.",
    });
  }

  try {
    const Salt = await bcrypt.genSalt(10);
    const HashPassword = await bcrypt.hash(password, Salt);
    const resp = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: HashPassword,
        username: username,
      },
    });

    await prisma.verifyCode.delete({
      where: { email: email },
    });

    const authToken = JWT.sign(
      {
        id: resp.id,
        email: resp.email,
        username: resp.username,
      },
      JWT_SECRET,
      { expiresIn: "1y" },
    );

    res.cookie("socciallize_token", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "Usuário criado com sucesso!",
      user: {
        id: resp.id,
        name: resp.name,
        username: resp.username,
        email: resp.email,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      erro: "Erro interno ao criar usuário. Tente novamente.",
    });
  }
});

export default router;
