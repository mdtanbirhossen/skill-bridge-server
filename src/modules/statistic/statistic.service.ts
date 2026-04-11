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

  // Pie Chart Data
  const bookingsByStatus = [
    { name: "Completed", value: completedBookings },
    { name: "Cancelled", value: cancelledBookings },
    { name: "Confirmed", value: confirmedBookings },
  ];

  // Bar / Line Chart Data
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const recentBookingsData = await prisma.booking.findMany({
    where: { createdAt: { gte: sixMonthsAgo } },
    select: { createdAt: true }
  });
  const monthlyData = recentBookingsData.reduce((acc, booking) => {
    const month = booking.createdAt.toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const bookingsByMonth = Object.entries(monthlyData).map(([name, value]) => ({ name, value }));

  // Dynamic Table Data
  const recentBookings = await prisma.booking.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      student: { select: { name: true, email: true } },
      tutor: { include: { user: { select: { name: true } } } }
    }
  });

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
    bookingsByStatus,
    bookingsByMonth,
    recentBookings,
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

  const bookingsByStatus = [
    { name: "Completed", value: completedBookings },
    { name: "Cancelled", value: cancelledBookings },
    { name: "Confirmed", value: upcomingBookings },
  ];

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const recentBookingsData = await prisma.booking.findMany({
    where: { tutor: { userId: tutorId }, createdAt: { gte: sixMonthsAgo } },
    select: { createdAt: true }
  });
  const monthlyData = recentBookingsData.reduce((acc, booking) => {
    const month = booking.createdAt.toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const bookingsByMonth = Object.entries(monthlyData).map(([name, value]) => ({ name, value }));

  const recentBookings = await prisma.booking.findMany({
    where: { tutor: { userId: tutorId } },
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { student: { select: { name: true, email: true } } }
  });

  return {
    totalBookings,
    completedBookings,
    upcomingBookings,
    averageRating: averageRating?.rating || 0,
    totalReviews,
    totalAvailability,
    cancelledBookings,
    bookingsByStatus,
    bookingsByMonth,
    recentBookings,
  };
};

const getStudentStats = async (studentId: string) => {
  const totalBookings = await prisma.booking.count({ where: { studentId } });
  const completedBookings = await prisma.booking.count({ where: { studentId, status: "COMPLETED" } });
  const upcomingBookings = await prisma.booking.count({ where: { studentId, status: "CONFIRMED" } });
  const cancelledBookings = await prisma.booking.count({ where: { studentId, status: "CANCELLED" } });

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const recentBookingsData = await prisma.booking.findMany({
    where: { studentId, createdAt: { gte: sixMonthsAgo } },
    select: { createdAt: true }
  });
  const monthlyData = recentBookingsData.reduce((acc, booking) => {
    const month = booking.createdAt.toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const bookingsByMonth = Object.entries(monthlyData).map(([name, value]) => ({ name, value }));

  const bookingsByStatus = [
    { name: "Completed", value: completedBookings },
    { name: "Cancelled", value: cancelledBookings },
    { name: "Confirmed", value: upcomingBookings },
  ];

  const recentBookings = await prisma.booking.findMany({
    where: { studentId },
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { tutor: { include: { user: { select: { name: true } } } } }
  });

  return {
    totalBookings,
    completedBookings,
    upcomingBookings,
    cancelledBookings,
    bookingsByStatus,
    bookingsByMonth,
    recentBookings,
  };
};

const getManagerStats = async () => {
  const totalTutors = await prisma.user.count({ where: { role: "TUTOR" } });
  const totalCategories = await prisma.category.count();
  const totalUsers = await prisma.user.count();
  
  // High-level category distribution for manager
  const categories = await prisma.category.findMany({
    include: { _count: { select: { tutors: true } } }
  });
  const categoryHealth = categories.map(c => ({ name: c.name, value: c._count.tutors }));

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const userGrowthData = await prisma.user.findMany({
    where: { createdAt: { gte: sixMonthsAgo } },
    select: { createdAt: true }
  });
  const monthlyUsers = userGrowthData.reduce((acc, user) => {
    const month = user.createdAt.toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const userGrowth = Object.entries(monthlyUsers).map(([name, value]) => ({ name, value }));

  return {
    totalTutors,
    totalCategories,
    totalUsers,
    categoryHealth,
    userGrowth,
  };
};

const getModeratorStats = async () => {
  const totalReviews = await prisma.review.count();
  const totalBookings = await prisma.booking.count();
  const bannedUsers = await prisma.user.count({ where: { isBanned: true } });
  
  const bookingsByStatus = await prisma.booking.groupBy({
    by: ['status'],
    _count: true
  });
  const statusDistribution = bookingsByStatus.map(s => ({ name: s.status, value: s._count }));

  const recentReviews = await prisma.review.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { 
      student: { select: { name: true } },
      tutor: { include: { user: { select: { name: true } } } }
    }
  });

  return {
    totalReviews,
    totalBookings,
    bannedUsers,
    statusDistribution,
    recentReviews,
  };
};

export const StatisticService = {
  getAdminStats,
  getTutorStats,
  getStudentStats,
  getManagerStats,
  getModeratorStats,
};
