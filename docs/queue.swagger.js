/**
 * @openapi
 * tags:
 *   - name: Queue
 *     description: Queue tickets, counters, and appointments
 *
 * /api/queue/tickets:
 *   post:
 *     tags: [Queue]
 *     summary: Join a service queue
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
 *     responses:
 *       201:
 *         description: Queue ticket issued
 *
 * /api/queue/tickets/my:
 *   get:
 *     tags: [Queue]
 *     summary: Get my queue tickets
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User's tickets
 *
 * /api/queue/tickets/{id}/cancel:
 *   patch:
 *     tags: [Queue]
 *     summary: Cancel a queue ticket
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
 *         description: Ticket cancelled
 *
 * /api/queue/status/{serviceId}:
 *   get:
 *     tags: [Queue]
 *     summary: Get queue status for a service
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Queue status
 *
 * /api/queue/counters/{counterId}/call-next:
 *   post:
 *     tags: [Queue]
 *     summary: Call next ticket at counter (Staff/Admin)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: counterId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Next ticket called
 *
 * /api/queue/counters:
 *   get:
 *     tags: [Queue]
 *     summary: List counters
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
 *         description: List of counters
 *
 *   post:
 *     tags: [Queue]
 *     summary: Create a counter (Staff/Admin)
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, serviceId]
 *             properties:
 *               name:
 *                 type: string
 *               serviceId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Counter created
 *
 * /api/queue/counters/{id}/status:
 *   patch:
 *     tags: [Queue]
 *     summary: Update counter status
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
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [open, closed, break]
 *     responses:
 *       200:
 *         description: Counter status updated
 *
 * /api/queue/appointments:
 *   post:
 *     tags: [Queue]
 *     summary: Create an appointment
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [serviceId, date, timeSlot]
 *             properties:
 *               serviceId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               timeSlot:
 *                 type: object
 *                 properties:
 *                   start:
 *                     type: string
 *                   end:
 *                     type: string
 *               purpose:
 *                 type: string
 *     responses:
 *       201:
 *         description: Appointment created
 *
 *   get:
 *     tags: [Queue]
 *     summary: List appointments
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
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of appointments
 *
 * /api/queue/appointments/{id}/status:
 *   patch:
 *     tags: [Queue]
 *     summary: Update appointment status (Staff/Admin)
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
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [confirmed, checked_in, completed, no_show]
 *               remarks:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated
 *
 * /api/queue/appointments/{id}/cancel:
 *   patch:
 *     tags: [Queue]
 *     summary: Cancel an appointment
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
 *         description: Appointment cancelled
 */
