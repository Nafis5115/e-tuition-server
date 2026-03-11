import Tuition from "../models/tuition.model.js";

export const createTuition = async (req, res) => {
  try {
    const tuition = await Tuition.create(req.body);
    res.status(201).json(tuition);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
