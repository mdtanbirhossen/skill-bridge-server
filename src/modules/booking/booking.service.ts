import { BookingStatus, WeekDay } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const WEEKDAY_MAP: Record<string, WeekDay> = {
  MONDAY: WeekDay.MONDAY,
  TUESDAY: WeekDay.TUESDAY,
  WEDNESDAY: WeekDay.WEDNESDAY,
  THURSDAY: WeekDay.THURSDAY,
  FRIDAY: WeekDay.FRIDAY,
  SATURDAY: WeekDay.SATURDAY,
  SUNDAY: WeekDay.SUNDAY,
};
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

  const weekdayString = bookingDate
    .toLocaleDateString("en-US", { weekday: "long" })
    .toUpperCase();

  const day = WEEKDAY_MAP[weekdayString];

  if (!day) {
    throw new Error("Invalid booking day");
  }

  console.log(day);
  // check tutor available or not
  const availability = await prisma.availability.findFirst({
    where: {
      
        tutorId:data.tutorId,
      
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

const updateBooking = async (
  bookingId: string,
  user: {
    id: string;
    role: string;
  },
  data: {
    status: BookingStatus;
  },
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  // 🔒 Prevent changes on finished bookings
  if (
    booking.status === BookingStatus.CANCELLED ||
    booking.status === BookingStatus.COMPLETED
  ) {
    throw new Error("This booking can no longer be updated");
  }

  // 🔐 Permission rules
  if (user.role === "STUDENT") {
    if (booking.studentId !== user.id) {
      throw new Error("Forbidden");
    }

    if (data.status !== BookingStatus.CANCELLED) {
      throw new Error("Student can only cancel booking");
    }
  }

  if (user.role === "TUTOR") {
    if (booking.tutorId !== user.id) {
      throw new Error("Forbidden");
    }

    if (data.status !== BookingStatus.COMPLETED) {
      throw new Error("Tutor can only mark booking as completed");
    }
  }

  // ADMIN can do anything

  return prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: data.status,
    },
  });
};

export const BookingService = {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBooking,
};
