"use strict";
const express = require('express');
const dotenv = require('dotenv');
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require('cors');
dotenv.config();
const app = express();
app.use(cors()); // Use CORS middleware to handle REST API CORS issues
const httpServer = createServer(app); // Attach Express to the HTTP server
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5174", // Replace with your frontend's origin
        methods: ["GET", "POST"]
    }
});
// Serve a test endpoint
app.get("/", (req, res) => {
    res.send("Socket.io server is running");
});
// Handle WebSocket connections
io.on("connection", (socket) => {
    console.log(`New connection: ${socket.id}`);
    // Example event handling
    socket.on("message", (msg) => {
        console.log(`Message received: ${msg}`);
    });
    socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
});
// Start the server
httpServer.listen(3000, () => {
    console.log("Server listening on port 3000");
});
