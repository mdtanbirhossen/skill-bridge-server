import { prisma } from "../../lib/prisma";

// create review
const createReview = async (data: {
  rating: number;
  comment?: string;
  studentId: string;
  tutorId: string;
  bookingId: string;
}) => {
  if (data.rating < 1 || data.rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  // Ensure booking exists 
  const booking = await prisma.booking.findUnique({
    where: { id: data.bookingId },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (
    booking.studentId !== data.studentId ||
    booking.tutorId !== data.tutorId
  ) {
    throw new Error("Invalid booking for this review");
  }

  const review = await prisma.review.create({
    data,
  });

  return review;
};

// get all review of tutor
const getReviewsByTutor = async (tutorId: string) => {
  return prisma.review.findMany({
    where: { tutorId },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// get all review of student
const getReviewsByStudent = async (studentId: string) => {
  return prisma.review.findMany({
    where: { studentId },
    include: {
      tutor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      booking: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// update review
const updateReview = async (
  reviewId: string,
  studentId: string,
  data: {
    rating?: number;
    comment?: string;
  }
) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review || review.studentId !== studentId) {
    throw new Error("Unauthorized or review not found");
  }

  if (data.rating && (data.rating < 1 || data.rating > 5)) {
    throw new Error("Rating must be between 1 and 5");
  }

  return prisma.review.update({
    where: { id: reviewId },
    data,
  });
};

// delete review
const deleteReview = async (reviewId: string, studentId: string) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review || review.studentId !== studentId) {
    throw new Error("Unauthorized or review not found");
  }

  await prisma.review.delete({
    where: { id: reviewId },
  });

  return { message: "Review deleted successfully" };
};

export const ReviewService = {
  createReview,
  getReviewsByTutor,
  getReviewsByStudent,
  updateReview,
  deleteReview,
};
