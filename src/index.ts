

const express = require('express');
const dotenv = require('dotenv');
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require('cors');
import { UserManager } from "./manager/UserManager";

dotenv.config();

const app = express();
app.use(cors()); 

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5174",
    methods: ["GET", "POST"]
  }
});

app.get("/", (req: any, res: any) => {
  res.send("Socket.io server is running");
});

const users = new UserManager();


 
io.on("connection", (socket: any) => {
  console.log(`New connection: ${socket.id}`);
  users.addUser('randomUser',  socket.id);

  socket.on("message", (msg: any) => {
    console.log(`Message received: ${msg}`);
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});


httpServer.listen(3000, () => {
  console.log("Server listening on port 3000");
});
