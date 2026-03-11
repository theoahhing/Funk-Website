const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.warn(
    "Missing OPENAI_API_KEY. Set it in .env and restart the server."
  );
}
const client = new OpenAI({ apiKey: OPENAI_API_KEY });

const SYSTEM_PROMPT =
  "You are a friendly customer service assistant for a grocery retail store.\n" +
  "Your job is to:\n" +
  "1. Greet the customer warmly\n" +
  "2. Understand their complaint or issue (e.g. missing items, wrong order, damaged goods)\n" +
  "3. Ask clarifying questions if needed (order number, item details)\n" +
  "4. Empathise and assure them the issue will be resolved\n" +
  "5. Once the issue is clear, tell the customer their complaint has been logged and the store manager will follow up.\n" +
  "Keep responses short, friendly, and helpful.\n" +
  "Never make up order details.\n" +
  "When the issue is fully understood, end with:\n" +
  "ISSUE_RESOLVED: [one sentence summary of the complaint]";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

const sendSummaryEmail = async (summary) => {
  const now = new Date().toLocaleString();
  const ownerEmail = process.env.STORE_OWNER_EMAIL;
  const text =
    "A customer raised an issue via the chatbot.\n\n" +
    `Summary: ${summary}\n` +
    `Time: ${now}\n\n` +
    "Please follow up with the customer as soon as possible.";

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: ownerEmail,
    subject: "New Customer Complaint - Action Required",
    text
  });
};

app.post("/api/chat", async (req, res) => {
  try {
    if (!OPENAI_API_KEY) {
      return res.status(500).json({
        error: "Server is missing OPENAI_API_KEY. Update .env and restart."
      });
    }

    const { messages } = req.body;
    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid message format." });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      temperature: 0.7,
      max_tokens: 500
    });

    const reply = completion.choices?.[0]?.message?.content?.trim() || "";
    const match = reply.match(/ISSUE_RESOLVED:\s*(.+)/i);

    if (match && match[1]) {
      try {
        await sendSummaryEmail(match[1].trim());
      } catch (mailErr) {
        console.error("Email send failed:", mailErr);
      }
    }

    return res.json({ reply, resolved: Boolean(match) });
  } catch (err) {
    const detail = err?.response?.data || err?.message || err;
    console.error("Chat error:", detail);
    return res.status(500).json({
      error: "Sorry, something went wrong on our end. Please try again in a moment."
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
