import Payment from "../models/payment.model.js";
import Tuition from "../models/tuition.model.js";
import User from "../models/user.model.js";
import TutorApplication from "../models/tutorApplication.model.js";

export const getStudentDashboard = async (req, res) => {
  try {
    const { email } = req.query;
    const activeTuitions = await Tuition.countDocuments({
      userEmail: email.trim().toLowerCase(),
      status: "assigned",
    });

    const pendingTuitions = await Tuition.countDocuments({
      userEmail: email,
      status: "pending",
    });

    const userTuitions = await Tuition.find({ userEmail: email }).select("_id");
    const tuitionIds = userTuitions.map((t) => t._id);
    const tutorApplications = await TutorApplication.countDocuments({
      tuitionId: { $in: tuitionIds },
    });

    const payments = await Payment.aggregate([
      {
        $match: { userEmail: email },
      },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: "$amount" },
        },
      },
    ]);
    const totalSpent = payments[0]?.totalSpent || 0;

    res.json({
      activeTuitions,
      tutorApplications,
      pendingTuitions,
      totalSpent,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getTutorDashboard = async (req, res) => {
  try {
    const { email } = req.query;
    const activeApplications = await TutorApplication.countDocuments({
      tutorEmail: email,
      status: "pending",
    });

    const ongoingTuitions = await Tuition.countDocuments({
      assignedTutor: email,
    });

    const earnings = await Payment.aggregate([
      {
        $match: { tutorEmail: email },
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: "$tutorAmount" },
        },
      },
    ]);

    const totalEarnings = earnings[0]?.totalEarnings || 0;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const monthlyEarningsAgg = await Payment.aggregate([
      {
        $match: {
          tutorEmail: email,
          createdAt: {
            $gte: startOfMonth,
            $lt: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: null,
          monthlyEarnings: { $sum: "$tutorAmount" },
        },
      },
    ]);
    const monthlyEarnings = monthlyEarningsAgg[0]?.monthlyEarnings || 0;

    res.status(200).json({
      activeApplications,
      ongoingTuitions,
      totalEarnings,
      monthlyEarnings,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const activeTuitions = await Tuition.countDocuments({ status: "approved" });

    const revenueAgg = await Payment.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$adminCommission" },
        },
      },
    ]);
    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const monthlyRevenueAgg = await Payment.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfMonth,
            $lt: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: null,
          monthlyRevenue: { $sum: "$adminCommission" },
        },
      },
    ]);
    const monthlyRevenue = monthlyRevenueAgg[0]?.monthlyRevenue || 0;

    res
      .status(200)
      .json({ totalUsers, activeTuitions, totalRevenue, monthlyRevenue });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getAdminReportsAndAnalytics = async (req, res) => {
  try {
    const totalUser = await User.countDocuments();
    const studentsCount = await User.countDocuments({ role: "student" });
    const tutorCount = await User.countDocuments({ role: "tutor" });
    const adminCount = await User.countDocuments({ role: "admin" });

    const revenueAgg = await Payment.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$adminCommission" },
        },
      },
    ]);
    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const monthlyRevenueAgg = await Payment.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfMonth,
            $lt: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: null,
          monthlyRevenue: { $sum: "$adminCommission" },
        },
      },
    ]);
    const monthlyRevenue = monthlyRevenueAgg[0]?.monthlyRevenue || 0;

    const paymentCount = await Payment.countDocuments();

    const monthlyRevenueData = await Payment.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$adminCommission" },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const formattedMonthlyRevenue = monthlyRevenueData.map((item) => ({
      month: months[item._id.month - 1],
      revenue: item.revenue,
    }));

    const tuitionApprovalsData = await Tuition.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalApproved: {
            $sum: {
              $cond: [{ $in: ["$status", ["approved", "assigned"]] }, 1, 0],
            },
          },
          totalRejected: {
            $sum: {
              $cond: [{ $in: ["$status", ["rejected"]] }, 1, 0],
            },
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);
    const formattedTuitionApproval = tuitionApprovalsData.map((t) => ({
      month: months[t._id.month - 1],
      totalApproved: t.totalApproved,
      totalRejected: t.totalRejected,
    }));

    res.status(200).json({
      studentsCount,
      totalUser,
      tutorCount,
      adminCount,
      totalRevenue,
      monthlyRevenue,
      paymentCount,
      monthlyRevenueChart: formattedMonthlyRevenue,
      tuitionApprovalsChart: formattedTuitionApproval,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
