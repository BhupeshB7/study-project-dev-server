/**
 * @openapi
 * tags:
 *   - name: Service Requests
 *     description: Submit and manage service requests
 *
 * /api/service-request:
 *   post:
 *     tags: [Service Requests]
 *     summary: Submit a new service request
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [serviceId]
 *             properties:
 *               serviceId:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [low, normal, high, urgent]
 *     responses:
 *       201:
 *         description: Service request created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *
 *   get:
 *     tags: [Service Requests]
 *     summary: List service requests
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: serviceId
 *         schema:
 *           type: string
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of service requests
 *
 * /api/service-request/{id}:
 *   get:
 *     tags: [Service Requests]
 *     summary: Get a service request by ID
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service request details
 *       404:
 *         description: Not found
 *
 * /api/service-request/{id}/review:
 *   patch:
 *     tags: [Service Requests]
 *     summary: Review a service request (Staff/Admin)
 *     security:
 *       - cookieAuth: []
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
 *             type: object
 *             required: [action]
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [approve, reject, request_docs, in_progress, complete]
 *               remarks:
 *                 type: string
 *     responses:
 *       200:
 *         description: Request reviewed
 *
 * /api/service-request/{id}/cancel:
 *   patch:
 *     tags: [Service Requests]
 *     summary: Cancel own service request
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Request cancelled
 *
 * /api/service-request/{id}/remarks:
 *   post:
 *     tags: [Service Requests]
 *     summary: Add a remark to a service request
 *     security:
 *       - cookieAuth: []
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
 *             type: object
 *             required: [text]
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Remark added
 */
