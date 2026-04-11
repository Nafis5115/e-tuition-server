import Tuition from "../models/tuition.model.js";
import { ObjectId } from "mongodb";
import TutorApplication from "../models/tutorApplication.model.js";

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

export const getAllApprovedTuitions = async (req, res) => {
  try {
    const { class: classFilter, sort, search } = req.query;
    const query = { status: "approved", paymentStatus: "unpaid" };
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

export const updateTuition = async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const update = {
      $set: req.body,
    };
    const tuition = await Tuition.updateOne(query, update);
    res.status(200).json(tuition);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteTuition = async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const deleteTuition = await Tuition.deleteOne(query);
    const deleteAppliedTutor = await TutorApplication.deleteMany({
      tuitionId: id,
    });
    res.status(200).json({ deleteTuition, deleteAppliedTutor });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getAppliedTutors = async (req, res) => {
  try {
    const userEmail = req.query.email;
    const appliedTutors = await Tuition.aggregate([
      {
        $match: { userEmail },
      },
      {
        $lookup: {
          from: "tutorapplications",
          localField: "_id",
          foreignField: "tuitionId",
          as: "applications",
        },
      },
      {
        $unwind: "$applications",
      },
      {
        $lookup: {
          from: "tutorprofiles",
          localField: "applications.tutorEmail",
          foreignField: "email",
          as: "tutor",
        },
      },
      {
        $unwind: "$tutor",
      },
      {
        $lookup: {
          from: "users",
          localField: "applications.tutorEmail",
          foreignField: "email",
          as: "user",
        },
      },

      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true, // avoids crash if no user found
        },
      },
      {
        $project: {
          _id: "$applications._id",
          tuitionId: "$_id",
          tutorId: "$user._id",
          subject: 1,
          budget: 1,
          photoURL: "$user.photoURL",
          tutorName: "$tutor.name",
          tutorEmail: "$tutor.email",
          tutorLocation: "$tutor.location",
          experience: "$tutor.experience",
          status: "$applications.status",
          createdAt: 1,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);
    res.json(appliedTutors);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const rejectAppliedTutors = async (req, res) => {
  try {
    const { id } = req.params;
    const query = { _id: new ObjectId(id) };
    const update = {
      $set: {
        status: "rejected",
      },
    };
    const result = await TutorApplication.updateOne(query, update);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllTuitions = async (req, res) => {
  try {
    const tuitions = await Tuition.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userEmail",
          foreignField: "email",
          as: "tutor",
        },
      },
      {
        $unwind: "$tutor",
      },
      {
        $addFields: {
          tutorName: "$tutor.name",
        },
      },

      {
        $unset: ["tutor"],
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);
    res.status(200).json(tuitions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const manageTuition = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const query = { _id: new ObjectId(id) };
    const update = {
      $set: { status },
    };
    const result = await Tuition.updateOne(query, update);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getTutorOngoingTuitions = async (req, res) => {
  try {
    const { email } = req.query;
    const ongoingTuitions = await Tuition.aggregate([
      {
        $match: { assignedTutor: email },
      },
      {
        $lookup: {
          from: "users",
          localField: "userEmail",
          foreignField: "email",
          as: "student",
        },
      },
      {
        $unwind: "$student",
      },
      {
        $addFields: {
          studentName: "$student.name",
        },
      },
      {
        $unset: ["student"],
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);
    res.status(200).json(ongoingTuitions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
