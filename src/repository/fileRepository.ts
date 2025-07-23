import { db } from "../db/db";
import { NewFile, File } from "../dto/file";
import { DatabaseError } from "pg";
import {
  AppError,
  DuplicateError,
  ValidationError,
} from "../utils/customErrors";

export const uploadFile = async (file: NewFile) => {
  try {
    const newFile = await db
      .insertInto("file")
      .values(file)
      .returningAll()
      .executeTakeFirst();
    return newFile;
  } catch (err) {
    if (err instanceof DatabaseError) {
      switch (err.code) {
        case "23502":
          throw new ValidationError(`Missing required field: ${err.column}`);
        case "22P02":
          throw new ValidationError("Invalid input syntax");
        default:
          throw new AppError(`Database error: ${err}`);
      }
    }

    throw new AppError(`Unknown error during file creation: ${err}`);
  }
};

export const getAllFiles = async () => {
  try {
    const files = await db.selectFrom("file").selectAll().execute();
    return files;
  } catch (err) {
    throw new AppError(`Unknown error during file reading: ${err}`);
  }
};
