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
