import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import hpp from 'hpp';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import authRouter from '@routes/auth';
import userRouter from '@routes/user';
import menuRouter from '@routes/menu-item';
import tableRouter from '@routes/table';
import APIError from '@utils/classes/APIError';
import { getAllReservations } from '@controllers/reservation';
import { getAllOrders } from '@controllers/order';
import { errorHandler } from '@middleware/error-handler';
import { sanitize, disableCache } from '@middleware/middleware';
import { protect, checkUserRole } from '@middleware/auth';

const app = express();

if (`${process.env.NODE_ENV}`.trim() === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json({ limit: '50kb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(helmet());
app.use(hpp());
app.use(sanitize());
app.use(disableCache());
app.use(
    cors({
        origin: [`${process.env.FRONTEND_URL}`],
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        credentials: true,
    }),
);
app.use(
    rateLimit({
        max: 100,
        windowMs: 60 * 60 * 1000,
        handler: (req, res, next) => {
            return next(new APIError(429, 'Too many requests from this IP, please try again later.'));
        },
    }),
);

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/menu', menuRouter);
app.use('/api/tables', tableRouter);
app.get('/api/reservations', protect, checkUserRole('employee', 'admin'), getAllReservations);
app.get('/api/orders', protect, checkUserRole('employee', 'admin'), getAllOrders);

app.use('*', (req, res, next) => {
    return next(new APIError(400, "The endpoint you're trying to access doesn't exist."));
});

app.use(errorHandler);

export default app;
