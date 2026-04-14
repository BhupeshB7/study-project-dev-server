/**
 * @openapi
 * tags:
 *   - name: Institute
 *     description: Institute management and operations
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateInstituteRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         name:
 *           type: string
 *           minLength: 3
 *           maxLength: 100
 *           example: ABC Institute
 *         email:
 *           type: string
 *           format: email
 *           example: institute@abc.com
 *     CreateInstituteResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Institute created successfully
 *         data:
 *           type: object
 *           properties:
 *             instituteId:
 *               type: string
 *               example: 65d2c1e2f1a2b3c4d5e6f7a8
 *             email:
 *               type: string
 *               example: institute@abc.com
 */

/**
 * @openapi
 * /api/institute/register:
 *   post:
 *     tags:
 *       - Institute
 *     summary: Register a new institute
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateInstituteRequest'
 *     responses:
 *       200:
 *         description: Institute created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateInstituteResponse'
 *       409:
 *         description: Institute already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/institute/profile:
 *   get:
 *     tags:
 *       - Institute
 *     summary: Get institute profile
 *     responses:
 *       200:
 *         description: Institute profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     address:
 *                       type: string
 *                     status:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/institute/list:
 *   get:
 *     tags:
 *       - Institute
 *     summary: Get list of all institutes
 *     responses:
 *       200:
 *         description: List of institutes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       instituteId:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       status:
 *                         type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
