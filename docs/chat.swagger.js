/**
 * @openapi
 * tags:
 *   - name: Chat
 *     description: FAQ chatbot and knowledge base
 *
 * /api/chat/ask:
 *   post:
 *     tags: [Chat]
 *     summary: Ask a question to the chatbot
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [question]
 *             properties:
 *               question:
 *                 type: string
 *     responses:
 *       200:
 *         description: Chatbot response with matched answer and confidence
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
 *                     answer:
 *                       type: string
 *                     confidence:
 *                       type: integer
 *                     matchedQuestion:
 *                       type: string
 *                     category:
 *                       type: string
 *                     relatedFaqs:
 *                       type: array
 *                       items:
 *                         type: object
 *
 * /api/chat/categories:
 *   get:
 *     tags: [Chat]
 *     summary: List FAQ categories
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of FAQ categories
 *
 * /api/chat/categories/{category}:
 *   get:
 *     tags: [Chat]
 *     summary: List FAQs by category
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: FAQs in category
 *
 * /api/chat/faqs:
 *   get:
 *     tags: [Chat]
 *     summary: List all FAQs (Admin/Staff)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of FAQs
 *
 *   post:
 *     tags: [Chat]
 *     summary: Create a new FAQ (Admin/Staff)
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [question, answer, category, keywords]
 *             properties:
 *               question:
 *                 type: string
 *               answer:
 *                 type: string
 *               category:
 *                 type: string
 *               keywords:
 *                 type: array
 *                 items:
 *                   type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: FAQ created
 *
 * /api/chat/faqs/{id}:
 *   patch:
 *     tags: [Chat]
 *     summary: Update a FAQ (Admin/Staff)
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
 *               question:
 *                 type: string
 *               answer:
 *                 type: string
 *               category:
 *                 type: string
 *               keywords:
 *                 type: array
 *                 items:
 *                   type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: FAQ updated
 *
 *   delete:
 *     tags: [Chat]
 *     summary: Delete a FAQ (Admin/Staff)
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
 *         description: FAQ deleted
 */
