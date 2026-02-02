import { Request, Response } from "express";
import { AvailabilityService } from "./availability.service";

const createAvailability = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    
    const { day, startTime, endTime } = req.body;

    if (!day || !startTime || !endTime ) {
      return res.status(400).json({
        success: false,
        message: "Day, startTime and endTime are required",
      });
    }

    const result = await AvailabilityService.createAvailability( {
      day,
      startTime,
      endTime,
      userId:req.user.id
    });

    res.status(201).json({
      success: true,
      message: "Availability created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyAvailability = async (req: Request, res: Response) => {
  try {
    const tutorId = req.user!.id;

    const result = await AvailabilityService.getAvailabilityByTutor(tutorId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateAvailability = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await AvailabilityService.updateAvailability(
      id as string,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Availability updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteAvailability = async (req: Request, res: Response) => {
  try {
    const tutorId = req.user!.id;
    const { id } = req.params;

    await AvailabilityService.deleteAvailability(id as string, tutorId);

    res.status(200).json({
      success: true,
      message: "Availability deleted successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const AvailabilityController = {
  createAvailability,
  getMyAvailability,
  updateAvailability,
  deleteAvailability,
};
