import express from "express";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";
import { createTutorApplication } from "../controllers/tutorApplication.controller.js";

const router = express.Router();

router.post("/create-tutorApplication", createTutorApplication);
export default router;
