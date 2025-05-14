
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Resend } from 'resend';

const app = express();
dotenv.config();

app.use(
  cors({
    origin: `${process.env.CLIENT_URL}`,
    credentials: true,
  }),
);

app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.post('/send-sms', async (req, res) => {
  const message = req.body.message;
  const severity = req.body.severity;
  const action = req.body.action;

  try {
    const response = await resend.emails.send({
      from: 'RACHEL TIAN <onboarding@resend.dev>',
      to: ['timothyoh777@gmail.com'],
      subject: 'Message from Your Girlfriend 💌',
      html: `
        <h2>📩 You've got a message!</h2>
        <p><strong>Message:</strong> ${message}</p>
        <p><strong>Severity:</strong> ${severity}</p>
        <p><strong>Suggested Action:</strong> ${action}</p>
      `,
    });

    res.status(200).send({ success: true, response });
  } catch (error) {
    console.error('Email sending failed:', error);
    res.status(500).send({ success: false, error: error.message });
  }
});

export default app;