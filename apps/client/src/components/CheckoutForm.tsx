"use client";

import { ShippingFormInputs } from "@repo/types";
import { PaymentElement, useCheckout } from '@stripe/react-stripe-js/checkout';
import { useState } from 'react';

const CheckoutForm = ({
  shippingForm,
}: {
  shippingForm: ShippingFormInputs;
}) => {
  const checkoutState = useCheckout();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (checkoutState.type === "loading") {
    return <div>Loading payment form...</div>;
  } else if (checkoutState.type === "error") {
    return <div>Error loading checkout: {checkoutState.error.message}</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isProcessing) return;
    
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Update email
      const emailResult = await checkoutState.checkout.updateEmail(shippingForm.email);
      if (emailResult.type === "error") {
        setErrorMessage(emailResult.error.message);
        setIsProcessing(false);
        return;
      }

      // Update shipping address
      const shippingResult = await checkoutState.checkout.updateShippingAddress({
        name: shippingForm.name,
        address: {
          line1: shippingForm.address,
          city: shippingForm.city,
          country: "US",
        },
      });

      if (shippingResult.type === "error") {
        setErrorMessage(shippingResult.error.message);
        setIsProcessing(false);
        return;
      }

      // Confirm the payment
      const confirmResult = await checkoutState.checkout.confirm();
      
      if (confirmResult.type === "error") {
        setErrorMessage(confirmResult.error.message);
        setIsProcessing(false);
      }
      // If successful, Stripe will automatically redirect to return_url
    } catch (error) {
      console.error("Payment error:", error);
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement options={{ layout: "accordion" }} />
      
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {errorMessage}
        </div>
      )}
      
      <button 
        type="submit"
        disabled={isProcessing}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

export default CheckoutForm;