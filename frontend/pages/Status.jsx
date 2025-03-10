import React, { useState, useEffect } from "react";

import { useSearchParams } from "react-router-dom";

export default function Status() {
  const [searchParams] = useSearchParams();
  const [statusMessage, setStatusMessage] = useState("Verifying payment...");

  const orderIdFromParams = searchParams.get("order_id");
  const orderStatus = searchParams.get("order_status");

  // update status message
  useEffect(() => {
    if (orderIdFromParams && orderStatus) {
      if (orderStatus === "SUCCESS") {
        setStatusMessage("🎉 Payment successful! Your order has been placed.");
      } else if (orderStatus === "FAILED") {
        setStatusMessage("❌ Payment failed! Please try again.");
      } else {
        setStatusMessage(
          "⏳ Payment is pending. Please wait for confirmation."
        );
      }
    }
  }, [orderIdFromParams, orderStatus]);

  return (
    <div>
      <h2>Payment Status</h2>
      <p>Order ID: {orderIdFromParams || "Unknown"}</p>
      <p>Status: {orderStatus || "Unknown"}</p>
      <h3>{statusMessage}</h3>
    </div>
  );
}
