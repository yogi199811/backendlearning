import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();


// app.use(
//   cors({
//     origin: process.env.CORS_ORIGIN,
//     methods: ["POST", "PUT", "GET", "DELETE"],
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());
app.use(urlencoded({ extended: true, limit: "16kb" }));
app.use(express.json({ limit: "16Kb" }));
app.use(express.static("public"));

// import router

import userRoutes from "./api/v1/routes/user.route.js";

//  routes  declear

app.use("/api/v1/user", userRoutes);

app.get("/", (req, res) => {
  res.send("i am listing");
});

app.get("/test-cors", (req, res) => {
  res.json({ message: "CORS OK" });
});

export { app };
