import express from "express";
import { prisma } from "../../database.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
const JWT_SECRET = process.env.JWT_SECRET;
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
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
      posts: posts,
    });
  } catch (err) {
    return res.status(500).json({
      erro: "erro carregar posts.",
    });
  }
});

router.post("/create", async (req, res) => {
  const { title, content } = req.body;
  const token = req.cookies?.socciallize_token;

  if (!token) {
    return res.status(401).json({
      erro: "Sessão inválida ou expirada. Faça login para fazer postagens.",
    });
  }

  let user;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    user = decoded;
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      erro: "Sessão inválida. Tente novamente.",
    });
  }

  if (!title?.trim() || !content?.trim()) {
    return res.status(400).json({
      erro: "Faltam informações no formulário.",
    });
  }

  const StringTitle = String(title);
  const StringContent = String(content);

  if (StringTitle.length > 255 || StringContent.length > 10000) {
    return res.status(400).json({
      erro: "Conteúdo muito longo. o máximo de caracteres é 255 para títulos e 10.000 para o conteúdo.",
    });
  }

  try {
    await prisma.post.create({
      data: {
        title: StringTitle,
        content: StringContent,
        authorId: user.id,
      },
    });

    return res.status(201).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      erro: "Erro interno. Tente novamente mais tarde.",
    });
  }
});

router.delete("/delete/:postId", async (req, res) => {
  const { postId } = req.params;
  const token = req.cookies?.socciallize_token;

  if (!token) {
    return res.status(401).json({
      erro: "Você não tem autorização para fazer essa ação.",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.user?.id || decoded.id;

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({
        erro: "Post não encontrado.",
      });
    }

    if (post.authorId !== userId) {
      return res.status(403).json({
        erro: "Você não tem permissão de excluir posts de outros usuários.",
      });
    }
    await prisma.post.delete({
      where: { id: postId },
    });

    return res.status(200).json({
      success: true,
      message: "Post deletado com sucesso!",
    });
  } catch (err) {
    return res.status(500).json({
      erro: "Erro interno ao deletar post.",
    });
  }
});

export default router;
