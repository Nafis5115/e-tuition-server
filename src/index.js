import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion } from "mongodb";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import tuitionRoutes from "./routes/tuition.routes.js";
import tutorProfileRoutes from "./routes/tutorProfile.routes.js";
import tutorApplicationRoutes from "./routes/tutorApplication.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  "http://localhost:5173",
  // "https://your-frontend-domain.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin); // ✅ return exact origin
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());
connectDB();

app.use("/api", userRoutes);
app.use("/api", tuitionRoutes);
app.use("/api", tutorProfileRoutes);
app.use("/api", tutorApplicationRoutes);
app.use("/api", paymentRoutes);
app.use("/api", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("E-Tuition Server running");
});

export default app;
