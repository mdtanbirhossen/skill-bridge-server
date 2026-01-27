import { Request, Response } from "express";
import { CategoryService } from "./category.service";

// create
const createCategory = async (req: Request, res: Response) => {
  try {
    const result = await CategoryService.createCategory(req.body);
    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Category creation failed",
    });
  }
};

// get all
const getAllCategories = async (_req: Request, res: Response) => {
  try {
    const result = await CategoryService.getAllCategories();
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to fetch categories",
    });
  }
};

// get by id
const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await CategoryService.getCategoryById(id as string);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to fetch category",
    });
  }
};

// update
const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await CategoryService.updateCategory(id as string, req.body);

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Category update failed",
    });
  }
};

// delete
const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await CategoryService.deleteCategory(id as string);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Category deletion failed",
    });
  }
};

export const CategoryController = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
