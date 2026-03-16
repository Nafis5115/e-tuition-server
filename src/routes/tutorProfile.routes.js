import express from "express";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";
import {
  createTutorProfile,
  getTutorApplicationStatus,
} from "../controllers/tutorProfile.controller.js";

const router = express.Router();

router.post("/create-tutorProfile", verifyFirebaseToken, createTutorProfile);
router.get("/tutor-application-status", getTutorApplicationStatus);
export default router;
