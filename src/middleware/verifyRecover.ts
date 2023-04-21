import { NextFunction, Request, Response } from "express";
import { client } from "../database";
import { QueryResult } from "pg";
import Jwt from "jsonwebtoken";

export const verifyRecover = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const token = req.headers.authorization?.split(" ");

  const admin: any = await Jwt.decode(token![1]);

  const queryResult: QueryResult = await client.query({
    text: "SELECT * FROM users WHERE id = $1",
    values: [id],
  });

  if (!admin.admin) {
    return res.status(403).json({ message: "Insufficient Permission" });
  }
  if (queryResult.rows[0].active === true) {
    return res.status(400).json({ message: "User already active" });
  }

  return next();
};
