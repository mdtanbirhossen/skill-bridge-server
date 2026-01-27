import { Router } from "express";
import { UserController } from "./user.controller";
import { auth } from "../../middleware/authentication";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get(
  "/",
  auth(Role.ADMIN),
  UserController.getAllUsers
);

router.patch(
  "/:id",
  auth(Role.ADMIN),
  UserController.updateUserStatus
);

export const UserRoutes = router;
