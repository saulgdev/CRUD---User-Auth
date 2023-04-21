import { Router } from "express";
import {
  createUser,
  getUserProfile,
  getUsers,
  loginUser,
  recoverUserSoft,
  softDelete,
  updateUser,
} from "../controllers/userController";
import { verifyUser } from "../middleware/verifyUser";
import { verifyLogin } from "../middleware/verifyLogin";
import { verifyAuth } from "../middleware/verifyAuth";
import { verifyDelete } from "../middleware/verifyDelete";
import { verifyRecover } from "../middleware/verifyRecover";
import { verifyUpdate } from "../middleware/verifyUpdate";

const userRoutes: Router = Router();

userRoutes.post("/users", verifyUser, createUser);
userRoutes.post("/login", verifyLogin, loginUser);
userRoutes.get("/users/profile", verifyAuth, getUserProfile);
userRoutes.get("/users", verifyAuth, getUsers);
userRoutes.patch("/users/:id", verifyUpdate, updateUser);
userRoutes.delete("/users/:id", verifyDelete, softDelete);
userRoutes.put("/users/:id/recover", verifyRecover, recoverUserSoft);

export default userRoutes;
