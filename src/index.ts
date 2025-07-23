import express from "express";
import bookRoute from "./routes/fileRoute";
import enumRoute from "./routes/enumRoute";
import { errorMiddleware } from "./middlewares/errorMiddleware";

const app = express();
app.use(express.json());

app.use("/api", bookRoute);
app.use("/api", enumRoute);
app.use(errorMiddleware);

app.listen(3000, () => {
  console.log("Server listen on port 3000");
});
