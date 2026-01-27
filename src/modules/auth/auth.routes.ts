import express, { NextFunction, Request, Response } from "express";
import { AuthController } from "./auth.controller";
import { auth } from "../../middleware/authentication";
import { Role } from "../../../generated/prisma/enums";

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/me", auth(Role.STUDENT, Role.ADMIN, Role.TUTOR ), AuthController.getCurrentUser);


export const AuthRoutes = router;
