import express from "express";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";
import {
  createTutorProfile,
  getTutorApplicationStatus,
  getTutorDetails,
  updateTutorProfile,
} from "../controllers/tutorProfile.controller.js";

const router = express.Router();

router.post("/create-tutorProfile", verifyFirebaseToken, createTutorProfile);
router.get(
  "/tutor-application-status",
  verifyFirebaseToken,
  getTutorApplicationStatus,
);
router.get("/tutor-details", verifyFirebaseToken, getTutorDetails);
router.patch("/update-tutorProfile", verifyFirebaseToken, updateTutorProfile);
export default router;
