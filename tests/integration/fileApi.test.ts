import request from "supertest";
import app from "../../src/index";
import * as fileService from "../../src/services/fileService";

jest.mock("../../src/services/fileService");

const VALID_API_KEY = "test-api-key";

describe("File Routes (integration, db mocked)", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("GET /api/files should return files list", async () => {
    (fileService.getAllFilesService as jest.Mock).mockResolvedValue([
      {
        id: "1",
        title: "Test file",
        file_reference: "test.pdf",
        description: "Desc",
        category: "ProjectManagement",
        language: "Italian",
        provider: "Pack",
        role: "Tutor",
      },
    ]);

    const res = await request(app)
      .get("/api/files")
      .set("x-api-key", VALID_API_KEY)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty("title", "Test file");
  });

  it("POST /api/upload should upload file", async () => {
    (fileService.uploadFileService as jest.Mock).mockResolvedValue({
      id: "123",
      title: "Test file",
      file_reference: "test.pdf",
    });

    const res = await request(app)
      .post("/api/upload")
      .set("x-api-key", VALID_API_KEY)
      .field("title", "Test file")
      .attach("file", Buffer.from("dummy content"), "test.pdf")
      .expect(201);

    expect(res.body).toHaveProperty("message", "File successfully uploaded");
    expect(res.body.file).toHaveProperty("id", "123");
  });

  it("GET /api/file should return file by key", async () => {
    (fileService.getFilesByKeyService as jest.Mock).mockResolvedValue({
      url: "https://example.com/file.pdf",
    });

    const res = await request(app)
      .get("/api/file")
      .query({ fileName: "file.pdf" })
      .set("x-api-key", VALID_API_KEY)
      .expect(200);

    expect(res.body).toHaveProperty("url");
  });

  it("GET /api/stats should return stats", async () => {
    (fileService.getAggregatedStatsService as jest.Mock).mockResolvedValue({
      totalFiles: 12,
      totalSize: 1000000,
    });

    const res = await request(app)
      .get("/api/stats")
      .set("x-api-key", VALID_API_KEY)
      .expect(200);

    expect(res.body.totalFiles).toBe(12);
  });

  it("Should return 401 if API key is missing", async () => {
    const res = await request(app).get("/api/files").expect(401);
    expect(res.body).toHaveProperty("error", "API key missing");
  });

  it("Should return 403 if API key is invalid", async () => {
    const res = await request(app)
      .get("/api/files")
      .set("x-api-key", "invalid")
      .expect(403);
    expect(res.body).toHaveProperty("error", "Invalid API key");
  });
});
