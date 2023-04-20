import { NextFunction, Request, Response } from "express";
import { QueryResult } from "pg";
import { client } from "../database";
import { formatErrors, postSchema } from "../schemas";

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await postSchema.parse(req.body);
    const email = req.body.email;

    const queryString = {
      text: "SELECT id FROM users WHERE email = $1",
      values: [email],
    };

    const queryResult: QueryResult = await client.query(queryString);

    if (queryResult.rowCount > 0) {
      return res.status(409).json({ message: "E-mail already registered" });
    }

    return next();
  } catch (error: any) {
    return res.status(400).json(formatErrors(error.errors));
  }
};
