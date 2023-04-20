import { QueryResult } from "pg";
import format from "pg-format";
import { client } from "../database";
import { TUser, loginRequest } from "../interfaces/users.interfaces";
import Jwt from "jsonwebtoken";

const createUserService = async (payload: TUser) => {
  const queryString: string = format(
    `INSERT INTO
              users(%I)
          VALUES
              (%L)
          RETURNING *;`,
    Object.keys(payload),
    Object.values(payload)
  );

  const queryResult: QueryResult = await client.query(queryString);

  const { password, ...userWithoutPass } = queryResult.rows[0];

  return userWithoutPass;
};

const loginUserService = async (payload: loginRequest) => {
  const email = payload.email;

  const queryResult: QueryResult = await client.query({
    text: "SELECT * FROM users WHERE email = $1",
    values: [email],
  });

  const { password, ...user } = queryResult.rows[0];

  return {
    token: Jwt.sign({ admin: user.admin }, process.env.SECRET_KEY!, {
      expiresIn: 24,
      subject: user.id,
    }),
  };
};

const getUsersService = async () => {
  const queryResult: QueryResult = await client.query(
    format(`SELECT id, name, email, admin, active FROM users`)
  );

  return queryResult.rows;
};

const getUserProfileService = async (payload: string) => {
  const token = payload.split(" ");

  const user: any = await Jwt.decode(token[1]);
  console.log(user);

  const queryResult: QueryResult = await client.query({
    text: "SELECT * FROM users WHERE id = $1",
    values: [user.sub],
  });

  const { password, ...userWithoutPass } = queryResult.rows[0];

  return userWithoutPass;
};

const softDeleteUser = async (payload: string) => {
  const queryResult: QueryResult = await client.query({
    text: "UPDATE users SET active = false WHERE id = $1",
    values: [payload],
  });
};

const recoverUser = async (payload: string) => {
  const queryResult: QueryResult = await client.query({
    text: "UPDATE users SET active = true WHERE id = $1 RETURNING *",
    values: [payload],
  });

  const { password, ...userUpdated } = queryResult.rows[0];
  return userUpdated;
};

export {
  createUserService,
  loginUserService,
  getUsersService,
  getUserProfileService,
  softDeleteUser,
  recoverUser,
};
