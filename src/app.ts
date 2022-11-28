import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();
const port = process.env.HTTP_SERVER_PORT;

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Hi");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
