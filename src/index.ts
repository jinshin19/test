import express from "express";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";
import { Server } from "http";
import { config } from "dotenv";
config();

const PORT = process.env.REACT_FOOD_BACKEND_PORT || 3001;
const app = express();
app.listen(PORT);
app.use(express.json());
app.use(
  cors({
    origin: "",
  })
);
app.use(cookieParser());
app.use(passport.initialize());
const server = new Server(app);
