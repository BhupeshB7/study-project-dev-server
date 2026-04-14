/**
 * @openapi
 * tags:
 *   - name: Documents
 *     description: Document upload and verification
 *
 * /api/document/auth:
 *   get:
 *     tags: [Documents]
 *     summary: Get ImageKit authentication parameters for client-side upload
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Auth parameters
 *
 * /api/document:
 *   post:
 *     tags: [Documents]
 *     summary: Upload document metadata (after client-side ImageKit upload)
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, type, fileUrl, fileId]
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [id_proof, address_proof, academic, photo, certificate, other]
 *               fileUrl:
 *                 type: string
 *               fileId:
 *                 type: string
 *               mimeType:
 *                 type: string
 *               fileSize:
 *                 type: number
 *               serviceRequestId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Document recorded
 *
 *   get:
 *     tags: [Documents]
 *     summary: List documents
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: serviceRequestId
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of documents
 *
 * /api/document/{id}:
 *   get:
 *     tags: [Documents]
 *     summary: Get document by ID
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
 *         description: Document details
 *
 *   delete:
 *     tags: [Documents]
 *     summary: Delete a document (Admin)
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
 *         description: Document deleted
 *
 * /api/document/{id}/verify:
 *   patch:
 *     tags: [Documents]
 *     summary: Verify or reject a document (Staff/Admin)
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
 *                 enum: [verify, reject]
 *               rejectionReason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Document verified/rejected
 */
