import { prisma } from "../../lib/prisma";
import { Role } from "../../../generated/prisma/enums";

const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      tutorProfile: true,
    },
  });

  return users;
};

const updateUserStatus = async (
  id: string,
  data: {
    isBanned?: boolean;
    role?: Role;
  }
) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data,
  });

  return updatedUser;
};

export const UserService = {
  getAllUsers,
  updateUserStatus,
};
