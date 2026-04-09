import User from "../models/user.model.js";

const verifyAdmin = async (req, res, next) => {
  const email = req.headers.token_email;
  const query = { email };
  const user = await User.findOne(query);
  if (user.role !== "admin") {
    return req.status(403).json({ message: "Forbidden access!" });
  }
  next();
};

export default verifyAdmin;
