import express from "express";
import {
  createUser,
  deleteUser,
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

router.get("/all-users", verifyFirebaseToken, getAllUsers);
router.post("/create-user", createUser);
router.get("/get-user-phone", verifyFirebaseToken, getUserPhone);
router.patch("/update-user-profile", verifyFirebaseToken, updateUserProfile);
router.get("/user/:email/role", verifyFirebaseToken, getUserRole);
router.get("/all-tutors", getAllTutors);
router.get("/tutor-details/:email", getSingleTutor);
router.patch("/update-user-role/:id", verifyFirebaseToken, updateUserRole);
router.delete("/delete-user/:id", verifyFirebaseToken, deleteUser);
export default router;
