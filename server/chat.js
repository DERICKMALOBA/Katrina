const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let users = {};

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("register", (email) => {
    users[email] = socket.id; 
    console.log(`User ${userId} connected with socket ID ${socket.id}`);
  });
  socket.on("sendmessage", (data) => {
    const { recipientId, message } = data;
    if (users[recipientId]) {
      io.to(users[recipientId]).emit("receive_message", {
        text: message,
        sender: "Admin",
      });
    } else {
      console.log("Recipient not found");
    }
  });

  socket.on("disconnect", () => {
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
