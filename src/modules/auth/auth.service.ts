import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Role } from "../../../generated/prisma/enums";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = "7d";

type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role?: Role;
  phone?: string;
  image?: string;
  emailVerified?: boolean;
  isBanned?: boolean;
};
// create user

const createUser = async (data: CreateUserInput) => {
  // check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  // hash password
  const hashedPassword = await bcrypt.hash(data.password, 12);

  // create user
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role ?? Role.STUDENT,
      phone: data.phone ?? null,
      image: data.image ?? null,
      emailVerified: data.emailVerified ?? false,
      isBanned: data.isBanned ?? false,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      image: true,
      emailVerified: true,
      isBanned: true,
      createdAt: true,
    },
  });

  // generate jwt
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isBanned: user.isBanned,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );

  return { user, token };
};

// sign in user
const signInUser = async (data: { email: string; password: string }) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (user.isBanned) {
    throw new Error("Can't Login! You are Banned by Admin!");
  }

  const isPasswordMatch = await bcrypt.compare(data.password, user.password);

  if (!isPasswordMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isBanned: user.isBanned,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );

  return { user, token };
};

const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      image: true,
      isBanned: true,
      updatedAt: true,
      createdAt: true,
      tutorProfile: {
        include: {
          category: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const updateUser = async (
  id: string,
  data: {
    name?: string;
    phone?: string;
    image?: string;
    role?: Role;
    isBanned?: boolean;
  },
) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("User not found");

  return prisma.user.update({
    where: { id },
    data,
  });
};

export const AuthService = {
  createUser,
  signInUser,
  getUserById,
  updateUser,
};
