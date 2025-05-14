import app from './app.js';
import http from 'http';

const PORT = process.env.PORT || 5001;

// Create an HTTP server and pass the Express app
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
