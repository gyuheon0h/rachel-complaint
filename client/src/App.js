import { useState, useEffect } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";

function App() {
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [action, setAction] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = "#ffe6f0";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  console.log(process.env.REACT_APP_SERVER_URL);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/send-sms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ severity, message, action })
      });
  
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
  
      // Only clear inputs and show dialog on successful request
      setMessage("");
      setSeverity("");
      setAction("");
      setOpenDialog(true);
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message. Please try again later.");
    }
  };
  

  return (
    <Box
      sx={{
        p: 4,
        maxWidth: 500,
        mx: "auto",
        fontFamily: "'Comic Sans MS', cursive, sans-serif",
        bgcolor: "#ffe6f0",
        minHeight: "100vh"
      }}
    >
      <Typography variant="h3" gutterBottom align="center" color="#d63384">
        💖 Send a Love Complaint 💌
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="severity-label">How Upset Are You? 😢</InputLabel>
          <Select
            labelId="severity-label"
            value={severity}
            label="How Upset Are You? 😢"
            onChange={(e) => setSeverity(e.target.value)}
            required
          >
            <MenuItem value="I'm slight miffed 😞">I'm slight miffed 😞</MenuItem>
            <MenuItem value="I'm mad 😐">I'm mad 😐</MenuItem>
            <MenuItem value="I'm MAD . 😡">I'm MAD . 😡</MenuItem>
            <MenuItem value="I'm shaking in my boots 🤬">I'm shaking in my boots 🤬</MenuItem>
            <MenuItem value="I'm going to implode 🔥🤬😡🤬🔥">I'm going to implode 🔥🤬😡🤬🔥</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Tell Gyuheon what's wrong 💔"
          variant="outlined"
          fullWidth
          margin="normal"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your sweet angry words here..."
          required
          multiline
          rows={4}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel id="action-label">What should Gyuheon do? 🥺</InputLabel>
          <Select
            labelId="action-label"
            value={action}
            label="What should Gyuheon do? 🥺"
            onChange={(e) => setAction(e.target.value)}
            required
          >
            <MenuItem value="Call and talk">📞 Call and talk</MenuItem>
            <MenuItem value="Apologize on knees">🙏 Apologize on knees</MenuItem>
            <MenuItem value="Send me flowers">💐 Send you flowers</MenuItem>
            <MenuItem value="Give me 10000 kisses">😘💋 Give you 10000 kisses</MenuItem>
            <MenuItem value="Watch TikToks with me">📱😂 Watch TikToks with you</MenuItem>
            <MenuItem value="Buy me boba">🧋 Buy you boba</MenuItem>
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 3, bgcolor: "#ff69b4", '&:hover': { bgcolor: '#ff85c1' } }}
        >
          Send with Love 💞
        </Button>
      </form>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle sx={{ color: "#d63384" }}>💕 Message Sent 💖</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Gyuheon has received your precious message. He is *deeply* sorry for
            upsetting his stunningly gorgeous, brilliant, sweet girlfriend. 💗 He will
            read your words with great care and respond with all the love in the world.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: "#d63384" }}>
            Okay my love 💕
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default App;