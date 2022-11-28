import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

dotenv.config();

const app: Application = express();

app.use(cors());

const httpServer = http.createServer(app);

app.use(express.json());

const port = process.env.HTTP_SERVER_PORT;

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

io.on("connection",(socket) => {
  console.log(`User Connected with id: ${socket.id}`)
} )

httpServer.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
