/**
 * @openapi
 * tags:
 *   - name: Service Config
 *     description: Service configuration management (required documents, slots, eligibility rules)
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     DocumentRequirement:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 150
 *           example: Aadhar Card
 *         status:
 *           type: string
 *           enum: [required, optional]
 *           example: required
 *         description:
 *           type: string
 *           maxLength: 300
 *           nullable: true
 *           example: Government issued photo ID proof
 *
 *     SlotConfig:
 *       type: object
 *       required:
 *         - dayOfWeek
 *         - startTime
 *         - endTime
 *       properties:
 *         dayOfWeek:
 *           type: string
 *           enum: [monday, tuesday, wednesday, thursday, friday, saturday, sunday]
 *           example: monday
 *         startTime:
 *           type: string
 *           example: "09:00"
 *         endTime:
 *           type: string
 *           example: "17:00"
 *         slotDurationMinutes:
 *           type: integer
 *           minimum: 5
 *           default: 30
 *           example: 30
 *         maxConcurrent:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *           example: 2
 *
 *     ServiceConfig:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 65d2c1e2f1a2b3c4d5e6f7a8
 *         serviceId:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *             status:
 *               type: string
 *             visibility:
 *               type: string
 *           example:
 *             _id: 65d2c1e2f1a2b3c4d5e6f7a8
 *             name: Bonafide Certificate
 *             status: active
 *             visibility: public
 *         instituteId:
 *           type: string
 *           example: 65d2c1e2f1a2b3c4d5e6f7a8
 *         requiredDocuments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DocumentRequirement'
 *         slots:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SlotConfig'
 *         maxActiveRequestsPerUser:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *           example: 1
 *         allowAppointments:
 *           type: boolean
 *           default: false
 *           example: false
 *         allowQueue:
 *           type: boolean
 *           default: true
 *           example: true
 *         eligibleRoles:
 *           type: array
 *           items:
 *             type: string
 *           example: ["student"]
 *         processingDays:
 *           type: integer
 *           nullable: true
 *           example: 5
 *         notes:
 *           type: string
 *           maxLength: 1000
 *           nullable: true
 *           example: Processing takes 3-5 working days
 *         createdBy:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             fullName:
 *               type: string
 *             email:
 *               type: string
 *           example:
 *             _id: 65d2c1e2f1a2b3c4d5e6f7a8
 *             fullName: Admin User
 *             email: admin@institute.com
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateServiceConfigRequest:
 *       type: object
 *       required:
 *         - serviceId
 *       properties:
 *         serviceId:
 *           type: string
 *           example: 65d2c1e2f1a2b3c4d5e6f7a8
 *         requiredDocuments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DocumentRequirement'
 *           default: []
 *         slots:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SlotConfig'
 *           default: []
 *         maxActiveRequestsPerUser:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *           example: 1
 *         allowAppointments:
 *           type: boolean
 *           default: false
 *         allowQueue:
 *           type: boolean
 *           default: true
 *         eligibleRoles:
 *           type: array
 *           items:
 *             type: string
 *           default: ["student"]
 *           example: ["student"]
 *         processingDays:
 *           type: integer
 *           nullable: true
 *           example: 5
 *         notes:
 *           type: string
 *           maxLength: 1000
 *           nullable: true
 *           example: Processing takes 3-5 working days
 *
 *     UpdateServiceConfigRequest:
 *       type: object
 *       properties:
 *         requiredDocuments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DocumentRequirement'
 *         slots:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SlotConfig'
 *         maxActiveRequestsPerUser:
 *           type: integer
 *           minimum: 1
 *         allowAppointments:
 *           type: boolean
 *         allowQueue:
 *           type: boolean
 *         eligibleRoles:
 *           type: array
 *           items:
 *             type: string
 *         processingDays:
 *           type: integer
 *           nullable: true
 *         notes:
 *           type: string
 *           maxLength: 1000
 *           nullable: true
 */

/**
 * @openapi
 * /api/service-config/health:
 *   get:
 *     tags:
 *       - Service Config
 *     summary: Health check for service config module
 *     responses:
 *       200:
 *         description: Service config module working
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
 *                   example: Service config module working
 */

/**
 * @openapi
 * /api/service-config:
 *   post:
 *     tags:
 *       - Service Config
 *     summary: Create service config for a service (Admin/Staff only)
 *     description: >
 *       Creates configuration for an existing service. This must be done after service creation
 *       and before creating a workflow template. Defines required documents, appointment slots,
 *       eligibility rules, and request limits. Only one config per service is allowed.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateServiceConfigRequest'
 *           example:
 *             serviceId: "65d2c1e2f1a2b3c4d5e6f7a8"
 *             requiredDocuments:
 *               - name: "Aadhar Card"
 *                 status: "required"
 *                 description: "Government issued photo ID"
 *               - name: "Fee Receipt"
 *                 status: "optional"
 *             slots:
 *               - dayOfWeek: "monday"
 *                 startTime: "09:00"
 *                 endTime: "17:00"
 *                 slotDurationMinutes: 30
 *                 maxConcurrent: 2
 *             maxActiveRequestsPerUser: 1
 *             allowAppointments: true
 *             allowQueue: true
 *             eligibleRoles: ["student"]
 *             processingDays: 5
 *             notes: "Bring originals for verification"
 *     responses:
 *       201:
 *         description: Service config created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ServiceConfig'
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
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Service not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Config already exists for this service
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/service-config:
 *   get:
 *     tags:
 *       - Service Config
 *     summary: List all service configs for the institute (Admin/Staff only)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of service configs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ServiceConfig'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/service-config/{serviceId}:
 *   get:
 *     tags:
 *       - Service Config
 *     summary: Get config for a specific service
 *     description: >
 *       Students can call this to see required documents and slot rules
 *       before submitting a service request.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The service ID (not config ID)
 *         example: 65d2c1e2f1a2b3c4d5e6f7a8
 *     responses:
 *       200:
 *         description: Service config details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ServiceConfig'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Service config not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/service-config/{serviceId}:
 *   patch:
 *     tags:
 *       - Service Config
 *     summary: Update config for a specific service (Admin/Staff only)
 *     description: >
 *       Partially updates the service config. Only the fields provided in the
 *       request body will be updated. All fields are optional.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The service ID (not config ID)
 *         example: 65d2c1e2f1a2b3c4d5e6f7a8
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateServiceConfigRequest'
 *           example:
 *             maxActiveRequestsPerUser: 2
 *             processingDays: 3
 *             notes: "Updated processing time to 3 days"
 *     responses:
 *       200:
 *         description: Service config updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ServiceConfig'
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
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Service config not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/service-config/{serviceId}:
 *   delete:
 *     tags:
 *       - Service Config
 *     summary: Delete config for a specific service (Admin only)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The service ID (not config ID)
 *         example: 65d2c1e2f1a2b3c4d5e6f7a8
 *     responses:
 *       200:
 *         description: Service config deleted successfully
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
 *                   example: Service config deleted
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Service config not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
