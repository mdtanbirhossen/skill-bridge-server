import { Request, Response } from "express";
import { StatisticService } from "./statistic.service";

const getAdminStats = async (_req: Request, res: Response) => {
  try {
    const stats = await StatisticService.getAdminStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to fetch admin stats" });
  }
};

const getTutorStats = async (req: Request, res: Response) => {
  try {
    const tutorId = req.user?.id; // assuming auth middleware sets req.user
    const stats = await StatisticService.getTutorStats(tutorId as string);
    res.status(200).json({ success: true, data: stats });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to fetch tutor stats" });
  }
};

const getStudentStats = async (req: Request, res: Response) => {
  try {
    const studentId = req.user?.id; // assuming auth middleware sets req.user
    const stats = await StatisticService.getStudentStats(studentId as string);
    res.status(200).json({ success: true, data: stats });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to fetch student stats" });
  }
};

export const StatisticController = {
  getAdminStats,
  getTutorStats,
  getStudentStats,
};
