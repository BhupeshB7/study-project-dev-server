/**
 * @openapi
 * tags:
 *   - name: Export
 *     description: CSV data exports
 *
 * /api/export/service-requests:
 *   get:
 *     tags: [Export]
 *     summary: Export service requests as CSV
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: serviceId
 *         schema:
 *           type: string
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: CSV file download
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *
 * /api/export/queue-data:
 *   get:
 *     tags: [Export]
 *     summary: Export queue data as CSV
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
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: CSV file download
 *
 * /api/export/appointments:
 *   get:
 *     tags: [Export]
 *     summary: Export appointments as CSV
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
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: CSV file download
 *
 * /api/export/users:
 *   get:
 *     tags: [Export]
 *     summary: Export users as CSV (Admin only)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: CSV file download
 */
