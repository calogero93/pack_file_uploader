import { Request, Response, NextFunction } from "express";
import {
  uploadFileController,
  getAllFilesController,
  getFileByKeyController,
  getAggregateStatsController,
} from "../../src/controllers/fileController";
import * as fileService from "../../src/services/fileService";
import { ValidationError } from "../../src/utils/customErrors";
import { Category, Language, Provider, Role } from "../../src/db/enums";

jest.mock("../../src/services/fileService");

describe("FileController", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe("uploadFileController", () => {
    it("should upload file successfully with valid data", async () => {
      const mockFile = {
        buffer: Buffer.from("test file content"),
        originalname: "test.pdf",
      };

      const mockMetadata = {
        title: "Test File",
        description: "Test description",
        category: Category.ProjectManagement,
        language: Language.Italian,
        provider: Provider.Pack,
        role: Role.Tutor,
      };

      const mockUploadedFile = {
        id: 1,
        file_reference: "test.pdf",
        ...mockMetadata,
      };

      mockRequest = {
        file: mockFile as Express.Multer.File,
        body: mockMetadata,
      };

      (fileService.uploadFileService as jest.Mock).mockResolvedValue(
        mockUploadedFile
      );

      await uploadFileController(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(fileService.uploadFileService).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Test File",
          description: "Test description",
          category: Category.ProjectManagement,
          language: Language.Italian,
          provider: Provider.Pack,
          role: Role.Tutor,
          file_reference: "",
        }),
        mockFile.buffer,
        mockFile.originalname
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "File successfully uploaded",
        file: mockUploadedFile,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return validation error when no file is provided", async () => {
      mockRequest = {
        file: undefined,
        body: {},
      };

      await uploadFileController(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(ValidationError));
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "No file loaded",
        })
      );
    });

    it("should return validation error for invalid metadata", async () => {
      const mockFile = {
        buffer: Buffer.from("test file content"),
        originalname: "test.pdf",
      };

      mockRequest = {
        file: mockFile as Express.Multer.File,
        body: {
          title: "",
          description: "Test description",
        },
      };

      await uploadFileController(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(fileService.uploadFileService).not.toHaveBeenCalled();
    });

    it("should handle service errors", async () => {
      const mockFile = {
        buffer: Buffer.from("test file content"),
        originalname: "test.pdf",
      };

      mockRequest = {
        file: mockFile as Express.Multer.File,
        body: { title: "Test File" },
      };

      const serviceError = new Error("Service error");
      (fileService.uploadFileService as jest.Mock).mockRejectedValue(
        serviceError
      );
      await uploadFileController(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(serviceError);
    });

    describe("getAllFilesController", () => {
      it("should return all files successfully", async () => {
        const mockFiles = [
          { id: 1, title: "File 1", file_reference: "file1.pdf" },
          { id: 2, title: "File 2", file_reference: "file2.pdf" },
        ];

        (fileService.getAllFilesService as jest.Mock).mockResolvedValue(
          mockFiles
        );

        await getAllFilesController(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        );

        expect(fileService.getAllFilesService).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(mockFiles);
        expect(mockNext).not.toHaveBeenCalled();
      });

      it("should handle service errors", async () => {
        const serviceError = new Error("Service error");
        (fileService.getAllFilesService as jest.Mock).mockRejectedValue(
          serviceError
        );

        await getAllFilesController(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        );

        expect(mockNext).toHaveBeenCalledWith(serviceError);
      });
    });

    describe("getFileByKeyController", () => {
      it("should return file by key successfully", async () => {
        const mockPresignedUrl = "https://test-signed-url.com";
        mockRequest = {
          query: { fileName: "test.pdf" },
        };

        (fileService.getFilesByKeyService as jest.Mock).mockResolvedValue(
          mockPresignedUrl
        );

        await getFileByKeyController(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        );

        expect(fileService.getFilesByKeyService).toHaveBeenCalledWith(
          "test.pdf"
        );
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(mockPresignedUrl);
        expect(mockNext).not.toHaveBeenCalled();
      });

      it("should handle validation error for missing fileName", async () => {
        mockRequest = {
          query: {},
        };

        await getFileByKeyController(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        );

        expect(mockNext).toHaveBeenCalled();
        expect(fileService.getFilesByKeyService).not.toHaveBeenCalled();
      });

      it("should handle service errors", async () => {
        mockRequest = {
          query: { fileName: "test.pdf" },
        };

        const serviceError = new Error("Service error");
        (fileService.getFilesByKeyService as jest.Mock).mockRejectedValue(
          serviceError
        );

        await getFileByKeyController(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        );

        expect(mockNext).toHaveBeenCalledWith(serviceError);
      });

      it("should handle Zod validation error for multiple field violations", async () => {
        const mockFile = {
          buffer: Buffer.from("test file content"),
          originalname: "test.pdf",
        };

        mockRequest = {
          file: mockFile as Express.Multer.File,
          body: {
            title: "",
            description: "a".repeat(1001),
            category: "InvalidCategory",
            language: null,
            provider: 123,
            role: undefined,
          },
        };

        await uploadFileController(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        );

        expect(mockNext).toHaveBeenCalled();
        const calledWith = (mockNext as jest.Mock).mock.calls[0][0];
        expect(calledWith.name).toBe("ZodError");

        expect(calledWith.issues).toHaveLength(4);

        const errorPaths = calledWith.issues.map((issue: any) => issue.path[0]);
        expect(errorPaths).toEqual(
          expect.arrayContaining([
            "title",
            "description",
            "category",
            "provider",
          ])
        );

        const titleError = calledWith.issues.find(
          (issue: any) => issue.path[0] === "title"
        );
        expect(titleError.message).toBe("Il titolo è obbligatorio.");

        const descriptionError = calledWith.issues.find(
          (issue: any) => issue.path[0] === "description"
        );
        expect(descriptionError.message).toBe(
          "La descrizione non deve superare i 1000 caratteri."
        );

        expect(fileService.uploadFileService).not.toHaveBeenCalled();
      });

      it("should handle Zod validation error for edge case: null vs undefined vs empty string", async () => {
        const mockFile = {
          buffer: Buffer.from("test file content"),
          originalname: "test.pdf",
        };

        mockRequest = {
          file: mockFile as Express.Multer.File,
          body: {
            title: "Valid Title",
            description: null,
            category: undefined,
            language: "",
            provider: null,
            role: undefined,
          },
        };

        await uploadFileController(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        );

        expect(mockNext).toHaveBeenCalled();
        const calledWith = (mockNext as jest.Mock).mock.calls[0][0];
        expect(calledWith.name).toBe("ZodError");

        expect(calledWith.issues).toHaveLength(1);
        expect(calledWith.issues[0].path[0]).toBe("language");

        expect(
          calledWith.issues.every(
            (issue: any) =>
              !["description", "category", "provider", "role"].includes(
                issue.path[0]
              )
          )
        ).toBe(true);

        expect(fileService.uploadFileService).not.toHaveBeenCalled();
      });
    });

    describe("getAggregateStatsController", () => {
      it("should return aggregate stats successfully", async () => {
        const mockStats = {
          totalUpload: 10,
          categoryBreakdown: [{ category: "ProjectManagement", count: 5 }],
          languageBreakdown: [{ language: "Italian", count: 8 }],
          providerBreakdown: [{ provider: "Pack", count: 10 }],
          roleBreakdown: [{ role: "Tutor", count: 7 }],
        };

        (fileService.getAggregatedStatsService as jest.Mock).mockResolvedValue(
          mockStats
        );

        await getAggregateStatsController(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        );

        expect(fileService.getAggregatedStatsService).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(mockStats);
        expect(mockNext).not.toHaveBeenCalled();
      });

      it("should handle service errors", async () => {
        const serviceError = new Error("Service error");
        (fileService.getAggregatedStatsService as jest.Mock).mockRejectedValue(
          serviceError
        );

        await getAggregateStatsController(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        );

        expect(mockNext).toHaveBeenCalledWith(serviceError);
      });
    });
  });
});
