import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
    },
    tuitionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tuition",
      required: true,
    },
    tutorEmail: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    tutorAmount: {
      type: Number,
      required: true,
    },
    adminCommission: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    paymentStatus: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
