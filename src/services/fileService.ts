import { NewFile } from "../dto/file";
import { getAllFiles, uploadFile } from "../repository/fileRepository";
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
const upload = multer({ storage: multer.memoryStorage() });

export const uploadFileService = async (
  file: NewFile,
  buffer: Buffer<ArrayBufferLike>
) => {
  try {
    const params = {
      Bucket: Resource.MyBucket.name,
      Key: file?.title,
      Body: buffer,
    };

    const upload = new Upload({
      params,
      client: s3,
    });

    const up = await upload.done();

    file.file_reference = up.Key!;

    return await uploadFile(file);
  } catch (error) {
    console.error("Service Error during loading file:", error);

    if (file.file_reference) {
      try {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: "your-s3-bucket-name",
            Key: file.file_reference,
          })
        );
        console.log(
          `File ${file.file_reference} removed coused by error in db`
        );
      } catch (s3DeleteError: any) {
        console.error("Error during remove file from S3:", s3DeleteError);
      }
    }
  }
};

export const getAllFilesService = async () => {
  return await getAllFiles();
};
