import { Request, Response } from "express";
import { BookingService } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Only student can book
    if (user.role !== "STUDENT") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { tutorId, date, startTime, endTime } = req.body;

    const booking = await BookingService.createBooking({
      studentId: user.id,
      tutorId,
      date,
      startTime,
      endTime,
    });

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Booking failed",
    });
  }
};

const getBookings = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const bookings = await BookingService.getUserBookings(user.id, user.role);

    return res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch bookings",
    });
  }
};

const getBookingDetails = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { id } = req.params;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const booking = await BookingService.getBookingById(id as string);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Security check
    if (
      user.role !== "ADMIN" &&
      booking.studentId !== user.id &&
      booking.tutorId !== user.id
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch booking details",
    });
  }
};

export const BookingController = {
  createBooking,
  getBookings,
  getBookingDetails,
};
