import { Request, Response } from "express";
import {
  createUserService,
  getUserProfileService,
  getUsersService,
  loginUserService,
  recoverUser,
  softDeleteUser,
} from "../services/userServices";

const createUser = async (req: Request, res: Response) => {
  const response = await createUserService(req.body);
  return res.status(201).json(response);
};

const loginUser = async (req: Request, res: Response) => {
  const response = await loginUserService(req.body);
  return res.status(200).json(response);
};

const getUsers = async (req: Request, res: Response) => {
  const response = await getUsersService();
  return res.status(200).json(response);
};

const getUserProfile = async (req: Request, res: Response) => {
  const response = await getUserProfileService(req.headers.authorization!);
  return res.status(200).json(response);
};

const softDelete = async (req: Request, res: Response) => {
  await softDeleteUser(req.params.id);
  return res.status(204).json({});
};

const recoverUserSoft = async (req: Request, res: Response) => {
  const response = await recoverUser(req.params.id);
  return res.status(200).json(response);
};

export {
  createUser,
  loginUser,
  getUsers,
  getUserProfile,
  softDelete,
  recoverUserSoft,
};
