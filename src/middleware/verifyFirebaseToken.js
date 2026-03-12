import admin from "../config/firebaseAdmin.js";
import firebaseAdmin from "../config/firebaseAdmin.js";

const verifyFirebaseToken = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send({ message: "Unauthorized access!" });
  }
  try {
    const idToken = token.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.headers.token_email = decoded.email;
  } catch (error) {
    return res.status(401).send({ message: "Unauthorized access." });
  }
  next();
};

export default verifyFirebaseToken;
