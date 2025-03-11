import React from "react";
import { useEffect, useState } from "react";
import { load } from "@cashfreepayments/cashfree-js";

import { useNavigate } from "react-router-dom";

export default function CreateOrder() {
  const navigate = useNavigate();
  const [cashfree, setCashfree] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [orderId, setOrderId] = useState(null);

  // SUCCESS => paid
  // NOT_ATTEMPTED => otp cancel
  // EMPTY ARRAY => Direct cancel

  // open cashfree payment popup
  useEffect(() => {
    const openPaymentPopup = async () => {
      console.log(cashfree);

      const checkoutOptions = {
        paymentSessionId: sessionId,
        redirectTarget: "_modal",
      };
      const result = await cashfree.checkout(checkoutOptions);
      console.log(result);

      // check status api call
      const checkStatus = async () => {
        try {
          const response = await fetch(`http://localhost:80/check-status`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: orderId,
            }),
          });
          let data = await response.json();
          data = data[0];
          console.log(data);
          if (data.payment_status === "SUCCESS") {
            navigate(
              `/check-status?order_id=${data.order_id}&order_status=${data.payment_status}`
            );
          }
        } catch (error) {
          console.error("Error fetching payment status:", error);
        }
      };
      checkStatus();
    };

    if (cashfree && sessionId && orderId) openPaymentPopup();
  }, [cashfree]);

  // Function to initialize Cashfree
  const initializeSDK = async () => {
    const cashfreeInstance = await load({
      mode: "sandbox",
    });
    setCashfree(cashfreeInstance);
  };

  const handlePayment = async () => {
    try {
      // Fetch payment session ID from backend
      const response = await fetch("http://localhost:80/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderAmount: "499",
          customerName: "Pranjal Gogoi",
          customerEmail: "pranjal.techkilla@gmail.com",
          customerPhone: "7086676284",
        }),
      });

      const data = await response.json();

      console.log(data);

      if (data.success) {
        setSessionId(data.paymentSessionId);

        setOrderId(data.orderId);

        initializeSDK();
      } else {
        console.error("Failed to get payment session:", data);
      }
    } catch (error) {
      console.error("Error initializing Cashfree:", error);
    }
  };

  return (
    <div>
      <h2>Complete Your Payment</h2>
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
}
