import { NextFunction, Request, Response } from "express";
import { QueryResult } from "pg";
import { client } from "../database";
import { formatErrors, updateSchema } from "../schemas";
import Jwt from "jsonwebtoken";

export const verifyUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  const token = req.headers.authorization?.split(" ");

  const admin: any = await Jwt.decode(token![1]);
  try {
    await updateSchema.parse(req.body);

    const queryResult: QueryResult = await client.query({
      text: "SELECT * FROM users WHERE id = $1",
      values: [id],
    });

    if (admin.admin === false && queryResult.rows[0].admin === true) {
      return res.status(403).json({ message: "Insufficient Permission" });
    }

    if (queryResult.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return next();
  } catch (error: any) {
    return res.status(400).json(formatErrors(error.errors));
  }
};
