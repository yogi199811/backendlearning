import { app } from "./app.js";
import dotenv from "dotenv";
import connectDb from "./database/index.js";

dotenv.config();
const PORT = process.env.PORT || 8080;

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
