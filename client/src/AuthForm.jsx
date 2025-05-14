import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  ToggleButtonGroup,
  ToggleButton
} from "@mui/material";

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function AuthForm({ onAuthSuccess }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleModeChange = (_, newMode) => {
    if (newMode) setMode(newMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const passwordHash = await hashPassword(password);

    const endpoint = mode === "login" ? "/login" : "/register";

    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, passwordHash })
      });

      if (!res.ok) throw new Error("Authentication failed");

      const { token } = await res.json();
      onAuthSuccess(token);
    } catch (err) {
      alert("Login/Register failed: " + err.message);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 8,
        p: 4,
        bgcolor: "#f0e6ff",
        borderRadius: 4,
        boxShadow: 3
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        💘 {mode === "login" ? "Login" : "Create Account"} 💘
      </Typography>

      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={handleModeChange}
        fullWidth
        sx={{ mb: 2 }}
      >
        <ToggleButton value="login">Login</ToggleButton>
        <ToggleButton value="register">Create Account</ToggleButton>
      </ToggleButtonGroup>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          fullWidth
          margin="normal"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
          {mode === "login" ? "Login 💕" : "Create Account 💖"}
        </Button>
      </form>
    </Box>
  );
}
