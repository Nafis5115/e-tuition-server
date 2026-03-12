/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
import User from "../models/user.model.js";

export const getUsers = async (req, res) => {
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
