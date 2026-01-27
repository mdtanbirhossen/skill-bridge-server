import { BookingStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createBooking = async (data: {
  date: string;
  startTime: string;
  endTime: string;
  tutorId: string;
  studentId: string;
}) => {
  const bookingDate = new Date(data.date);
  if (bookingDate < new Date()) {
    throw new Error("Cannot book past dates");
  }

  const day = bookingDate
    .toLocaleDateString("en-US", { weekday: "long" })
    .toUpperCase();

  // check tutor available or not
  const availability = await prisma.availability.findFirst({
    where: {
      tutor: {
        userId: data.tutorId,
      },
      day,
      startTime: {
        lte: data.startTime,
      },
      endTime: {
        gte: data.endTime,
      },
    },
  });

  if (!availability) {
    throw new Error("Tutor is not available at this time");
  }

  // check for previous bookings
  const conflict = await prisma.booking.findFirst({
    where: {
      tutorId: data.tutorId,
      date: bookingDate,
      status: {
        not: BookingStatus.CANCELLED,
      },
      OR: [
        {
          startTime: {
            lt: data.endTime,
          },
          endTime: {
            gt: data.startTime,
          },
        },
      ],
    },
  });

  if (conflict) {
    throw new Error("This time slot is already booked");
  }

  // create booking
  const booking = await prisma.booking.create({
    data: {
      date: bookingDate,
      startTime: data.startTime,
      endTime: data.endTime,
      tutorId: data.tutorId,
      studentId: data.studentId,
      status: BookingStatus.CONFIRMED,
    },
  });

  return booking;
};

const getUserBookings = async (userId: string, role: string) => {
  if (role === "STUDENT") {
    return await prisma.booking.findMany({
      where: { studentId: userId },
      include: {
        tutor: true,
      },
      orderBy: { date: "desc" },
    });
  }

  if (role === "TUTOR") {
    return await prisma.booking.findMany({
      where: { tutorId: userId },
      include: {
        student: true,
      },
      orderBy: { date: "desc" },
    });
  }

  // ADMIN
  return await prisma.booking.findMany({
    include: {
      student: true,
      tutor: true,
    },
    orderBy: { date: "desc" },
  });
};

const getBookingById = async (bookingId: string) => {
  return await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      student: true,
      tutor: true,
      review: true,
    },
  });
};

export const BookingService = {
  createBooking,
  getUserBookings,
  getBookingById,
};
