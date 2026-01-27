import { Router } from "express";
import { AvailabilityController } from "./availability.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/authentication";

const router = Router();

router.post("/", auth(Role.TUTOR), AvailabilityController.createAvailability);

router.get("/me", auth(Role.TUTOR), AvailabilityController.getMyAvailability);

router.put("/:id", auth(Role.TUTOR), AvailabilityController.updateAvailability);

router.delete("/:id", auth(Role.TUTOR), AvailabilityController.deleteAvailability);

export const AvailabilityRoutes = router;
