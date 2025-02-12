const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let users = {}; // Store users with their socket IDs

io.on("connection", (socket) => {
  console.log("New client connected");

  // Assign user to a specific socket
  socket.on("set_user", (userId) => {
    users[userId] = socket.id;  // Save the socket ID with user ID
    console.log(`User ${userId} connected with socket ID ${socket.id}`);
  });

  // Listen for incoming messages
  socket.on("send_message", (data) => {
    const { recipientId, message } = data;

    // Send message to the recipient user if they exist
    if (users[recipientId]) {
      io.to(users[recipientId]).emit("receive_message", {
        text: message,
        sender: "Admin",  // or dynamic sender
      });
    } else {
      console.log("Recipient not found");
    }
  });

  socket.on("disconnect", () => {
    // Remove user from the users list when they disconnect
    for (let userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        break;
      }
    }
    console.log("Client disconnected");
  });
});

server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
