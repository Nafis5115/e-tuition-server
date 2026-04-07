import express from "express";
import {
  getAdminDashboard,
  getStudentDashboard,
  getTutorDashboard,
} from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/student-dashboard", getStudentDashboard);
router.get("/tutor-dashboard", getTutorDashboard);
router.get("/admin-dashboard", getAdminDashboard);

export default router;
