import { Request, Response } from "express";
import paginationSortingHelper from "../../utils/paginationSorting";
import { TutorProfileService } from "./tutor.service";

const createTutorProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const result = await TutorProfileService.createTutorProfile(req.body, user.id);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllTutorProfile = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const categories = req.query.categories
      ? (req.query.categories as string).split(",")
      : [];

    const { page, limit, sortBy, sortOrder, skip } = paginationSortingHelper(
      req.query as any
    );

    const result = await TutorProfileService.getAllTutorProfiles({
      search: search as string | undefined,
      categories,
      page,
      limit,
      sortBy,
      sortOrder,
      skip,
    });

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const getTutorProfileById = async (req: Request, res: Response) => {
  try {
    console.log(req.params.id)
    const result = await TutorProfileService.getTutorProfileById(req.params.id as string);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const TutorProfileController = {
  createTutorProfile,
  getAllTutorProfile,
  getTutorProfileById,
};
