import { createServer } from "http";
import dotenv from "dotenv";
import app from "./app";
import ConnectDB from "./config/db";
dotenv.config();
const PORT = process.env.PORT;
const server = createServer(app);
ConnectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server connected on    -:- http://localhost:${PORT}`);
    });
  })
  .catch(() => {
    console.log("Server Connection error");
  });
