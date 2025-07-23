import express from "express";
import bookRoute from "./routes/fileRoute";
import enumRoute from "./routes/enumRoute";

const app = express();
app.use(express.json());

app.use("/api", bookRoute);
app.use("/api", enumRoute);

app.listen(3000, () => {
  console.log("Server listen on port 3000");
});
