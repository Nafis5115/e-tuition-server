import express from "express";
import {
  getAdminDashboard,
  getAdminReportsAndAnalytics,
  getStudentDashboard,
  getTutorDashboard,
} from "../controllers/dashboard.controller.js";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import verifyTutor from "../middleware/verifyTutor.js";

const router = express.Router();

router.get("/student-dashboard", verifyFirebaseToken, getStudentDashboard);
router.get(
  "/tutor-dashboard",
  verifyFirebaseToken,
  verifyTutor,
  getTutorDashboard,
);
router.get(
  "/admin-dashboard",
  verifyFirebaseToken,
  verifyAdmin,
  getAdminDashboard,
);
router.get(
  "/admin-reportsAndAnalytics",
  verifyFirebaseToken,
  verifyAdmin,
  getAdminReportsAndAnalytics,
);

export default router;
