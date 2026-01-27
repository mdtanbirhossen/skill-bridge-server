import { prisma } from "../../lib/prisma";

// create category
const createCategory = async (data: { name: string }) => {
  return prisma.category.create({
    data,
  });
};

// get all categories
const getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });
};

// get category by id
const getCategoryById = async (id: string) => {
  return prisma.category.findUnique({
    where: { id },
    include: {
      tutors: true, // optional
    },
  });
};

// update category
const updateCategory = async (id: string, data: { name?: string }) => {
  return prisma.category.update({
    where: { id },
    data,
  });
};

// delete category
const deleteCategory = async (id: string) => {
  return prisma.category.delete({
    where: { id },
  });
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
