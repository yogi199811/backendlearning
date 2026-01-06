import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();


app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["POST", "PUT", "GET", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(urlencoded({ extended: true, limit: "16kb" }));
app.use(express.json({ limit: "16Kb" }));
app.use(express.static("public"));

// import router

import userRoutes from "./api/v1/routes/user.route.js";

//  routes  declear

app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.send("i am listing");
});

export { app };
