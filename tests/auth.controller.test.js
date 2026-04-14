import { jest } from '@jest/globals';
import supertest from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';

jest.unstable_mockModule('../services/user.service.js', () => ({
  loginUser: jest.fn(),
  sendRegisterOtp: jest.fn(),
  verifyOtpAndCreateUser: jest.fn(),
  logoutSession: jest.fn(),
  logoutAllSessions: jest.fn(),
  getUserSessions: jest.fn(),
  forgotPassword: jest.fn(),
  resetPassword: jest.fn(),
  createUserByInstitute: jest.fn(),
}));

const { loginUserController, registerUser } = await import('../controllers/user.controller.js');
const userService = await import('../services/user.service.js');

const app = express();
app.use(express.json());
app.use(cookieParser('test-secret'));

app.post('/api/user/register', registerUser);
app.post('/api/user/login', loginUserController);

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
});

describe('Authentication Controller Unit Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/user/register', () => {
        it('should return 200 and success message when OTP is sent', async () => {
            const mockResult = { email: 'test@example.com', expiresAt: new Date() };
            userService.sendRegisterOtp.mockResolvedValue(mockResult);

            const response = await supertest(app)
                .post('/api/user/register')
                .send({ fullName: 'John Doe', email: 'test@example.com' });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });
    });

    describe('POST /api/user/login', () => {
        it('should set cookie and return 200 on successful login', async () => {
            const mockLoginResult = {
                sessionId: 'user123:123456789',
                user: { id: 'user123', email: 'test@example.com', fullName: 'John Doe' }
            };
            userService.loginUser.mockResolvedValue(mockLoginResult);

            const response = await supertest(app)
                .post('/api/user/login')
                .send({ email: 'test@example.com', password: 'password123' });

            expect(response.status).toBe(200);
            expect(response.header['set-cookie']).toBeDefined();
        });

        it('should return 401 for invalid credentials', async () => {
            const error = new Error('Invalid email or password');
            error.statusCode = 401;
            userService.loginUser.mockRejectedValue(error);

            const response = await supertest(app)
                .post('/api/user/login')
                .send({ email: 'wrong@example.com', password: 'wrong' });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });
    });
});
