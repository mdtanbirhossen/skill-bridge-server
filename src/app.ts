import express from "express";
import cors from "cors";
import { TutorProfileRoutes } from "./modules/tutor/tutor.routes";
import { AuthRoutes } from "./modules/auth/auth.routes";
import cookieParser from "cookie-parser";
import { CategoryRoutes } from "./modules/category/category.routes";

const app = express();

app.use(
  cors({
    origin: process.env.APP_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", AuthRoutes);
app.use("/api/category", CategoryRoutes);
app.use("/api/tutor", TutorProfileRoutes);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

export default app;
