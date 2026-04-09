import express from "express";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";
import {
  checkAlreadyApplied,
  createTutorApplication,
  deleteApplicationByTutor,
  getApplicationsByTutor,
} from "../controllers/tutorApplication.controller.js";
import verifyTutor from "../middleware/verifyTutor.js";

const router = express.Router();

router.post("/create-tutorApplication", createTutorApplication);
router.get("/check-alreadyApplied", checkAlreadyApplied);
router.get(
  "/get-tutor-applications",
  verifyFirebaseToken,
  verifyTutor,
  getApplicationsByTutor,
);
router.delete(
  "/delete-tutor-application/:id",
  verifyFirebaseToken,
  verifyTutor,
  deleteApplicationByTutor,
);
export default router;
