import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Resend } from 'resend';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const JWT_SECRET = process.env.JWT_SECRET;

const app = express();

app.use(cors({ origin: `${process.env.CLIENT_URL}`, credentials: true }));
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);


app.get('/username/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { username } = decoded;

    // Check if the user exists in the database
    const { data: user, error } = await supabase
      .from('User')
      .select('username')
      .eq('username', username)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ username: user.username });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
})

app.post('/send-sms', async (req, res) => {
  const {
    username,           // <-- Add this in your frontend payload
    messageType,
    message,
    severity,
    action,
    appreciation,
    happiness
  } = req.body;

  let subject = "";
  let html = "";

  if (messageType === "negative") {
    subject = "Complaint from Your Girlfriend 😡💔";
    html = `
      <h2>😤 Uh-oh... She's not happy!</h2>
      <p><strong>Severity:</strong> ${severity}</p>
      <p><strong>Message:</strong> ${message}</p>
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
      <p><strong>Happiness Level:</strong> ${happiness}</p>
      <p><strong>Message:</strong> ${message}</p>
      <p><strong>What She Appreciates:</strong> ${appreciation}</p>
    `;
  }

  try {
    // Send email
    const response = await resend.emails.send({
      from: 'RACHEL TIAN <onboarding@resend.dev>',
      to: ['timothyoh777@gmail.com'],
      subject,
      html
    });

    // Get user ID from username
    const { data: user, error: userError } = await supabase
      .from('User')
      .select('id')
      .eq('username', username)
      .single();

    if (!user) {
      console.error('User lookup failed:', userError);
      return res.status(404).json({ error: 'User not found' });
    }

    //Save message in database
    const messageData = {
      messageType,
      message,
      ...(messageType === 'negative'
        ? { severity, action }
        : { happiness, appreciation })
    };

    const { error: insertError } = await supabase
      .from('Message')
      .insert([{ author: user.id, data: messageData }]);

    if (insertError) {
      console.error('Message insert failed:', insertError);
      return res.status(500).json({ error: 'Failed to save message' });
    }

    res.status(200).send({ success: true, response });
  } catch (error) {
    console.error('Email sending or DB saving failed:', error);
    res.status(500).send({ success: false, error: error.message });
  }
});



app.post('/register', async (req, res) => {
  const { username, passwordHash } = req.body;

  if (!username || !passwordHash) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  // Check if user already exists
  const { data: existingUser, error: fetchError } = await supabase
    .from('User')
    .select('id')
    .eq('username', username)
    .single();

  if (existingUser) {
    return res.status(409).json({ error: 'Username already exists.' });
  }

  if (fetchError && fetchError.code !== 'PGRST116') {
    return res.status(500).json({ error: 'Error checking existing user.' });
  }

  // Insert new user
  const { data, error } = await supabase.from('User').insert([
    { username, password_hash: passwordHash }
  ]);

  if (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Registration failed.' });
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
});


app.post('/login', async (req, res) => {
  const { username, passwordHash } = req.body;

  if (!username || !passwordHash) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const { data: user, error } = await supabase
    .from('User')
    .select('id, username, password_hash')
    .eq('username', username)
    .single();

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  if (user.password_hash !== passwordHash) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
});

app.get('/messages/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const { data: user, error: userError } = await supabase
      .from('User')
      .select('id')
      .eq('username', username)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { data: messages, error: messagesError } = await supabase
      .from('Message')
      .select('*')
      .eq('author', user.id);

    if (messagesError) {
      throw messagesError;
    }

    res.status(200).json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



export default app;