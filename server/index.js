const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const db = require('./config/db.js');
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');
const usersRoutes = require('./routes/usersroute.js');
const productRoutes = require('./routes/ProductRoute.js');
const salesRoutes = require('./routes/salesroute.js');
const authRouter = require('./routes/authroutes.js');
const offersRoute = require('./routes/Offers.js')
const orderRoutes = require('./routes/orderroute.js');
const messageRoutes = require('./routes/messagesroute.js');
const AdmiRrouter = require('./routes/adminavator.js');
const deliverRouter = require('./routes/Delivery.js');
const  mpesaRouter  = require('./routes/MpesaRoute.js');
const checkoutRouter = require('./routes/checkoutRouter.js');

const { console } = require("inspector");


// Load environment variables
dotenv.config();
// Middleware
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.urlencoded({ extended: true }));
// Increase payload size limit
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/products', productRoutes);
app.use('/api/offers', offersRoute);
app.use('/api/users', usersRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/orders', orderRoutes);

app.use('/api/messages', messageRoutes);
app.use('/api/admin', AdmiRrouter)
app.use('/api/delivery', deliverRouter);
app.use('/api', mpesaRouter)
app.use('/api', checkoutRouter)
// Test DB connecti

app.use('/api/admin', AdmiRrouter)
// Test DB connect
app.use('/api/messages', messageRoutes);
app.use('/api/admin', AdmiRrouter)
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
  } else {
    console.log('Connected to the database');
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
            io.to(users[ar[i].email]).emit("receiverbyadmin",({msg:text}));
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
  socket.once("checkstock",(dat)=>{
    const q="SELECT*FROM products WHERE stock<=?";
    db.query(q,10,(err, results) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });
    //  var ar=JSON.parse(JSON.stringify(results));
      var i=0;
      console.log(dat.Name);
      var data=[];
      for(i;i<results.length;i++)
      {
           data[i]=({Name:results[i].name,Message:"Almost finished  "+results[i].stock+"  remaining"});
          console.log(data+"lllkkk");
      }
      io.emit("stockdata",(data));
    });
 });
 socket.on("checknotify",(dat)=>{
  const q="SELECT*FROM products WHERE stock<=?";
  db.query(q,10,(err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    console.log(result);
    var d=result.length;
    /*var ar=JSON.parse(JSON.stringify(result));
        var i=0;
        var d=0;
        for(i;i<ar.length;i++)
        {
          if(ar[i].stock<=10)
          {
            d=d++;
          }
        }*/
        io.emit("stocknotify",(d));
       
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

server.listen(PORT, () => {
  console.log("Server running on http://localhost: "+5000);
});
