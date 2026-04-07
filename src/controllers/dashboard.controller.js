import Payment from "../models/payment.model.js";
import Tuition from "../models/tuition.model.js";
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
