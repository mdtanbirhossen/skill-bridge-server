import { Request, Response } from "express";
import { ReviewService } from "./review.service";

// create review
const createReview = async (req: Request, res: Response) => {
  try {
    const { rating, comment, tutorId, bookingId } = req.body;
    const studentId = req.user!.id;

    const review = await ReviewService.createReview({
      rating,
      comment,
      studentId,
      tutorId,
      bookingId,
    });

    return res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// get reviews for tutor
const getTutorReviews = async (req: Request, res: Response) => {
  try {
    const { tutorId } = req.params;

    const reviews = await ReviewService.getReviewsByTutor(tutorId as string);

    return res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// get reviews by student id
const getMyReviews = async (req: Request, res: Response) => {
  try {
    const studentId = req.user!.id;

    const reviews = await ReviewService.getReviewsByStudent(
      studentId as string,
    );

    return res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// update review
const updateReview = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    const studentId = req.user!.id;

    const review = await ReviewService.updateReview(
      reviewId as string,
      studentId,
      req.body,
    );

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: review,
    });
  } catch (error: any) {
    return res.status(403).json({
      success: false,
      message: error.message,
    });
  }
};

// delete review
const deleteReview = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    const studentId = req.user!.id;

    const result = await ReviewService.deleteReview(
      reviewId as string,
      studentId,
    );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    return res.status(403).json({
      success: false,
      message: error.message,
    });
  }
};

export const ReviewController = {
  createReview,
  getTutorReviews,
  getMyReviews,
  updateReview,
  deleteReview,
};
