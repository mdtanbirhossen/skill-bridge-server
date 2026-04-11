import { Router } from "express";
import { StatisticController } from "./statistic.controller";
import { auth } from "../../middleware/authentication";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

// Admin statistics
router.get("/admin", auth(Role.ADMIN), StatisticController.getAdminStats);

// Tutor statistics
router.get("/tutor", auth(Role.TUTOR), StatisticController.getTutorStats);

// Student statistics
router.get("/student", auth(Role.STUDENT), StatisticController.getStudentStats);

// Manager statistics
router.get("/manager", auth(Role.MANAGER), StatisticController.getManagerStats);

// Moderator statistics
router.get("/moderator", auth(Role.MODERATOR), StatisticController.getModeratorStats);

export const StatisticsRoutes = router;
