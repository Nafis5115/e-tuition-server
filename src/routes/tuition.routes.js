import express from "express";
import {
  createTuition,
  getTuitionsByUser,
  getTuitionDetails,
  updateTuition,
  deleteTuition,
  getAppliedTutors,
  getAllApprovedTuitions,
  getAllTuitions,
  manageTuition,
  getTutorOngoingTuitions,
} from "../controllers/tuition.controller.js";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import verifyTutor from "../middleware/verifyTutor.js";
import verifyStudent from "../middleware/verifyStudent.js";

const router = express.Router();

router.post(
  "/create-tuition",
  verifyFirebaseToken,
  verifyStudent,
  createTuition,
);
router.get(
  "/get-user-tuitions",
  verifyFirebaseToken,
  verifyStudent,
  getTuitionsByUser,
);
router.get("/tuition-details/:id", getTuitionDetails);
router.get("/all-approved-tuitions", getAllApprovedTuitions);
router.get("/all-tuitions", verifyFirebaseToken, verifyAdmin, getAllTuitions);
router.patch("/manage-tuition/:id", manageTuition);
router.patch("/update-tuition/:id", verifyFirebaseToken, updateTuition);
router.delete("/delete-tuition/:id", deleteTuition);
router.get(
  "/get-applied-tutors",
  verifyFirebaseToken,
  verifyStudent,
  getAppliedTutors,
);
router.get(
  "/tutor-ongoing-tuitions",
  verifyFirebaseToken,
  verifyTutor,
  getTutorOngoingTuitions,
);

export default router;
