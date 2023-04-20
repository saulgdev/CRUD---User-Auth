import { NextFunction, Request, Response } from "express";
import { client } from "../database";
import { QueryResult } from "pg";
import Jwt from "jsonwebtoken";

export const verifyAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Missing Bearer Token" });
  }

  const token = req.headers.authorization?.split(" ");

  try {
    const decoded: any = await Jwt.verify(token[1], process.env.SECRET_KEY!);
    if (decoded.admin === false) {
      return res.status(403).json({ message: "Insufficient Permission" });
    }

    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};
