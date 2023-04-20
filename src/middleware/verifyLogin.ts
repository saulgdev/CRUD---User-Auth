import { compare } from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import { client } from "../database";
import { QueryResult } from "pg";

export const verifyLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = req.body.email || false;
  const password = req.body.password || false;

  if (!email || !password) {
    return res
      .status(400)
      .json({ email: "falta email", password: "falta senha" });
  }

  const queryString = {
    text: "SELECT * FROM users WHERE email = $1",
    values: [email],
  };

  const queryResult: QueryResult = await client.query(queryString);

  if (queryResult.rowCount === 0) {
    return res.status(401).json({ message: "Wrong email/password" });
  }

  if (!(await compare(password, queryResult.rows[0].password))) {
    return res.status(401).json({ message: "Wrong email/password" });
  }

  return next();
};
