// =========================================== //
const express = require("express");
const nodemailer = require("nodemailer");
const app = express();
app.use(express.json());
const PORT = 5500;

// =========================================== //
// Serve static files from the web directory
// app.use(express.static(__dirname + "/.."));
app.use(express.static(__dirname + "/../../"));

// =========================================== //
// Post endpoint to handle email sending
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ocrtech.mail@gmail.com", // <-- your Gmail address
    pass: "itfo jfcq uwin hzaz", // <-- your Gmail App Password
  },
});

// =========================================== //
app.post("/api/send-sms", async (req, res) => {
  const { to, body } = req.body;

  try {
    const response = await fetch("https://textbelt.com/text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: to,
        message: body,
        key: "textbelt", // Free key: 1 SMS/day, for more get a paid key
      }),
    });
    const data = await response.json();

    // Log the full response for debugging
    console.log("Textbelt response:", data);

    if (data.success) {
      res.json({ success: true, message: "SMS sent successfully!" });
    } else {
      res
        .status(500)
        .json({ success: false, error: data.error || "Failed to send SMS." });
    }
  } catch (error) {
    console.error("Textbelt SMS error:", error);
    res.status(500).json({ success: false, error: error.message });
  }

  console.log(`Sending SMS to ${to}: ${body}`);
});

// =========================================== //
app.post("/api/send-email", (req, res) => {
  const { to, subject, text } = req.body;

  const mailOptions = {
    from: "ocrtech.mail@gmail.com", // <-- your Gmail address
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Email error:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
    res.json({ success: true, info });
  });
});

// =========================================== //
app.post("/api/send-line", async (req, res) => {
  const { to, subject, text } = req.body;

  // Your LINE Messaging API Channel Access Token
  const lineAccessToken = "YOUR_LINE_CHANNEL_ACCESS_TOKEN"; // <-- Replace with your token

  try {
    const response = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lineAccessToken}`,
      },
      body: JSON.stringify({
        to: to, // LINE userId or groupId
        messages: [
          {
            type: "text",
            text: `${subject}\n${text}`,
          },
        ],
      }),
    });
    const data = await response.json();
    if (response.ok) {
      res.json({ success: true });
    } else {
      res.status(500).json({
        success: false,
        error: data.message || "Failed to send LINE alert.",
      });
    }
  } catch (error) {
    console.error("LINE Messaging API error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// =========================================== //
// Listen on the specified port
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  // console.log(`Server running on http://localhost:${PORT}/index.html`);
});
