import z from "zod";
import { Category, Language, Provider, Role } from "../db/enums";
import { AppError, ValidationError } from "../utils/customErrors";
import { Request, Response, NextFunction } from "express";
import { NewFile } from "../dto/file";
import { getAllFilesService, uploadFileService } from "../services/fileService";

const fileMetadataSchema = z.object({
  title: z
    .string()
    .min(1, "Il titolo è obbligatorio.")
    .max(200, "Il titolo non deve superare i 200 caratteri."),
  description: z
    .string()
    .max(1000, "La descrizione non deve superare i 1000 caratteri.")
    .optional()
    .nullable(),
  category: z.enum(Object.values(Category)).optional().nullable(),
  language: z.enum(Object.values(Language)).optional().nullable(),
  provider: z.enum(Object.values(Provider)).optional().nullable(),
  role: z.enum(Object.values(Role)).optional().nullable(),
});

export const uploadFileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const file = req.file;
  const metadata: NewFile = req.body;

  if (!file) {
    return next(new ValidationError("No file loaded"));
  }

  const buffer = file.buffer;

  let validatedMetadata;
  try {
    validatedMetadata = fileMetadataSchema.parse({
      title: metadata.title,
      description: metadata.description,
      category: metadata.category,
      language: metadata.language,
      provider: metadata.provider,
      role: metadata.role,
    });
  } catch (validationError) {
    return next(validationError);
  }

  try {
    const metadata = {
      ...validatedMetadata,
      file_reference: "",
      description: validatedMetadata.description ?? "",
      category: validatedMetadata.category ?? Category.ProjectManagemt,
      language: validatedMetadata.language ?? Language.Italian,
      provider: validatedMetadata.provider ?? Provider.Pack,
      role: validatedMetadata.role ?? Role.Tutor,
    };
    const newFile = await uploadFileService(metadata, buffer);

    res.status(201).json({
      message: "File successfully uploaded",
      file: newFile,
    });
  } catch (error: any) {
    next(error);
  }
};

export const getAllFilesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = await getAllFilesService();
    return res.status(200).json(files);
  } catch (error) {
    next(error);
  }
};
