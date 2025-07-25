import { NewFile } from "../dto/file";
import {
  categoriesBreakdown,
  getAllFiles,
  getFileByKey,
  languagesBreakdown,
  providersBreakdown,
  rolesBreakdown,
  totalUploads,
  updateFileByKey,
  uploadFile,
} from "../repository/fileRepository";
import multer from "multer";
import { Resource } from "sst";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  S3Client,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({});

export const uploadFileService = async (
  file: NewFile,
  buffer: Buffer<ArrayBufferLike>,
  fileName: string
) => {
  try {
    const fileDB = await getFileByKey(fileName);

    const params = {
      Bucket: Resource.PackBucket.name,
      Key: fileName,
      Body: buffer,
    };

    const uploadClient = new Upload({
      params,
      client: s3,
    });

    if (fileDB) {
      const updatedFile = await updateFileByKey(
        fileDB.file_reference,
        fileDB.count
      );
      return updatedFile;
    }

    const up = await uploadClient.done();
    console.log("S3 Upload done:", up);
    file.file_reference = up.Key!;

    const newFileRecord = await uploadFile(file);
    return newFileRecord;
  } catch (error: any) {
    console.error("Service Error during loading file:", error);
    if (file.file_reference && error.message.includes("database error")) {
      // Refined condition
      try {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: Resource.PackBucket.name,
            Key: file.file_reference,
          })
        );
        console.log(
          `File ${file.file_reference} removed due to database error`
        );
      } catch (s3DeleteError: any) {
        console.error("Error during S3 cleanup:", s3DeleteError);
      }
    }
    throw error;
  }
};

export const getAllFilesService = async () => {
  const listCommand = new ListObjectsV2Command({
    Bucket: Resource.PackBucket.name,
  });

  const response = await s3.send(listCommand);
  let listFiles = response.Contents?.map((fileData) => {
    return fileData.Key!;
  });

  if (!listFiles) return [];
  return await getAllFiles(listFiles);
};

export const getFilesByKeyService = async (fileName: string) => {
  const getCommand = new GetObjectCommand({
    Bucket: Resource.PackBucket.name,
    Key: fileName,
  });

  const fileDB = await getFileByKey(fileName);

  if (!fileDB) {
    return "No file";
  }

  const presignedUrl = await getSignedUrl(s3, getCommand, {
    expiresIn: 3600,
  });

  return presignedUrl;
};

export const getAggregatedStatsService = async () => {
  const totalUpload = await totalUploads();
  const categoryBreakdown = await categoriesBreakdown();
  const languageBreakdown = await languagesBreakdown();
  const providerBreakdown = await providersBreakdown();
  const roleBreakdown = await rolesBreakdown();

  return {
    totalUpload,
    categoryBreakdown,
    languageBreakdown,
    providerBreakdown,
    roleBreakdown,
  };
};
