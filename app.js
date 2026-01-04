import express, { urlencoded } from "express";
import dotenv from "dotenv";
import connectDb from "./database/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
const PORT = process.env.PORT || 8080;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["POST", "PUT", "GET", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(urlencoded({extended:true,limit:"16kb"}));
app.use(express.json({ limit: "16Kb" }));
app.use(express.static("public"))

dotenv.config();

connectDb()
  .then(() => {
    app.on("error", (error) => {
      console.log("error while connecting", error);
      throw error;
    });

    app.listen(PORT, () => {
      console.log(`server is running on port : ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("mongo db connection error", err);
  });

app.get("/", (req, res) => {
  res.send("i am listing");
});

export { app };
