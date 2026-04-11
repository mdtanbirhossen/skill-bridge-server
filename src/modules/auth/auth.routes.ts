import express, { NextFunction, Request, Response } from "express";
import { AuthController } from "./auth.controller";
import { auth } from "../../middleware/authentication";
import { Role } from "../../../generated/prisma/enums";

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/social-login", AuthController.socialLogin);
router.get("/me", auth(Role.STUDENT, Role.ADMIN, Role.TUTOR, Role.MANAGER, Role.MODERATOR ), AuthController.getCurrentUser);
router.patch("/:id", auth(Role.ADMIN,Role.TUTOR,Role.STUDENT, Role.MANAGER, Role.MODERATOR), AuthController.updateUser);

export const AuthRoutes = router;
