import { Request, Response } from "express";
import { UserService } from "./user.service";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserService.getAllUsers();

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch users",
    });
  }
};

const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await UserService.updateUserStatus(id as string, req.body);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update user",
    });
  }
};

export const UserController = {
  getAllUsers,
  updateUserStatus,
};
