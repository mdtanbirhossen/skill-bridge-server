import { TutorProfile } from "../../../generated/prisma/client";
import { TutorProfileWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createTutorProfile = async (
  data: Omit<TutorProfile, "id" | "createdAt" | "updatedAt" | "userId">,
  userId: string,
) => {
  const result = await prisma.tutorProfile.create({
    data: {
      ...data,
      userId,
    },
  });
  return result;
};

const getAllTutorProfiles = async ({
  search,
  category,
  page,
  limit,
  skip,
  sortBy,
  sortOrder,
}: {
  search: string | undefined;
  category: string;
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}) => {
  const andConditions: any[] = [];

  // Search by tutor bio or user name
  if (search) {
    andConditions.push({
      OR: [
        {
          bio: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          subjects: {
            has: search,
          },
        },
        {
          user: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ],
    });
  }

  // Filter by categories
  if (category && category.length > 0) {
    andConditions.push({
      category: {
        name: { contains: category,
            mode: "insensitive", },
      },
    });
  }

  const result = await prisma.tutorProfile.findMany({
    skip,
    take: limit,
    where: {
      AND: andConditions,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      user: true,
      category: true,
      availability: true,
    },
  });

  const total = await prisma.tutorProfile.count({
    where: {
      AND: andConditions,
    },
  });

  return {
    data: result,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getTutorProfileById = async (id: string) => {
  const result = await prisma.tutorProfile.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
      category: true,
      availability: true,
    },
  });
  return result;
};

export const TutorProfileService = {
  createTutorProfile,
  getAllTutorProfiles,
  getTutorProfileById,
};
