import express, { Application } from "express";
import http from "http";
import cors from "cors";
import { Server, Socket } from "socket.io";
import { env } from "./env/env";
import events from "./utils/events";

const app: Application = express();

app.use(cors({ origin: env.CLIENT_URL }));

const httpServer = http.createServer(app);

app.use(express.json());

const port = env.HTTP_SERVER_PORT;

const io = new Server(httpServer, {
  cors: {
    origin: [env.CLIENT_URL, "http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

let onlineUsers: { userId: string; socketId: string }[] = [];

io.on(events.connection, (socket: Socket) => {
  console.log(`User Connected with id: ${socket.id}`);

  socket.on(events.ADD_NEW_USER, (userId: string) => {
    if (!onlineUsers.some((user) => user.userId === userId)) {
      // if user is not added before
      onlineUsers.push({ userId: userId, socketId: socket.id });
      console.log(userId);
      console.log("A new user is online:", onlineUsers);
    }
    // send all active users to new user
    io.emit(events.GET_USERS, onlineUsers);
  });

  socket.on(events.disconnect, () => {
    console.log(`User Disconnected with id: ${socket.id}`);
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id); //Mutate the online users array
    console.log(onlineUsers);
  });

  socket.on(
    events.PRIVATE_MESSAGE,
    (data: {
      message: string;
      to: string;
      from: string;
      conversationId: string;
    }) => {
      console.log(data);
      const recSocketId = onlineUsers.find(
        (obj) => obj.userId === data.to
      )?.socketId;
      console.log("data.from =>", data.from);
      if (recSocketId)
        socket.to(recSocketId).emit(events.PRIVATE_MESSAGE, {
          message: data.message,
          from: data.from,
          to: data.to,
          conversationId: data.conversationId,
        });
    }
  );
});

app.get("/ping", (req, res) => {
  res.send("Pong");
  console.log("Pong");
});

httpServer.listen(port, () => {
  console.log(`⚡️[server]: Server is running at ${env.SERVER_URL}:${port}`);
});
