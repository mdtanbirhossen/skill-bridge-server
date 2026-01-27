import { Router } from "express";
import { BookingController } from "./booking.controller";
import { auth } from "../../middleware/authentication";

const router = Router();

router.post("/", auth("STUDENT"), BookingController.createBooking);
router.get("/", auth("STUDENT", "TUTOR", "ADMIN"), BookingController.getBookings);
router.get("/:id", auth("STUDENT", "TUTOR", "ADMIN"), BookingController.getBookingDetails);

export const BookingRoutes = router;
