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

export const getTuitionByUser = async (req, res) => {
  try {
    const userEmail = req.query.email;
    const query = { userEmail };
    const tuitions = await Tuition.find(query).sort({ createdAt: -1 });
    res.status(200).json(tuitions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getTuitionDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const tuition = await Tuition.findById(id);
    res.status(200).json(tuition);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
