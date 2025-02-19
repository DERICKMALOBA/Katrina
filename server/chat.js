const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mysql = require("mysql2");
const cors = require("cors");
const db = require('./config/db.js');
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(express.json());
app.use(cors());
let users = {};
io.on("connection", (socket) => {
  console.log("New client connected");
  console.log(`User  connected with socket ID ${socket.id}`);
  socket.on("register", (email) => {
    users[email] = socket.id; 
    var user=email;
    var rec=email;
    const query = 'SELECT email,msg FROM chats WHERE email=?||receiver=? ORDER BY time';
    db.query(query,[user,rec],(err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
       socket.emit("usermessages",results); 
    });
  });
  socket.on("registeradmin",(data)=>{
    const { Useremail, Email } = data;
    users[Email] = socket.id; 
    const query = 'SELECT email,msg FROM chats WHERE email=?||receiver=? ORDER BY time';
    db.query(query,[Useremail,Useremail],(err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        socket.emit("useradmin",results)
        var status=1;
        var ar=JSON.parse(JSON.stringify(results));
        var i=0;
        for(i;i<ar.length;i++)
        {
        const q="UPDATE chats SET replied=?";
        db.query(q,status,(err, results) => {
          if (err) return res.status(500).json({ message: 'Database error', error: err });
        });
      }    
    });
  });
  socket.on("sendtouser",(data)=>{
  const {Useremail,Name,text,Email,Role}=data;
  const query = 'INSERT INTO chats (email,name,msg,receiver,role) VALUES(?,?,?,?,?)';
  db.query(query,[Email,Name,text,Useremail,Role],(err, results) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });
      io.to(users[Useremail]).emit("receiverbyuser",({msg:text}));
  });
  socket.emit("sendbacktoadmin",({msg:text,email:Email}));
  });
  socket.on("sendtoadmin", (data) => {
    const {text,sender,Email,Role} = data;
    const query = 'INSERT INTO chats (email,name,msg,receiver,role) VALUES(?,?,?,?,?)';
    db.query(query,[Email,sender,text,"adminone@gmail.com",Role],(err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err }); 
        const q="SELECT*FROM chats WHERE role=?";
        db.query(q,"admin",(err, result) => {
          if (err) return res.status(500).json({ message: 'Database error', error: err });
          var ar=JSON.parse(JSON.stringify(result));
          var i=0;
          for(i;i<ar.length;i++)
          {
            io.to(users[ar[i].role]).emit("receiverbyadmin",({msg:text}));
          }
        });
    });
    socket.emit("sendbacktouser",({msg:text,email:Email}));
    const q="SELECT*FROM chats WHERE replied=?";
    db.query(q,0,(err, result) => {
          if (err) return res.status(500).json({ message: 'Database error', error: err });
          var a=0;
          var total=0;
          var ar=JSON.parse(JSON.stringify(result));
          for(a;a<ar.length;a++)
          {
            total=total+1;
          }
          io.emit("adminnotifications",({Total:total}));
          console.log(total);
    });
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

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
