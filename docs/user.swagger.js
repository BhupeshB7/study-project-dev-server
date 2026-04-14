/**
 * @openapi
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - fullName
 *         - email
 *       properties:
 *         fullName:
 *           type: string
 *           minLength: 3
 *           maxLength: 100
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: johndoe@example.com
 *
 *     RegisterResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: OTP sent successfully
 *         data:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               example: johndoe@example.com
 *             expiresAt:
 *               type: string
 *               format: date-time
 *               example: 2026-02-19T12:34:56.000Z
 *
 *     CreateUserRequest:
 *       type: object
 *       required:
 *         - fullName
 *         - email
 *         - mobile
 *         - role
 *       properties:
 *         fullName:
 *           type: string
 *           minLength: 3
 *           maxLength: 100
 *           example: Jane Smith
 *         email:
 *           type: string
 *           format: email
 *           example: janesmith@example.com
 *         mobile:
 *           type: string
 *           pattern: '^\+?[1-9]\d{9,14}$'
 *           example: '+919876543210'
 *         role:
 *           type: string
 *           enum:
 *             - admin
 *             - staff
 *             - student
 *           example: staff
 *
 *     CreateUserResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: User created successfully and email sent
 *         data:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: 65d2c1e2f1a2b3c4d5e6f7a8
 *             email:
 *               type: string
 *               example: janesmith@example.com
 *             role:
 *               type: string
 *               example: staff
 *
 *     VerifyOtpRequest:
 *       type: object
 *       required:
 *         - fullName
 *         - email
 *         - password
 *         - mobile
 *         - otp
 *       properties:
 *         fullName:
 *           type: string
 *           minLength: 3
 *           maxLength: 100
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: johndoe@example.com
 *         password:
 *           type: string
 *           minLength: 8
 *           maxLength: 32
 *           example: mySecret123
 *         mobile:
 *           type: string
 *           pattern: '^\\+?[1-9]\\d{9,14}$'
 *           example: '+919876543210'
 *         otp:
 *           type: string
 *           pattern: '^\\d{6}$'
 *           example: '123456'
 *
 *     VerifyOtpResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Account created successfully
 *         data:
 *           type: object
 *           properties:
 *             userId:
 *               type: string
 *               example: 65d2c1e2f1a2b3c4d5e6f7a8
 *             email:
 *               type: string
 *               example: johndoe@example.com
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Error message
 *         error:
 *           type: string
 *           example: ERROR_CODE
 */

/**
 * @openapi
 * /api/user/register:
 *   post:
 *     tags:
 *       - User
 *     summary: Send OTP for user registration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       409:
 *         description: Account already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       429:
 *         description: Too many OTP requests
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
 * /api/user/create:
 *   post:
 *     tags:
 *       - User
 *     summary: Create user by institute (admin/staff only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         description: User created successfully and email sent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateUserResponse'
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
 * /api/user/health:
 *   get:
 *     tags:
 *       - User
 *     summary: Health check for user route
 *     responses:
 *       200:
 *         description: User route is working
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
 *                   example: User route is working!
 */

/**
 * @openapi
 * /api/user/verify-otp:
 *   post:
 *     tags:
 *       - User
 *     summary: Verify OTP and create user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyOtpRequest'
 *     responses:
 *       201:
 *         description: Account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerifyOtpResponse'
 *       400:
 *         description: Invalid or expired OTP / Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: OTP not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Account already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/user/login:
 *   post:
 *     tags:
 *       - User
 *     summary: Login user and create a session (max 2 devices)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: mySecret123
 *     responses:
 *       200:
 *         description: Login successful
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
 *                   example: Login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: 65d2c1e2f1a2b3c4d5e6f7a8
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *       400:
 *         description: Invalid input or credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/user/logout:
 *   post:
 *     tags:
 *       - User
 *     summary: Logout from current device
 *     responses:
 *       200:
 *         description: Logout successful
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
 *                   example: Logout successful
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/user/logout-all:
 *   post:
 *     tags:
 *       - User
 *     summary: Logout from all devices (clear all sessions)
 *     responses:
 *       200:
 *         description: Logged out from all devices
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
 *                   example: Logged out from all devices
 *       401:
 *         description: Unauthorized or session not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/user/forgot-password:
 *   post:
 *     tags:
 *       - User
 *     summary: Request password reset link
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *     responses:
 *       200:
 *         description: If email exists, reset link sent
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
 *                   example: Password reset link sent to your email
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/user/reset-password:
 *   post:
 *     tags:
 *       - User
 *     summary: Reset password using token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *                 example: abc123token
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: newPassword123
 *     responses:
 *       200:
 *         description: Password reset successful
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
 *                   example: Password reset successful
 *       400:
 *         description: Invalid or expired token / Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/user/profile:
 *   get:
 *     tags:
 *       - User
 *     summary: Get current user profile
 *     responses:
 *       200:
 *         description: User profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 65d2c1e2f1a2b3c4d5e6f7a8
 *                     fullName:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *                     mobile:
 *                       type: string
 *                       example: '+919876543210'
 *                     profileImageUrl:
 *                       type: string
 *                       example: https://example.com/profile.jpg
 *                     role:
 *                       type: string
 *                       example: student
 *                     status:
 *                       type: string
 *                       example: active
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2026-02-19T12:34:56.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2026-02-19T12:34:56.000Z
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/user/sessions:
 *   get:
 *     tags:
 *       - User
 *     summary: Get all active sessions for current user
 *     responses:
 *       200:
 *         description: List of active sessions
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
 *                     type: object
 *                     properties:
 *                       sessionId:
 *                         type: string
 *                         example: sess_123456
 *                       deviceName:
 *                         type: string
 *                         example: Chrome on Windows
 *                       deviceType:
 *                         type: string
 *                         example: desktop
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2026-02-19T12:34:56.000Z
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
