import express from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import tuitionRoutes from "./routes/tuition.routes.js";
import tutorProfileRoutes from "./routes/tutorProfile.routes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
connectDB();

app.use("/api", userRoutes);
app.use("/api", tuitionRoutes);
app.use("/api", tutorProfileRoutes);

app.get("/", (req, res) => {
  res.json({ message: "E-Tuition Server running" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
