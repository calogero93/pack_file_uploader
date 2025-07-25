import { db } from "../db/db";
import { NewFile, File } from "../dto/file";
import { DatabaseError } from "pg";
import {
  AppError,
  DuplicateError,
  ValidationError,
} from "../utils/customErrors";
import { sql } from "kysely";

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

export const getAllFiles = async (fileNames: string[]) => {
  try {
    const files = await db
      .selectFrom("file")
      .selectAll()
      .where("file_reference", "in", fileNames)
      .execute();
    return files;
  } catch (err) {
    throw new AppError(`Unknown error during file reading: ${err}`);
  }
};

export const getFileByKey = async (fileName: string) => {
  try {
    const file = await db
      .selectFrom("file")
      .selectAll()
      .where("file_reference", "=", fileName)
      .executeTakeFirst();
    return file;
  } catch (err) {
    throw new AppError(`Unknown error during file reading: ${err}`);
  }
};

export const updateFileByKey = async (fileName: string, count: number) => {
  try {
    await db
      .updateTable("file")
      .set({
        count: count + 1,
      })
      .where("file_reference", "=", fileName)
      .executeTakeFirst();

    const file = await db
      .selectFrom("file")
      .selectAll()
      .where("file_reference", "=", fileName)
      .executeTakeFirst();
    return file;
  } catch (err) {
    throw new AppError(`Unknown error during file reading: ${err}`);
  }
};

export const totalUploads = async () => {
  try {
    const totalUploadsResult = await db
      .selectFrom("file")
      .select([sql<number>`count(id)`.as("totalUploads")])
      .executeTakeFirst();
    return totalUploadsResult?.totalUploads;
  } catch (err) {
    throw new AppError(
      `Unknown error during total uploads stats reading: ${err}`
    );
  }
};

export const categoriesBreakdown = async () => {
  try {
    const categoriesBreakdowResult = await db
      .selectFrom("file")
      .select(["category", sql<number>`count(id)`.as("count")])
      .groupBy("category")
      .execute();
    return categoriesBreakdowResult;
  } catch (err) {
    throw new AppError(`Unknown error during categories stats reading: ${err}`);
  }
};

export const languagesBreakdown = async () => {
  try {
    const languagesBreakdownResult = await db
      .selectFrom("file")
      .select(["language", sql<number>`count(id)`.as("count")])
      .groupBy("language")
      .execute();
    return languagesBreakdownResult;
  } catch (err) {
    throw new AppError(`Unknown error during languages stats reading: ${err}`);
  }
};

export const providersBreakdown = async () => {
  try {
    const providersBreakdownResult = await db
      .selectFrom("file")
      .select(["provider", sql<number>`count(id)`.as("count")])
      .groupBy("provider")
      .execute();
    return providersBreakdownResult;
  } catch (err) {
    throw new AppError(`Unknown error during providers stats reading: ${err}`);
  }
};

export const rolesBreakdown = async () => {
  try {
    const rolesBreakdownResult = await db
      .selectFrom("file")
      .select(["role", sql<number>`count(id)`.as("count")])
      .groupBy("role")
      .execute();
    return rolesBreakdownResult;
  } catch (err) {
    throw new AppError(`Unknown error during roles stats reading: ${err}`);
  }
};
