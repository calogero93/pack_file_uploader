import { Router } from "express";
import multer from "multer";
import {
  getAggregateStatsController,
  getAllFilesController,
  getFileByKeyController,
  uploadFileController,
} from "../controllers/fileController";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     ApiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: Authorization
 *       description: API Key authorization using Bearer token
 *   schemas:
 *     Category:
 *       type: string
 *       enum:
 *         - ProjectManagement
 *         - Leadership
 *         - Negotiation
 *         - SoftwareDevelopment
 *         - ProblemSolving
 *       example: ProjectManagement
 *     Language:
 *       type: string
 *       enum:
 *         - Italian
 *         - English
 *         - Spanish
 *         - Chinese
 *       example: Italian
 *     Provider:
 *       type: string
 *       enum:
 *         - Pack
 *         - Academy
 *         - Tutor
 *       example: Pack
 *     Role:
 *       type: string
 *       enum:
 *         - Tutor
 *         - Student
 *       example: Tutor
 *     FileMetadata:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           description: File title
 *           maxLength: 200
 *           example: "Project Documentation"
 *         description:
 *           type: string
 *           description: File description (optional)
 *           maxLength: 1000
 *           example: "Detailed project documentation for Q1"
 *         category:
 *           $ref: '#/components/schemas/Category'
 *         language:
 *           $ref: '#/components/schemas/Language'
 *         provider:
 *           $ref: '#/components/schemas/Provider'
 *         role:
 *           $ref: '#/components/schemas/Role'
 *     FileResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "Project Documentation"
 *         description:
 *           type: string
 *           example: "Detailed project documentation for Q1"
 *         category:
 *           $ref: '#/components/schemas/Category'
 *         language:
 *           $ref: '#/components/schemas/Language'
 *         provider:
 *           $ref: '#/components/schemas/Provider'
 *         role:
 *           $ref: '#/components/schemas/Role'
 *         count:
 *           type: integer
 *           example: 1
 *         file_reference:
 *           type: string
 *           example: "project-documentation.pdf"
 *     FileUploadSuccess:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "File successfully uploaded"
 *         file:
 *           $ref: '#/components/schemas/FileResponse'
 *     StatsBreakdown:
 *       type: object
 *       properties:
 *         category:
 *           type: string
 *           example: "ProjectManagement"
 *         count:
 *           type: integer
 *           example: 5
 *     StatsResponse:
 *       type: object
 *       properties:
 *         totalUpload:
 *           type: integer
 *           example: 25
 *         categoryBreakdown:
 *           type: array
 *           items:
 *             allOf:
 *               - $ref: '#/components/schemas/StatsBreakdown'
 *               - type: object
 *                 properties:
 *                   category:
 *                     $ref: '#/components/schemas/Category'
 *         languageBreakdown:
 *           type: array
 *           items:
 *             allOf:
 *               - $ref: '#/components/schemas/StatsBreakdown'
 *               - type: object
 *                 properties:
 *                   language:
 *                     $ref: '#/components/schemas/Language'
 *         providerBreakdown:
 *           type: array
 *           items:
 *             allOf:
 *               - $ref: '#/components/schemas/StatsBreakdown'
 *               - type: object
 *                 properties:
 *                   provider:
 *                     $ref: '#/components/schemas/Provider'
 *         roleBreakdown:
 *           type: array
 *           items:
 *             allOf:
 *               - $ref: '#/components/schemas/StatsBreakdown'
 *               - type: object
 *                 properties:
 *                   role:
 *                     $ref: '#/components/schemas/Role'
 *     Error:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "error"
 *         message:
 *           type: string
 *           example: "Validation input data error"
 *         stack:
 *           type: string
 *           description: "Error stack trace (only in development)"
 */

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload a file with metadata
 *     description: |
 *       Upload a file to S3 storage with associated metadata.
 *       The file will be processed and stored with the provided metadata.
 *       If a file with the same name already exists, the download counter will be incremented.
 *     tags: [Files]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - title
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File to upload (PDF, DOC, DOCX, etc.)
 *               title:
 *                 type: string
 *                 description: File title (required, max 200 characters)
 *                 maxLength: 200
 *                 example: "Project Documentation"
 *               description:
 *                 type: string
 *                 description: File description (optional, max 1000 characters)
 *                 maxLength: 1000
 *                 example: "Detailed project documentation for Q1"
 *               category:
 *                 $ref: '#/components/schemas/Category'
 *               language:
 *                 $ref: '#/components/schemas/Language'
 *               provider:
 *                 $ref: '#/components/schemas/Provider'
 *               role:
 *                 $ref: '#/components/schemas/Role'
 *           encoding:
 *             file:
 *               contentType: application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FileUploadSuccess'
 *       400:
 *         description: Bad request - Invalid file or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               no_file:
 *                 summary: No file provided
 *                 value:
 *                   status: "error"
 *                   message: "No file loaded"
 *               invalid_title:
 *                 summary: Invalid title
 *                 value:
 *                   status: "error"
 *                   message: "Validation input data error Il titolo è obbligatorio."
 *       401:
 *         description: Unauthorized - Invalid or missing API key
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: "error"
 *               message: "Unauthorized"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: "error"
 *               message: "Database error during file creation"
 */
