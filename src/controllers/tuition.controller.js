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

export const getTuitionsByUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;
    const userEmail = req.query.email;
    if (userEmail !== req.headers.token_email) {
      return res.status(403).send({ message: "Forbidden Access!" });
    }
    const query = { userEmail };
    const tuitions = await Tuition.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Tuition.countDocuments(query);
    res.status(200).json({
      data: tuitions,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
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

export const getAllTuitions = async (req, res) => {
  try {
    // const query = { status: "approved" };
    const { class: classFilter, sort, search } = req.query;
    const query = {};
    if (classFilter) {
      query.class = classFilter;
    }
    if (search) {
      query.subject = { $regex: search, $options: "i" };
    }
    let sortOption = { createdAt: -1 };
    if (sort === "budget-asc") {
      sortOption = { budget: 1 };
    }
    if (sort === "budget-desc") {
      sortOption = { budget: -1 };
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;
    const tuitions = await Tuition.find(query)
      .skip(skip)
      .limit(limit)
      .sort(sortOption);
    const total = await Tuition.countDocuments();
    res.status(200).json({
      tuitions,
      page,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
