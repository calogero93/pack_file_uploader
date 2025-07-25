jest.mock("sst", () => ({
  Resource: {
    PackBucket: {
      name: "test-bucket",
    },
    PackDatabase: {
      host: "localhost",
      port: 5432,
      database: "test_db",
      username: "test_user",
      password: "test_password",
    },
    API_KEY: {
      value: "test-api-key",
    },
  },
}));

jest.mock("@aws-sdk/client-s3", () => {
  const mockS3Client = {
    send: jest.fn(),
  };

  return {
    S3Client: jest.fn(() => mockS3Client),
    GetObjectCommand: jest.fn(),
    ListObjectsV2Command: jest.fn(),
    DeleteObjectCommand: jest.fn(),
  };
});

jest.mock("@aws-sdk/lib-storage", () => ({
  Upload: jest.fn().mockImplementation(() => ({
    done: jest.fn().mockResolvedValue({
      Key: "test-file.pdf",
      Location: "https://test-bucket.s3.amazonaws.com/test-file.pdf",
    }),
  })),
}));

jest.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: jest.fn().mockResolvedValue("https://test-signed-url.com"),
}));

jest.mock("../src/db/db", () => ({
  db: {
    insertInto: jest.fn().mockReturnThis(),
    selectFrom: jest.fn().mockReturnThis(),
    updateTable: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returningAll: jest.fn().mockReturnThis(),
    selectAll: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    executeTakeFirst: jest.fn(),
    execute: jest.fn(),
  },
}));

global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};
