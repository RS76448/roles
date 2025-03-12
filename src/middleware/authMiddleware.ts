import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  next()
  
  // const token = req.header("Authorization")?.split(" ")[1];

  // if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  // try {
  //   const decoded = jwt.verify(token, JWT_SECRET);
  //   req.user = decoded;
  //   next();
  // } catch (error) {
  //   res.status(401).json({ message: "Invalid token" });
  // }
};
