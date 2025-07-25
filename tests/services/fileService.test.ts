import {
  uploadFileService,
  getAllFilesService,
  getFilesByKeyService,
  getAggregatedStatsService,
} from "../../src/services/fileService";
import * as fileRepository from "../../src/repository/fileRepository";
import { Category, Language, Provider, Role } from "../../src/db/enums";

jest.mock("../../src/repository/fileRepository");

jest.mock("@aws-sdk/client-s3");
jest.mock("@aws-sdk/lib-storage");
jest.mock("@aws-sdk/s3-request-presigner");

import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const mockS3Client = S3Client as jest.MockedClass<typeof S3Client>;
const mockUpload = Upload as jest.MockedClass<typeof Upload>;
const mockGetSignedUrl = getSignedUrl as jest.MockedFunction<
  typeof getSignedUrl
>;

describe("FileService", () => {
  let mockS3Send: jest.Mock;
  let mockUploadDone: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockS3Send = jest.fn();
    mockS3Client.mockImplementation(
      () =>
        ({
          send: mockS3Send,
        } as any)
    );

    mockUploadDone = jest.fn();
    mockUpload.mockImplementation(
      () =>
        ({
          done: mockUploadDone,
        } as any)
    );
  });

  describe("uploadFileService", () => {
    it("should upload new file successfully", async () => {
      const mockFile = {
        title: "Test File",
        description: "Test description",
        category: Category.ProjectManagement,
        language: Language.Italian,
        provider: Provider.Pack,
        role: Role.Tutor,
        file_reference: "",
      };

      const mockBuffer = Buffer.from("test file content");
      const fileName = "test.pdf";

      const mockUploadResult = {
        Key: "test.pdf",
        Location: "https://test-bucket.s3.amazonaws.com/test.pdf",
      };

      const mockDbFile = {
        id: 1,
        ...mockFile,
        file_reference: "test.pdf",
        count: 1,
      };

      (fileRepository.getFileByKey as jest.Mock).mockResolvedValue(null);
      (fileRepository.uploadFile as jest.Mock).mockResolvedValue(mockDbFile);
      mockUploadDone.mockResolvedValue(mockUploadResult);

      const result = await uploadFileService(mockFile, mockBuffer, fileName);

      expect(fileRepository.getFileByKey).toHaveBeenCalledWith(fileName);
      expect(fileRepository.uploadFile).toHaveBeenCalledWith({
        ...mockFile,
        file_reference: "test.pdf",
      });
      expect(result).toEqual(mockDbFile);
    });

    it("should update existing file count", async () => {
      const mockFile = {
        title: "Test File",
        description: "Test description",
        category: Category.ProjectManagement,
        language: Language.Italian,
        provider: Provider.Pack,
        role: Role.Tutor,
        file_reference: "",
      };

      const mockBuffer = Buffer.from("test file content");
      const fileName = "existing-test.pdf";

      const existingDbFile = {
        id: 1,
        file_reference: "existing-test.pdf",
        count: 2,
      };

      const mockUploadResult = {
        Key: "existing-test.pdf",
      };

      const updatedDbFile = {
        ...existingDbFile,
        count: 3,
      };

      (fileRepository.getFileByKey as jest.Mock).mockResolvedValue(
        existingDbFile
      );
      (fileRepository.updateFileByKey as jest.Mock).mockResolvedValue(
        updatedDbFile
      );
      mockUploadDone.mockResolvedValue(mockUploadResult);

      const result = await uploadFileService(mockFile, mockBuffer, fileName);

      expect(fileRepository.updateFileByKey).toHaveBeenCalledWith(
        "existing-test.pdf",
        2
      );
      expect(result).toEqual(updatedDbFile);
    });
  });

  describe("getFilesByKeyService", () => {
    it("should return presigned URL for existing file", async () => {
      const fileName = "test.pdf";
      const mockDbFile = {
        id: 1,
        file_reference: fileName,
        title: "Test File",
      };
      const mockPresignedUrl = "https://test-signed-url.com";

      (fileRepository.getFileByKey as jest.Mock).mockResolvedValue(mockDbFile);
      mockGetSignedUrl.mockResolvedValue(mockPresignedUrl);

      const result = await getFilesByKeyService(fileName);

      expect(fileRepository.getFileByKey).toHaveBeenCalledWith(fileName);
      expect(mockGetSignedUrl).toHaveBeenCalled();
      expect(result).toBe(mockPresignedUrl);
    });

    it('should return "No file" when file does not exist in database', async () => {
      const fileName = "nonexistent.pdf";
      (fileRepository.getFileByKey as jest.Mock).mockResolvedValue(null);

      const result = await getFilesByKeyService(fileName);

      expect(result).toBe("No file");
      expect(mockGetSignedUrl).not.toHaveBeenCalled();
    });
  });

  describe("getAggregatedStatsService", () => {
    it("should return aggregated statistics", async () => {
      const mockStats = {
        totalUploads: 10,
        categories: [{ category: "ProjectManagement", count: 5 }],
        languages: [{ language: "Italian", count: 8 }],
        providers: [{ provider: "Pack", count: 10 }],
        roles: [{ role: "Tutor", count: 7 }],
      };

      (fileRepository.totalUploads as jest.Mock).mockResolvedValue(10);
      (fileRepository.categoriesBreakdown as jest.Mock).mockResolvedValue(
        mockStats.categories
      );
      (fileRepository.languagesBreakdown as jest.Mock).mockResolvedValue(
        mockStats.languages
      );
      (fileRepository.providersBreakdown as jest.Mock).mockResolvedValue(
        mockStats.providers
      );
      (fileRepository.rolesBreakdown as jest.Mock).mockResolvedValue(
        mockStats.roles
      );

      const result = await getAggregatedStatsService();

      expect(fileRepository.totalUploads).toHaveBeenCalled();
      expect(fileRepository.categoriesBreakdown).toHaveBeenCalled();
      expect(fileRepository.languagesBreakdown).toHaveBeenCalled();
      expect(fileRepository.providersBreakdown).toHaveBeenCalled();
      expect(fileRepository.rolesBreakdown).toHaveBeenCalled();

      expect(result).toEqual({
        totalUpload: 10,
        categoryBreakdown: mockStats.categories,
        languageBreakdown: mockStats.languages,
        providerBreakdown: mockStats.providers,
        roleBreakdown: mockStats.roles,
      });
    });
  });
});
