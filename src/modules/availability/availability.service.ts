import { WeekDay } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createAvailability = async (
  tutorId: string,
  data: {
    day: WeekDay;
    startTime: string;
    endTime: string;
  },
) => {
  // prevent duplicate slots
  const exists = await prisma.availability.findFirst({
    where: {
      tutorId,
      day: data.day,
      startTime: data.startTime,
      endTime: data.endTime,
    },
  });

  if (exists) {
    throw new Error("Availability slot already exists");
  }

  return prisma.availability.create({
    data: {
      tutorId,
      day: data.day,
      startTime: data.startTime,
      endTime: data.endTime,
    },
  });
};

const getAvailabilityByTutor = async (tutorId: string) => {
  return prisma.availability.findMany({
    where: { tutorId },
    orderBy: { day: "asc" },
  });
};

const updateAvailability = async (
  availabilityId: string,
  tutorId: string,
  data: {
    day?: WeekDay;
    startTime?: string;
    endTime?: string;
  },
) => {
  const availability = await prisma.availability.findFirst({
    where: {
      id: availabilityId,
      tutorId,
    },
  });

  if (!availability) {
    throw new Error("Availability not found");
  }

  return prisma.availability.update({
    where: { id: availabilityId },
    data,
  });
};

const deleteAvailability = async (availabilityId: string, tutorId: string) => {
  const availability = await prisma.availability.findFirst({
    where: {
      id: availabilityId,
      tutorId,
    },
  });

  if (!availability) {
    throw new Error("Availability not found");
  }

  return prisma.availability.delete({
    where: { id: availabilityId },
  });
};

export const AvailabilityService = {
  createAvailability,
  getAvailabilityByTutor,
  updateAvailability,
  deleteAvailability,
};
