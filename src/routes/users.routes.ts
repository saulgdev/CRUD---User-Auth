import { Router } from "express";
import {
  createUser,
  getUserProfile,
  getUsers,
  loginUser,
  recoverUserSoft,
  softDelete,
} from "../controllers/userController";
import { verifyUser } from "../middleware/verifyUser";
import { verifyLogin } from "../middleware/verifyLogin";
import { verifyAuth } from "../middleware/verifyAuth";
import { verifyDelete } from "../middleware/verifyDelete";
import { verifyRecover } from "../middleware/verifyRecover";

const userRoutes: Router = Router();

userRoutes.post("/users", verifyUser, createUser);
userRoutes.post("/login", verifyLogin, loginUser);
userRoutes.get("/users/profile", verifyAuth, getUserProfile);
userRoutes.get("/users", verifyAuth, getUsers);
userRoutes.patch("/users/:id");
userRoutes.delete("/users/:id", verifyDelete, softDelete);
userRoutes.put("/users/:id/recover", verifyRecover, recoverUserSoft);

export default userRoutes;
