import { useEffect, useState } from "react";
import { load } from "@cashfreepayments/cashfree-js";

function App() {
  const [cashfree, setCashfree] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [orderId, setOrderId] = useState(null);

  /*   useEffect(() => {
    if (cashfree && sessionId) {
      cashfree.checkout({
        paymentSessionId: sessionId,
      });
    } else {
      console.error("Cashfree not loaded or session ID missing!");
    }
  }, [sessionId]); */

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
    };

    if (cashfree && sessionId) openPaymentPopup();
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

export default App;
