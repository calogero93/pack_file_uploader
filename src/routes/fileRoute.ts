import { Router } from "express";
import multer from "multer";
import { uploadFileController } from "../controllers/fileController";
import { getAllFiles } from "../repository/fileRepository";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router()
  .post("/upload", upload.single("file"), uploadFileController)
  .get("/", getAllFiles);

export default router;
