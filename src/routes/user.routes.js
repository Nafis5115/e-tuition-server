import express from "express";
import { createUser, getUsers } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/get-users", getUsers);
router.post("/create-user", createUser);

export default router;
