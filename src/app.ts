import express, { Application } from "express";
import http from "http";
import cors from "cors";
import { Server, Socket } from "socket.io";
import { env } from "./env/env";
import events from "./utils/events";

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

io.on(events.connection, (socket: Socket) => {
  console.log(`User Connected with id: ${socket.id}`);

  socket.on(events.disconnect, () => {
    console.log(`User Disconnected with id: ${socket.id}`);
  });

  socket.on(events.SEND_MESSAGE, (data: string) => {
    console.log(data);
    socket.broadcast.emit(events.RECEIVE_MESSAGE, data);
  });
});

httpServer.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
