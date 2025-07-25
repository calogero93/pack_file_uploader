import express, { Request, Response } from "express";
import bookRoute from "./routes/fileRoute";
import enumRoute from "./routes/enumRoute";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { setupSwagger } from "./utils/swagger";
import { apiKeyMiddleware } from "./middlewares/apiKeyMiddleware";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

app.get("/health", async (req: Request, res: Response) => {
  res.status(200).json("Server available");
});
setupSwagger(app);
app.use(apiKeyMiddleware);
app.use("/api", bookRoute);
app.use("/api", enumRoute);
app.use(errorMiddleware);

app.listen(3000, () => {
  console.log("Server listen on port 3000");
});

export default app;
