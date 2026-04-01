import express from "express";
import {
  createUser,
  getAllTutors,
  getAllUsers,
  getSingleTutor,
  getUserPhone,
  getUserRole,
  updateUserProfile,
  updateUserRole,
} from "../controllers/user.controller.js";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";

const router = express.Router();

router.get("/all-users", getAllUsers);
router.post("/create-user", createUser);
router.get("/get-user-phone", verifyFirebaseToken, getUserPhone);
router.patch("/update-user-profile", verifyFirebaseToken, updateUserProfile);
router.get("/user/:email/role", verifyFirebaseToken, getUserRole);
router.get("/all-tutors", getAllTutors);
router.get("/tutor-details/:id", getSingleTutor);
router.patch("/update-user-role/:id", updateUserRole);
export default router;
