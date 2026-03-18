import TutorApplication from "../models/tutorApplication.model.js";

export const createTutorApplication = async (req, res) => {
  try {
    const { tutorEmail, tuitionId } = req.body;
    const existingApplication = await TutorApplication.findOne({
      tutorEmail,
      tuitionId,
    });
    if (existingApplication) {
      return res.status(200).json({ message: "Tutor already applied" });
    }
    const application = await TutorApplication.create(req.body);
    res.status(201).json(application);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const checkAlreadyApplied = async (req, res) => {
  try {
    const { tutorEmail, tuitionId } = req.query;
    if (!tutorEmail || !tuitionId) {
      return res.status(400).json({ message: "Missing data" });
    }

    const existingApplication = await TutorApplication.findOne({
      tutorEmail,
      tuitionId,
    });
    res.status(200).json({
      applied: !!existingApplication,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getApplicationsByTutor = async (req, res) => {
  try {
    const { email } = req.query;
    const applications = await TutorApplication.aggregate([
      {
        $match: { tutorEmail: email },
      },
      {
        $lookup: {
          from: "tuitions",
          localField: "tuitionId",
          foreignField: "_id",
          as: "tuition",
        },
      },
      {
        $unwind: "$tuition",
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);
    res.status(200).json(applications);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
