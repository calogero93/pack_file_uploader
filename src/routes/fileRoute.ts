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
 *           example: "Project Documentation"
 *         description:
 *           type: string
 *           description: File description (optional)
 *           example: "Detailed project documentation for Q1"
 *         category:
 *           $ref: '#/components/schemas/Category'
 *         language:
 *           $ref: '#/components/schemas/Language'
 *         provider:
 *           $ref: '#/components/schemas/Provider'
 *         role:
 *           $ref: '#/components/schemas/Role'
 *     FileUploadSuccess:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "File successfully uploaded"
 *         file:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "123e4567-e89b-12d3-a456-426614174000"
 *             title:
 *               type: string
 *               example: "Project Documentation"
 *             file_reference:
 *               type: string
 *               example: "https://bucket.s3.amazonaws.com/files/document.pdf"
 *             category:
 *               $ref: '#/components/schemas/Category'
 *             language:
 *               $ref: '#/components/schemas/Language'
 *             provider:
 *               $ref: '#/components/schemas/Provider'
 *             role:
 *               $ref: '#/components/schemas/Role'
 *             uploadedAt:
 *               type: string
 *               format: date-time
 *               example: "2024-01-01T12:00:00Z"
 */

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload a file with metadata
 *     description: |
 *       Upload a file to S3 storage with associated metadata.
 *       The file will be processed and stored with the provided metadata.
 *     tags: [Files]
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
 *                 description: File title (required)
 *                 example: "Project Documentation"
 *               description:
 *                 type: string
 *                 description: File description (optional)
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
 *               allOf:
 *                 - $ref: '#/components/schemas/Error'
 *               example:
 *                 status: "error"
 *                 message: "No file loaded"
 *       409:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Error'
 *               example:
 *                 status: "error"
 *                 message: "Errore di validazione dei dati: title is required"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *     examples:
 *       basic_upload:
 *         summary: Basic file upload
 *         value:
 *           title: "Meeting Notes"
 *           description: "Weekly team meeting notes"
 *           category: "ProjectManagement"
 *           language: "Italian"
 */
router.post("/upload", upload.single("file"), uploadFileController);

/**
 * @swagger
 * /api/files:
 *   get:
 *     summary: Get all files
 *     tags: [Files]
 *     responses:
 *       200:
 *         description: List of files
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 files:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       url:
 *                         type: string
 *                       uploadedAt:
 *                         type: string
 *                         format: date-time
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 */
router.get("/files", getAllFilesController);

/**
 * @swagger
 * /api/file:
 *   get:
 *     summary: Get single file
 *     tags: [Files]
 *     parameters:
 *       - in: query
 *         name: fileName
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Signed Url of a file
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 files:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       url:
 *                         type: string
 *                       uploadedAt:
 *                         type: string
 *                         format: date-time
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 */
router.get("/file", getFileByKeyController);

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Get aggregate stats
 *     tags: [Files]
 *     responses:
 *       200:
 *         description: List of all stats abount uploads
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 files:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       url:
 *                         type: string
 *                       uploadedAt:
 *                         type: string
 *                         format: date-time
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 */
router.get("/stats", getAggregateStatsController);

export default router;
