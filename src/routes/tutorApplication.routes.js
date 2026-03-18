import express from "express";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";
import {
  checkAlreadyApplied,
  createTutorApplication,
  getApplicationsByTutor,
} from "../controllers/tutorApplication.controller.js";

const router = express.Router();

router.post("/create-tutorApplication", createTutorApplication);
router.get("/check-alreadyApplied", checkAlreadyApplied);
router.get("/get-tutor-applications", getApplicationsByTutor);
export default router;
