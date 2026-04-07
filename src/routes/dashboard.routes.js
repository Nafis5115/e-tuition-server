import express from "express";
import {
  getStudentDashboard,
  getTutorDashboard,
} from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/student-dashboard", getStudentDashboard);
router.get("/tutor-dashboard", getTutorDashboard);

export default router;
