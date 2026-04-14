/**
 * @openapi
 * tags:
 *   - name: Workflow
 *     description: Workflow template and instance management
 *
 * /api/workflow/templates:
 *   post:
 *     tags: [Workflow]
 *     summary: Create a workflow template
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, serviceId, steps]
 *             properties:
 *               name:
 *                 type: string
 *               serviceId:
 *                 type: string
 *               description:
 *                 type: string
 *               steps:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     order:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     type:
 *                       type: string
 *                       enum: [approval, document_upload, review, notification, auto_assign, payment, queue_visit]
 *                     description:
 *                       type: string
 *                     isRequired:
 *                       type: boolean
 *     responses:
 *       201:
 *         description: Workflow template created
 *
 *   get:
 *     tags: [Workflow]
 *     summary: List workflow templates
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: serviceId
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of templates
 *
 * /api/workflow/templates/{id}:
 *   get:
 *     tags: [Workflow]
 *     summary: Get a workflow template
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
 *         description: Template details
 *
 *   patch:
 *     tags: [Workflow]
 *     summary: Update a workflow template
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *     responses:
 *       200:
 *         description: Template updated
 *
 *   delete:
 *     tags: [Workflow]
 *     summary: Delete a workflow template
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
 *         description: Template deleted
 *
 * /api/workflow/instances/{id}:
 *   get:
 *     tags: [Workflow]
 *     summary: Get a workflow instance
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
 *         description: Workflow instance details
 *
 * /api/workflow/instances/{id}/advance:
 *   patch:
 *     tags: [Workflow]
 *     summary: Advance workflow to next step
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               remarks:
 *                 type: string
 *     responses:
 *       200:
 *         description: Workflow advanced
 *
 * /api/workflow/instances/{id}/reject:
 *   patch:
 *     tags: [Workflow]
 *     summary: Reject current workflow step
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
 *             required: [reason]
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Step rejected
 */
