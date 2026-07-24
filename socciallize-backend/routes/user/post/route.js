import express from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { prisma } from "../../../database.js";
const JWT_SECRET = process.env.JWT_SECRET;
const router = express.Router();
let user;

router.get("/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const post = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        author: { username: username },
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      userPosts: post,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      erro: "Erro interno ao buscar posts deste usuário: ",
    });
  }
});

export default router;
