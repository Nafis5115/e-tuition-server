import Stripe from "stripe";
const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`);

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
