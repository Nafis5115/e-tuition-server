import express from "express";
import { createTuition } from "../controllers/tuition.controller.js";

const router = express.Router();

router.post("/create-tuition", createTuition);

export default router;
