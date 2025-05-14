import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Resend } from 'resend';

const app = express();
dotenv.config();

app.use(cors({ origin: `${process.env.CLIENT_URL}`, credentials: true }));
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.post('/send-sms', async (req, res) => {
  const { messageType, message, severity, action, appreciation } = req.body;

  let subject = "";
  let html = "";

  if (messageType === "negative") {
    subject = "Complaint from Your Girlfriend 😡💔";
    html = `
      <h2>😤 Uh-oh... She's not happy!</h2>
      <p><strong>Message:</strong> ${message}</p>
      <p><strong>Severity:</strong> ${severity}</p>
      <p><strong>What You Need To Do:</strong></p>
      <ul>
        ${Array.isArray(action)
          ? action.map((item) => `<li>${item}</li>`).join("")
          : `<li>${action}</li>`}
      </ul>
    `;
  } else {
    subject = "Sweet Note from Your Girlfriend 💘";
    html = `
      <h2>🌟 You're Loved!</h2>
      <p><strong>Message:</strong> ${message}</p>
      <p><strong>What She Appreciates:</strong> ${appreciation}</p>
    `;
  }

  try {
    const response = await resend.emails.send({
      from: 'RACHEL TIAN <onboarding@resend.dev>',
      to: ['timothyoh777@gmail.com'],
      subject,
      html
    });

    res.status(200).send({ success: true, response });
  } catch (error) {
    console.error('Email sending failed:', error);
    res.status(500).send({ success: false, error: error.message });
  }
});

export default app;