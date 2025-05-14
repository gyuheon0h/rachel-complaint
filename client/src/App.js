import { useState, useEffect } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  Autocomplete,
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
  const [messageType, setMessageType] = useState("negative"); // new
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [action, setAction] = useState([]);
  const [appreciation, setAppreciation] = useState(""); // new
  const [openDialog, setOpenDialog] = useState(false);

  const actionOptions = [
    { label: "📞 Call and talk", value: "Call and talk" },
    { label: "🙏 Apologize on knees", value: "Apologize on knees" },
    { label: "💐 Send you flowers", value: "Send me flowers" },
    { label: "😘💋 Give you 10000 kisses", value: "Give me 10000 kisses" },
    { label: "📱😂 Watch TikToks with you", value: "Watch TikToks with me" },
    { label: "🧋 Buy you boba", value: "Buy me boba" },
    { label: "🍽️ Take you to dinner", value: "Take me to dinner" },
    { label: "🕺🏻 Do an interpretive dance", value: "Do an interpretive dance" }
  ];
  

  useEffect(() => {
    document.body.style.backgroundColor =
      messageType === "negative" ? "#ffe6f0" : "#e0f7ff";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, [messageType]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload =
      messageType === "negative"
        ? { messageType, message, severity, action }
        : { messageType, message, appreciation };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/send-sms`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      setMessage("");
      setSeverity("");
      setAction([]);
      setAppreciation("");
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
        bgcolor: messageType === "negative" ? "#ffe6f0" : "#e0f7ff",
        minHeight: "100vh"
      }}
    >
      <Typography
        variant="h3"
        gutterBottom
        align="center"
        color={messageType === "negative" ? "#d63384" : "#0077b6"}
      >
        {messageType === "negative"
          ? "💖 Send a Love Complaint 💌"
          : "💙 Send a Love Note 💫"}
      </Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel id="message-type-label">Message Type</InputLabel>
        <Select
          labelId="message-type-label"
          value={messageType}
          onChange={(e) => setMessageType(e.target.value)}
        >
          <MenuItem value="negative">😠 Negative (Complaint)</MenuItem>
          <MenuItem value="positive">😊 Positive (Compliment)</MenuItem>
        </Select>
      </FormControl>

      <form onSubmit={handleSubmit}>
        <TextField
          label={
            messageType === "negative"
              ? "Tell Gyuheon what's wrong 💔"
              : "Tell Gyuheon something sweet 💙"
          }
          variant="outlined"
          fullWidth
          margin="normal"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={
            messageType === "negative"
              ? "Type your sweet angry words here..."
              : "Type your adorable love note here..."
          }
          required
          multiline
          rows={4}
        />

        {messageType === "negative" ? (
          <>
            <FormControl fullWidth margin="normal">
              <InputLabel id="severity-label">How Upset Are You? 😢</InputLabel>
              <Select
                labelId="severity-label"
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                required
              >
                <MenuItem value="I'm slight miffed 😞">
                  I'm slight miffed 😞
                </MenuItem>
                <MenuItem value="I'm mad 😐">I'm mad 😐</MenuItem>
                <MenuItem value="I'm MAD . 😡">I'm MAD . 😡</MenuItem>
                <MenuItem value="I'm shaking in my boots 🤬">
                  I'm shaking in my boots 🤬
                </MenuItem>
                <MenuItem value="I'm going to implode 🔥🤬😡🤬🔥">
                  I'm going to implode 🔥🤬😡🤬🔥
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <Autocomplete
                multiple
                freeSolo
                options={actionOptions.map((opt) => opt.label)}
                value={action}
                onChange={(event, newValue) => setAction(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="What should Gyuheon do? 🥺"
                    required
                  />
                )}
              />
            </FormControl>

          </>
        ) : (
          <TextField
            label="What do you appreciate? 🌟"
            variant="outlined"
            fullWidth
            margin="normal"
            value={appreciation}
            onChange={(e) => setAppreciation(e.target.value)}
            placeholder="Your kindness, your hugs, the way you make ramen..."
            required
            multiline
            rows={2}
          />
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            mt: 3,
            bgcolor: messageType === "negative" ? "#ff69b4" : "#00b4d8",
            '&:hover': {
              bgcolor: messageType === "negative" ? "#ff85c1" : "#48cae4"
            }
          }}
        >
          {messageType === "negative"
            ? "Send with Love 💞"
            : "Send with Joy 💕"}
        </Button>
      </form>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle
          sx={{ color: messageType === "negative" ? "#d63384" : "#0077b6" }}
        >
          {messageType === "negative"
            ? "💕 Message Sent 💖"
            : "💙 Message Delivered 💌"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {messageType === "negative"
              ? `Gyuheon has received your message of complaint. He will hug you very soon and fix everything 💗`
              : `Gyuheon got your beautiful love note and is now blushing uncontrollably. You’ve made his day! 🌈`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{ color: messageType === "negative" ? "#d63384" : "#0077b6" }}
          >
            Aww okay 💕
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default App;
