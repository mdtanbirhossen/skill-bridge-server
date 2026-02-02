import { prisma } from "../../lib/prisma";

const getAdminStats = async () => {
  const totalUsers = await prisma.user.count();
  const totalStudents = await prisma.user.count({ where: { role: "STUDENT" } });
  const totalTutors = await prisma.user.count({ where: { role: "TUTOR" } });
  const totalAdmins = await prisma.user.count({ where: { role: "ADMIN" } });

  const totalBookings = await prisma.booking.count();
  const completedBookings = await prisma.booking.count({ where: { status: "COMPLETED" } });
  const cancelledBookings = await prisma.booking.count({ where: { status: "CANCELLED" } });
  const confirmedBookings = await prisma.booking.count({ where: { status: "CONFIRMED" } });

  const totalCategories = await prisma.category.count();
  const totalReviews = await prisma.review.count();

  return {
    totalUsers,
    totalStudents,
    totalTutors,
    totalAdmins,
    totalBookings,
    completedBookings,
    cancelledBookings,
    confirmedBookings,
    totalCategories,
    totalReviews,
  };
};

const getTutorStats = async (tutorId: string) => {
  const totalBookings = await prisma.booking.count({ where: { tutor:{userId:tutorId} } });
  const completedBookings = await prisma.booking.count({ where: { tutor:{userId:tutorId}, status: "COMPLETED" } });
  const upcomingBookings = await prisma.booking.count({ where: { tutor:{userId:tutorId}, status: "CONFIRMED" } });
  const cancelledBookings = await prisma.booking.count({ where: { tutor:{userId:tutorId}, status: "CANCELLED" } });

  const averageRating = await prisma.tutorProfile.findUnique({
    where: { userId: tutorId },
  });

  const totalReviews = await prisma.review.count({ where: { tutor:{userId:tutorId} } });

  const totalAvailability = await prisma.availability.count({ where: { tutor:{userId:tutorId} } });

  return {
    totalBookings,
    completedBookings,
    upcomingBookings,
    averageRating: averageRating?.rating || 0,
    totalReviews,
    totalAvailability,
    cancelledBookings
  };
};

const getStudentStats = async (studentId: string) => {
  const totalBookings = await prisma.booking.count({ where: { studentId } });
  const completedBookings = await prisma.booking.count({ where: { studentId, status: "COMPLETED" } });
  const upcomingBookings = await prisma.booking.count({ where: { studentId, status: "CONFIRMED" } });
  const cancelledBookings = await prisma.booking.count({ where: { studentId, status: "CANCELLED" } });


  return {
    totalBookings,
    completedBookings,
    upcomingBookings,
    cancelledBookings,
  };
};

export const StatisticService = {
  getAdminStats,
  getTutorStats,
  getStudentStats,
};
