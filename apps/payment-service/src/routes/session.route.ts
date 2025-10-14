import { Hono } from "hono";
import stripe from "../utils/stripe";
import { shouldBeUser } from "../middleware/authMiddleware";
import Stripe from "stripe";

const sessionRoute = new Hono();

sessionRoute.post("/create-checkout-session", shouldBeUser, async (c) => {
  try {
    const body = await c.req.json();
    const { cart } = body;

    // Transform cart items to Stripe line items
    const lineItems = cart.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name || "Product",
          description: item.description,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    const session: Stripe.Checkout.Session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: "payment",
      ui_mode: "custom",
      // Update this to your actual frontend URL
      // return_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      return_url: 'http://localhost:3002/return?session_id={CHECKOUT_SESSION_ID}',

      // Optional: Add cancel URL
      // You can also collect shipping address in Stripe
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'], // Add your supported countries
      },
    });

    console.log("Session created:", session.id);

    return c.json({ 
      checkoutSessionClientSecret: session.client_secret,
      sessionId: session.id 
    });
  } catch (error) {
    console.error("Stripe session creation error:", error as string);
    return c.json({ error: error as string }, 500);
  }
});

export default sessionRoute;