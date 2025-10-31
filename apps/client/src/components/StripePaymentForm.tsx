"use client";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutProvider } from "@stripe/react-stripe-js/checkout";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { CartItemsType, ShippingFormInputs } from "@repo/types";
import CheckoutForm from "./CheckoutForm";
import useCartStore from "@/stores/cartStore";

const stripePromise = loadStripe(
  "pk_test_51SFpkEAcdNBVbpxWsexk6jC6XI80z7iAw12nhbjnEuptEBMiIT3wkulp7zpX6kntv7SjiQymQPxS2CA4feXj8fUy0079kXX6IS"
);

const StripePaymentForm = ({
  shippingForm,
}: {
  shippingForm: ShippingFormInputs;
}) => {
  const { cart } = useCartStore();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const token = await getToken();
        
        if (!token) {
          setError("Authentication required");
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/sessions/create-checkout-session`,
          {
            body: JSON.stringify({ cart }),
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to create checkout session");
        }

        const data = await response.json();
        
        if (!data.checkoutSessionClientSecret) {
          throw new Error("No client secret returned from server");
        }

        setClientSecret(data.checkoutSessionClientSecret);
      } catch (err) {
        console.error("Error fetching client secret:", err);
        setError(err instanceof Error ? err.message : "Failed to initialize checkout");
      }
    };

    fetchClientSecret();
  }, [cart, getToken]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
        {error}
      </div>
    );
  }

  if (!clientSecret) {
    return <div>Loading payment form...</div>;
  }

  return (
    <CheckoutProvider
      stripe={stripePromise}
      options={{ clientSecret }}
    >
      <CheckoutForm shippingForm={shippingForm} />
    </CheckoutProvider>
  );
};

export default StripePaymentForm;