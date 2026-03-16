import TutorProfile from "../models/tutorProfile.model.js";

export const createTutorProfile = async (req, res) => {
  try {
    const { email } = req.body;
    if (req.headers.token_email !== email) {
      return res.status(403).send({ message: "Forbidden Access" });
    }
    const existingTutorProfile = await TutorProfile.findOne({ email });
    if (existingTutorProfile) {
      return res
        .status(200)
        .json({ message: "TutorProfile already in database" });
    }
    const tutorProfile = await TutorProfile.create(req.body);
    res.status(201).json(tutorProfile);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getTutorApplicationStatus = async (req, res) => {
  try {
    const { email } = req.query;
    if (req.headers.token_email !== email) {
      return res.status(403).send({ message: "Forbidden Access" });
    }
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const tutorProfile = await TutorProfile.findOne({ email });
    if (!tutorProfile) {
      return res.status(200).json({ status: null });
    }
    res.status(200).json({ status: tutorProfile.status });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getTutorDetails = async (req, res) => {
  try {
    const { email } = req.query;
    if (req.headers.token_email !== email) {
      return res.status(403).send({ message: "Forbidden Access" });
    }
    const tutorDetails = await TutorProfile.findOne({ email });
    res.status(200).json(tutorDetails);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const updateTutorProfile = async (req, res) => {
  try {
    const { email } = req.query;
    if (req.headers.token_email !== email) {
      return res.status(403).send({ message: "Forbidden Access" });
    }
    const query = { email };
    const updateProfile = {
      $set: req.body,
    };
    const updatedTutor = await TutorProfile.updateOne(query, updateProfile);
    res.status(200).json(updatedTutor);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
