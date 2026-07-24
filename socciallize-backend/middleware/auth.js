import jwt from "jsonwebtoken";
import "dotenv/config";
const JWT_SECRET = process.env.JWT_SECRET;

export function ensureAuth(req, res, next) {
  const token = req.cookies?.socciallize_token;

  if (!token) {
    return res.status(401).json({
      erro: "Acesso negado. Faça login para acessar essa rota.",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    return next();
  } catch (err) {
    return res.status(401).json({
      erro: "Sessão inválida ou expirada. Faça login para acessar.",
    });
  }
}
