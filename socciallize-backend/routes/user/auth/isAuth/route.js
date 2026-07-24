import express from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";
import { prisma } from "../../../../database.js";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;
const router = express.Router();

router.get("/", async (req, res) => {
  const token = req.cookies.socciallize_token;

  if (!token) {
    return res.status(401).json({
      authenticated: false,
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const userId = decoded.user?.id || decoded.id;

    if (!userId) {
      return res.status(401).json({
        authenticated: false,
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(401).json({ authenticated: false });
    }

    return res.status(200).json({
      authenticated: true,
      user: user,
    });
  } catch (err) {
    return res.status(401).json({ authenticated: false });
  }
});

export default router;
