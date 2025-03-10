import express from "express";

import cors from "cors";
import "dotenv/config";
import { Cashfree } from "cashfree-pg";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

Cashfree.XClientId = process.env.CASHFREE_TEST_CLIENT_ID;
Cashfree.XClientSecret = process.env.CASHFREE_TEST_SECRET_KEY;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

// create order
app.post("/create-order", async (req, res) => {
  try {
    const { orderAmount, customerName, customerEmail, customerPhone } =
      req.body;

    const orderId = "order_" + Date.now();

    const request = {
      order_amount: orderAmount,
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: "CUST_" + Date.now(),
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
      },
      order_meta: {
        return_url: `http://localhost:3000/check-status?order_id=${orderId}&order_status={order_status}`,
      },
      order_note: "Test Order",
    };

    const response = await Cashfree.PGCreateOrder("2023-08-01", request);
    console.log("Cashfree Response:", response.data);

    res.json({
      success: true,
      paymentSessionId: response.data.payment_session_id,
      orderId: response.data.order_id,
    });
  } catch (error) {
    console.error(
      "Error creating Cashfree order:",
      error.response?.data || error.message
    );
    res.status(500).json({
      success: false,
      message: "Payment processing failed",
      error: error.response?.data || error.message,
    });
  }
});

// check status
app.post("/check-status", async (req, res) => {
  try {
    const { orderId } = req.body;
    Cashfree.PGOrderFetchPayments("2023-08-01", orderId)
      .then((response) => {
        console.log(response);
        const responseData = response?.data;
        res.json(responseData);
      })
      .catch((err) => {
        console.log("Error from Cashfree Verify Api :", err);
        res
          .status(500)
          .json({ error: "Something went wrong", details: err.message });
      });
  } catch (error) {
    console.log("Error from verify route:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(80, () => {
  console.log("Server is running on port 80");
});
