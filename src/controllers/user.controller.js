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
    res.status(200).json({ role: user.role });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
