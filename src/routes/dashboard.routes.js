import express from "express";
import { getStudentDashboard } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/student-dashboard", getStudentDashboard);

export default router;
