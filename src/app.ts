import express, { Application } from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { env } from "./env/env";
import { prisma } from "./db/client";

const app: Application = express();

app.use(cors());

const httpServer = http.createServer(app);

app.use(express.json());

const port = env.HTTP_SERVER_PORT;

const io = new Server(httpServer, {
  cors: {
    origin: env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected with id: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`User Disconnected with id: ${socket.id}`);
  });

  socket.on("send_message", (data) => {
    console.log(data);
  });
});

app.get("/api/chat/:id", (req,res) => {
  res.send(`Chat id is ${req.params.id}`)
});

httpServer.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
