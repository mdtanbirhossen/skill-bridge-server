import { Router } from "express";
import { AIController } from "./ai.controller";

const router = Router();

router.post("/chat", AIController.chat);
router.post("/suggest", AIController.suggest);

export const AIRoutes = router;
