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
