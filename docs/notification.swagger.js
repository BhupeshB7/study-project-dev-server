/**
 * @openapi
 * tags:
 *   - name: Notifications
 *     description: User notification management
 *
 * /api/notification:
 *   get:
 *     tags: [Notifications]
 *     summary: Get user notifications
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
 *         name: isRead
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User notifications with unread count
 *
 * /api/notification/unread-count:
 *   get:
 *     tags: [Notifications]
 *     summary: Get unread notification count
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Unread count
 *
 * /api/notification/{id}/read:
 *   patch:
 *     tags: [Notifications]
 *     summary: Mark notification as read
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
 *         description: Notification marked as read
 *
 * /api/notification/read-all:
 *   patch:
 *     tags: [Notifications]
 *     summary: Mark all notifications as read
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 *
 * /api/notification/{id}:
 *   delete:
 *     tags: [Notifications]
 *     summary: Delete a notification
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
 *         description: Notification deleted
 */
