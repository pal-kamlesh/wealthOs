import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongoose.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import morgan from "morgan";
import { fileURLToPath } from "url";
import rootRouter from "./routes/index.js"

connectDB();

const app = express();

//Root Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
    ].join(" ");
  })
);

app.use("/api/v1", rootRouter);

if (process.env.NODE_ENV === "production") {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  app.use(express.static(path.join(__dirname, "/client/dist")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

//Error handling middleware
app.use(errorMiddleware);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running at port: ${port}`));