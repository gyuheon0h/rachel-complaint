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
  DialogActions,
  Drawer,
  IconButton,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";


function Page({onLogout, token}) {
  const [username, setUsername] = useState("");
  const [messageType, setMessageType] = useState("negative"); // new
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [happiness, setHappiness] = useState("");
  const [action, setAction] = useState([]);
  const [appreciation, setAppreciation] = useState(""); // new
  const [openDialog, setOpenDialog] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };


  async function fetchUsernameFromToken(token) {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/username/${token}`);
      if (!response.ok) {
        throw new Error("Failed to fetch username");
      }
      const data = await response.json();
      return data.username;
    } catch (error) {
      console.error("Error fetching username:", error);
      return null;
    }
}

async function fetchMessages(username) {
  fetch(`${process.env.REACT_APP_SERVER_URL}/messages/${username}`)
      .then(res => res.json())
      .then(data => {
        if (data?.messages) setMessages(data.messages);
      })
      .catch(err => console.error("Failed to load messages", err));
}

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
  if (username) {
    fetchMessages(username);
  }
}, [username]);
  

  useEffect(() => {
    document.body.style.backgroundColor =
      messageType === "negative" ? "#ffe6f0" : "#e0f7ff";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, [messageType]);

  useEffect(() => {
    const fetchUsername = async () => {
      const fetchedUsername = await fetchUsernameFromToken(token);
      if (fetchedUsername) {
        setUsername(fetchedUsername);
      } else {
        alert("Failed to fetch username. Please log in again.");
        onLogout();
      }
    };

    fetchUsername();
  }
  , [token, onLogout]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload =
      messageType === "negative"
        ? { username, messageType, message, severity, action }
        : { username, messageType, message, appreciation, happiness };

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

      fetchMessages(username)

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      setMessage("");
      setSeverity("");
      setAction([]);
      setAppreciation("");
      setOpenDialog(true);
      setHappiness("");
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
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={toggleSidebar}>
            <MenuIcon/>
          </IconButton>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", ml: 1 }}>
            Logged in as: <span style={{ color: "#d63384" }}>{username}</span>
          </Typography>
        </Box>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onLogout}
          sx={{ fontWeight: "bold" }}
        >
          Logout 💔
        </Button>
      </Box>

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

            <InputTextField
              messageType={'negative'}
              message={message}
              setMessage={setMessage} />

            <FormControl fullWidth margin="normal">
              <Autocomplete
                multiple
                freeSolo
                options={actionOptions.map((opt) => opt.label)}
                value={action}
                onChange={(event, newValue) => setAction(newValue)}
                renderInput={(params) => (
                  <>
                    <TextField
                      {...params}
                      label="What should Gyuheon do? 🥺" />
                    {/* Hidden required field */}
                    <input
                      style={{ display: "none" }}
                      value={action.length > 0 ? "valid" : ""}
                      required
                      readOnly />
                  </>
                )} />
            </FormControl>
          </>
        ) : (
          (
            <>
              <FormControl fullWidth margin="normal">
                <InputLabel id="happiness-label">How Happy Are You? 😁</InputLabel>
                <Select
                  labelId="happiness-label"
                  value={happiness}
                  onChange={(e) => {
                    setHappiness(e.target.value);
                    console.log(happiness);
                  } }
                  required
                >
                  <MenuItem value="I'm pleased 🙂">
                    I'm pleased 🙂
                  </MenuItem>
                  <MenuItem value="I'm cheerful 😀">I'm cheerful 😀</MenuItem>
                  <MenuItem value="I'm delighted 😁">I'm delighted 😁</MenuItem>
                  <MenuItem value="I'm ecstatic 😆🥹😻🥹😆">
                    I'm ecastic 😆🥹😻🥹😆
                  </MenuItem>
                </Select>
              </FormControl>

              <InputTextField
                messageType={'positive'}
                message={message}
                setMessage={setMessage} />
              <TextField
                label="What do you appreciate? 🌟"
                variant="outlined"
                fullWidth
                margin="normal"
                value={appreciation}
                onChange={(e) => setAppreciation(e.target.value)}
                placeholder="Your kindness, your hugs, the way you make kimchi jiggae..."
                required
                multiline
                rows={2} />
            </>)
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

      <Drawer anchor="left" open={sidebarOpen} onClose={toggleSidebar}>
        <Box sx={{ width: 320, p: 2 }}>
          <Typography variant="h5" gutterBottom>📜 Your Love Messages</Typography>
          {messages.length === 0 ? (
            <Typography>No messages yet 💭</Typography>
          ) : (
            messages.map((msg, idx) => {
              const isNegative = msg.data.messageType === "negative";
              return (
                <Card
                  key={idx}
                  sx={{
                    mb: 2,
                    bgcolor: isNegative ? "#ffe6f0" : "#e0f7ff",
                    borderLeft: `6px solid ${isNegative ? "#d63384" : "#0077b6"}`,
                    boxShadow: 2
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      {isNegative ? "💖 Complaint" : "💙 Compliment"}
                    </Typography>
                    <Typography sx={{ mb: 1 }}>
                      {msg.data.message}
                    </Typography>
                    {isNegative ? (
                      <>
                        <Typography variant="body2">
                          <strong>Severity:</strong> {msg.data.severity}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Actions:</strong> {msg.data.action?.join(", ")}
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Typography variant="body2">
                          <strong>Happiness:</strong> {msg.data.happiness}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Appreciation:</strong> {msg.data.appreciation}
                        </Typography>
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
          <Divider sx={{ mt: 2 }} />
          <Button onClick={toggleSidebar} fullWidth sx={{ mt: 2 }}>
            Close 💨
          </Button>
        </Box>
      </Drawer>

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




const InputTextField = ({
  messageType,
  message,
  setMessage,
  required = true,
  rows = 4,
  ...props
}) => {
  const isNegative = messageType === "negative";

  return (
    <TextField
      label={
        isNegative
          ? "Tell Gyuheon what's wrong 💔"
          : "Tell Gyuheon something sweet 💙"
      }
      variant="outlined"
      fullWidth
      margin="normal"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder={
        isNegative
          ? "Type your sweet angry words here..."
          : "Type your adorable love note here..."
      }
      required={required}
      multiline
      rows={rows}
      {...props}
    />
  );
};

export default Page;