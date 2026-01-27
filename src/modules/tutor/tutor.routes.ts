import express, { NextFunction, Request, Response } from "express";
import { auth } from "../../middleware/authentication";
import { TutorProfileController } from "./tutor.controller";
import { Role } from "../../../generated/prisma/enums";

const router = express.Router();

router.post("/", auth(Role.TUTOR), TutorProfileController.createTutorProfile);
router.get("/", TutorProfileController.getAllTutorProfile);
router.get("/:id", TutorProfileController.getTutorProfileById);
router.put("/profile", auth(Role.TUTOR), TutorProfileController.upsertTutorProfile);

export const TutorProfileRoutes = router;
