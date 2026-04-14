/**
 * @openapi
 * tags:
 *   - name: Service
 *     description: Service management and operations
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 65d2c1e2f1a2b3c4d5e6f7a8
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 150
 *           example: Library Management
 *         instituteId:
 *           $ref: '#/components/schemas/Institute'
 *         description:
 *           type: string
 *           maxLength: 500
 *           example: Manages library books and users
 *         visibility:
 *           type: string
 *           enum: [public, private]
 *           example: public
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *           example: active
 *         createdBy:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             fullName:
 *               type: string
 *             email:
 *               type: string
 *             role:
 *               type: string
 *           example:
 *             _id: 65d2c1e2f1a2b3c4d5e6f7a8
 *             fullName: John Doe
 *             email: john@example.com
 *             role: ADMIN
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time

 *     Institute:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 65d2c1e2f1a2b3c4d5e6f7a8
 *         name:
 *           type: string
 *           example: Institute of Technology
 *         code:
 *           type: string
 *           example: IT2026
 *         isActive:
 *           type: boolean
 *           example: true
 *         createdBy:
 *           type: string
 *           example: 65d2c1e2f1a2b3c4d5e6f7a8
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateServiceRequest:
 *       type: object
 *       required:
 *         - name
 *         - instituteId
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 150
 *           example: Library Management
 *         instituteId:
 *           type: string
 *           example: 65d2c1e2f1a2b3c4d5e6f7a8
 *         description:
 *           type: string
 *           maxLength: 500
 *           example: Manages library books and users
 *         visibility:
 *           type: string
 *           enum: [public, private]
 *           example: public
 *
 *     UpdateServiceRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 150
 *           example: Library Management
 *         description:
 *           type: string
 *           maxLength: 500
 *           example: Manages library books and users
 *         visibility:
 *           type: string
 *           enum: [public, private]
 *           example: public
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *           example: active
 */

/**
 * @openapi
 * /api/service/health:
 *   get:
 *     tags:
 *       - Service
 *     summary: Health check for service module
 *     responses:
 *       200:
 *         description: Service module working
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Service module working
 */

/**
 * @openapi
 * /api/service:
 *   get:
 *     tags:
 *       - Service
 *     summary: List all services
 *     responses:
 *       200:
 *         description: List of services
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
 *                     $ref: '#/components/schemas/Service'
 */

/**
 * @openapi
 * /api/service/{id}:
 *   get:
 *     tags:
 *       - Service
 *     summary: Get service by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Service'
 */

/**
 * @openapi
 * /api/service:
 *   post:
 *     tags:
 *       - Service
 *     summary: Create a new service
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateServiceRequest'
 *     responses:
 *       201:
 *         description: Service created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Service'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden (insufficient role)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/service/{id}:
 *   patch:
 *     tags:
 *       - Service
 *     summary: Update a service
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateServiceRequest'
 *     responses:
 *       200:
 *         description: Service updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Service'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden (insufficient role)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/service/{id}:
 *   delete:
 *     tags:
 *       - Service
 *     summary: Delete a service
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Service deleted
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden (insufficient role)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
