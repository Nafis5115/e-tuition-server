import mongoose from "mongoose";
import User from "../models/user.model.js";
import { ObjectId } from "mongodb";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).json({ message: "User already in database" });
    }
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getUserPhone = async (req, res) => {
  try {
    const email = req.query.email;
    if (req.headers.token_email !== email) {
      return res.status(403).send({ message: "Forbidden Access" });
    }
    const query = { email };
    const user = await User.findOne(query);
    res.status(200).json({ phone: user.phone });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { phone, name, email } = req.body;
    if (req.headers.token_email !== email) {
      return res.status(403).send({ message: "Forbidden Access" });
    }
    if (!phone || phone.trim() === "") {
      return res.status(400).send({
        message: "Phone number is required",
      });
    }
    const queryEmail = req.headers.token_email;
    if (queryEmail !== email) {
      return res.status(403).send({ message: "Forbidden Access" });
    }
    const query = { email: queryEmail };
    const update = {
      $set: {
        name: name,
        phone: phone,
      },
    };
    const updatedUser = await User.updateOne(query, update);
    res.status(200).send(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getUserRole = async (req, res) => {
  try {
    const email = req.params.email;
    if (req.headers.token_email !== email) {
      return res.status(403).send({ message: "Forbidden Access" });
    }
    const query = { email };
    const user = await User.findOne(query);
    res.status(200).json({ role: user?.role });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllTutors = async (req, res) => {
  try {
    const tutors = await User.aggregate([
      {
        $match: { role: "tutor" },
      },
      {
        $lookup: {
          from: "tutorprofiles",
          localField: "email",
          foreignField: "email",
          as: "tutor",
        },
      },
      {
        $unwind: {
          path: "$tutor",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          photoURL: 1,
          location: "$tutor.location",
          experience: "$tutor.experience",
          subjects: "$tutor.subjects",
          qualifications: "$tutor.qualifications",
          about: "$tutor.about",
        },
      },
    ]);
    res.status(200).json(tutors);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getSingleTutor = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid tutor ID" });
    }
    const tutor = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
          role: "tutor",
        },
      },
      {
        $lookup: {
          from: "tutorprofiles",
          localField: "email",
          foreignField: "email",
          as: "tutor",
        },
      },
      {
        $unwind: {
          path: "$tutor",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          photoURL: 1,
          location: "$tutor.location",
          experience: "$tutor.experience",
          subjects: "$tutor.subjects",
          qualifications: "$tutor.qualifications",
          about: "$tutor.about",
        },
      },
    ]);
    if (!tutor.length) {
      return res.status(404).json({ message: "Tutor not found" });
    }
    res.status(200).json(tutor[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const query = { _id: new ObjectId(id) };
    const updateRole = {
      $set: { role },
    };
    const result = await User.updateOne(query, updateRole);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
