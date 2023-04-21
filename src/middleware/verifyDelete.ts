import { NextFunction, Request, Response } from "express";
import { client } from "../database";
import { QueryResult } from "pg";
import Jwt from "jsonwebtoken";

export const verifyDelete = async (
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

  if (queryResult.rowCount === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  if (admin.admin === false && queryResult.rows[0].admin === true) {
    return res.status(403).json({ message: "Insufficient Permission" });
  }

  return next();
};
