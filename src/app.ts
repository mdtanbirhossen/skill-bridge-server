import express from "express";
import cors from "cors";
import { TutorProfileRoutes } from "./modules/tutor/tutor.routes";
import { AuthRoutes } from "./modules/auth/auth.routes";
import cookieParser from "cookie-parser";
import { CategoryRoutes } from "./modules/category/category.routes";
import { BookingRoutes } from "./modules/booking/booking.routes";
import { ReviewRoutes } from "./modules/review/review.routes";
import { AvailabilityRoutes } from "./modules/availability/availability.routes";
import { UserRoutes } from "./modules/user/user.routes";

const app = express();

app.use(
  cors({
    origin: [ process.env.APP_URL || "http://localhost:3000" , "http://localhost:3000", "https://skill-bridge-client-psi.vercel.app"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", AuthRoutes);
app.use("/api/category", CategoryRoutes);
app.use("/api/tutor", TutorProfileRoutes);
app.use("/api/booking", BookingRoutes);
app.use("/api/review", ReviewRoutes);
app.use("/api/availability", AvailabilityRoutes);
app.use("/api/user", UserRoutes);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

export default app;
