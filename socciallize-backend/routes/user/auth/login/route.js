import express from "express";
import bcrypt from "bcrypt";
import { prisma } from "../../../../database.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
const JWT_SECRET = process.env.JWT_SECRET;
const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    const User = await prisma.user.findUnique({
      where: { email: email },
    });

    if (User) {
      const isMatch = await bcrypt.compare(password, User.password);

      if (isMatch) {
        const authToken = jwt.sign(
          {
            id: User.id,
            email: User.email,
            username: User.username,
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

        return res.status(200).json({
          success: true,
          message: "Logado com sucesso!",
          user: {
            id: User.id,
            name: User.name,
            username: User.username,
            email: User.email,
          },
        });
      } else {
        return res.status(400).json({
          erro: "Senha incorreta. Tente novamente.",
        });
      }
    }
  } catch (err) {
    console.log("Erro ao logar: ", err);
    return res.status(500).json({
      erro: "Erro ao tentar logar.",
    });
  }
});

export default router;
