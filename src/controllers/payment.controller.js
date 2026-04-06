import stripe from "../config/stripe.js";
import Payment from "../models/payment.model.js";
import Tuition from "../models/tuition.model.js";
import { ObjectId } from "mongodb";
import TutorApplication from "../models/tutorApplication.model.js";
export const createCheckoutSession = async (req, res) => {
  try {
    const tutorInfo = req.body;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: tutorInfo.email,
      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: {
              name: tutorInfo.subject,
            },
            unit_amount: tutorInfo.budget * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        tuitionId: tutorInfo.tuitionId,
        tutorEmail: tutorInfo.tutorEmail,
      },
      success_url: `http://localhost:5173/dashboard/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/dashboard/payment-cancelled`,
    });
    res.send({ url: session.url });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const paymentSuccess = async (req, res) => {
  try {
    const sessionId = req.query.session_id;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const totalAmount = session.amount_total / 100;
    if (session.payment_status === "paid") {
      try {
        const newPayment = {
          userEmail: session.customer_email,
          amount: session.amount_total / 100,
          tutorAmount: totalAmount * 0.9,
          adminCommission: totalAmount * 0.1,
          tuitionId: session.metadata.tuitionId,
          tutorEmail: session.metadata.tutorEmail,
          currency: session.currency,
          transactionId: session.payment_intent,
          paymentStatus: session.payment_status,
        };
        const paymentResult = await Payment.create(newPayment);

        await TutorApplication.updateOne(
          {
            tutorEmail: session.metadata.tutorEmail,
            tuitionId: new ObjectId(session.metadata.tuitionId),
          },
          {
            $set: {
              status: "accepted",
            },
          },
        );

        await TutorApplication.updateMany(
          {
            tutorEmail: { $ne: session.metadata.tutorEmail },
            tuitionId: new ObjectId(session.metadata.tuitionId),
          },
          {
            $set: {
              status: "rejected",
            },
          },
        );
        const tuitionQuery = { _id: new ObjectId(session.metadata.tuitionId) };
        const tuitionUpdate = {
          $set: {
            paymentStatus: "paid",
            status: "assigned",
            transactionId: session.payment_intent,
            assignedTutor: session.metadata.tutorEmail,
          },
        };
        const tuitionResult = await Tuition.updateOne(
          tuitionQuery,
          tuitionUpdate,
        );

        return res.status(201).json({
          success: true,
          paymentInfo: paymentResult,
          modifyTuition: tuitionResult,
        });
      } catch (err) {
        if (err.code === 11000) {
          return res.json({
            message: "Already Exists",
            transactionId: session.payment_intent,
          });
        }
        throw err;
      }
    }
    return res.status(201).json({
      success: false,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getUserPaymentHistory = async (req, res) => {
  try {
    const { email } = req.query;
    const payments = await Payment.aggregate([
      {
        $match: { userEmail: email },
      },
      {
        $lookup: {
          from: "tuitions",
          localField: "tuitionId",
          foreignField: "_id",
          as: "tuition",
        },
      },
      {
        $unwind: "$tuition",
      },
      {
        $lookup: {
          from: "tutorprofiles",
          localField: "tutorEmail",
          foreignField: "email",
          as: "tutor",
        },
      },
      {
        $unwind: "$tutor",
      },
      {
        $addFields: {
          tutorName: "$tutor.name",
          tuitionSubject: "$tuition.subject",
        },
      },
      {
        $unset: ["tutor", "tuition"],
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    res.status(200).json(payments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getTutorRevenueHistory = async (req, res) => {
  try {
    const { email } = req.query;
    const query = { tutorEmail: email };
    const revenue = await Payment.find(query);
    res.json(revenue);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
