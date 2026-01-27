import { Router } from "express";
import { ReviewController } from "./review.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/authentication";

const router = Router();

router.post(
  "/",
  auth(Role.STUDENT),
  ReviewController.createReview
);

router.get(
  "/tutor/:tutorId",
  ReviewController.getTutorReviews
);

router.get(
  "/me",
  auth(Role.STUDENT),
  ReviewController.getMyReviews
);

router.patch(
  "/:reviewId",
  auth(Role.STUDENT),
  ReviewController.updateReview
);

router.delete(
  "/:reviewId",
  auth(Role.STUDENT),
  ReviewController.deleteReview
);

export const ReviewRoutes = router;
