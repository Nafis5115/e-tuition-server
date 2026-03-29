import express from "express";
import {
  createUser,
  getAllTutors,
  getUserPhone,
  getUserRole,
  getUsers,
  updateUserProfile,
} from "../controllers/user.controller.js";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";

const router = express.Router();

router.get("/get-users", verifyFirebaseToken, getUsers);
router.post("/create-user", createUser);
router.get("/get-user-phone", verifyFirebaseToken, getUserPhone);
router.patch("/update-user-profile", verifyFirebaseToken, updateUserProfile);
router.get("/user/:email/role", verifyFirebaseToken, getUserRole);
router.get("/all-tutors", getAllTutors);
export default router;