router.post("/upload", upload.single("file"), uploadFileController);

/**
 * @swagger
 * /api/files:
 *   get:
 *     summary: Get all files
 *     description: |
 *       Retrieve a list of all files stored in S3 that also exist in the database.
 *       Files are returned with their metadata and reference information.
 *     tags: [Files]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: List of files retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FileResponse'
 *             examples:
 *               success:
 *                 summary: Successful response
 *                 value:
 *                   - id: 1
 *                     title: "Meeting Notes"
 *                     description: "Weekly team meeting notes"
 *                     category: "ProjectManagement"
 *                     language: "Italian"
 *                     provider: "Pack"
 *                     role: "Tutor"
 *                     count: 3
 *                     file_reference: "meeting-notes.pdf"
 *                   - id: 2
 *                     title: "Design Guidelines"
 *                     description: "UI/UX design guidelines"
 *                     category: "SoftwareDevelopment"
 *                     language: "English"
 *                     provider: "Academy"
 *                     role: "Student"
 *                     count: 1
 *                     file_reference: "design-guidelines.pdf"
 *               empty:
 *                 summary: No files found
 *                 value: []
 *       401:
 *         description: Unauthorized - Invalid or missing API key
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/files", getAllFilesController);

/**
 * @swagger
 * /api/file:
 *   get:
 *     summary: Get presigned download URL for a file
 *     description: |
 *       Retrieve a presigned URL for downloading a specific file from S3.
 *       The URL is valid for 1 hour and allows secure access to the file.
 *       Returns "No file" if the file doesn't exist in the database.
 *     tags: [Files]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: fileName
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the file to download
 *         example: "meeting-notes.pdf"
 *     responses:
 *       200:
 *         description: Presigned URL retrieved successfully or file not found
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: string
 *                   description: Presigned URL for file download
 *                   example: "https://pack-bucket.s3.amazonaws.com/meeting-notes.pdf?X-Amz-Algorithm=..."
 *                 - type: string
 *                   description: File not found message
 *                   example: "No file"
 *             examples:
 *               success:
 *                 summary: File found
 *                 value: "https://pack-bucket.s3.amazonaws.com/meeting-notes.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=..."
 *               not_found:
 *                 summary: File not found
 *                 value: "No file"
 *       400:
 *         description: Bad request - Missing or invalid fileName parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: "error"
 *               message: "Validation input data error Invalid input: expected string, received undefined"
 *       401:
 *         description: Unauthorized - Invalid or missing API key
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/file", getFileByKeyController);

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Get aggregated file statistics
 *     description: |
 *       Retrieve comprehensive statistics about uploaded files including:
 *       - Total number of uploaded files
 *       - Breakdown by category, language, provider, and role
 *       All statistics are calculated in real-time from the database.
 *     tags: [Files]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StatsResponse'
 *             examples:
 *               success:
 *                 summary: Statistics with data
 *                 value:
 *                   totalUpload: 25
 *                   categoryBreakdown:
 *                     - category: "ProjectManagement"
 *                       count: 10
 *                     - category: "Leadership"
 *                       count: 8
 *                     - category: "SoftwareDevelopment"
 *                       count: 7
 *                   languageBreakdown:
 *                     - language: "Italian"
 *                       count: 15
 *                     - language: "English"
 *                       count: 10
 *                   providerBreakdown:
 *                     - provider: "Pack"
 *                       count: 12
 *                     - provider: "Academy"
 *                       count: 8
 *                     - provider: "Tutor"
 *                       count: 5
 *                   roleBreakdown:
 *                     - role: "Tutor"
 *                       count: 18
 *                     - role: "Student"
 *                       count: 7
 *               empty:
 *                 summary: No data available
 *                 value:
 *                   totalUpload: 0
 *                   categoryBreakdown: []
 *                   languageBreakdown: []
 *                   providerBreakdown: []
 *                   roleBreakdown: []
 *       401:
 *         description: Unauthorized - Invalid or missing API key
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/stats", getAggregateStatsController);

export default router;
