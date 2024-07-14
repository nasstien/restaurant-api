import { PipelineStage, Types } from 'mongoose';
import User from '@models/user';
import Payment from '@models/payment';
import Order from '@models/order';
import Reservation from '@models/reservation';
import Review from '@models/review';
import APIError from '@utils/classes/APIError';
import { sendSuccessResponse } from '@utils/responses';
import { handleAsyncErrors } from '@utils/utils';

export const getUserCountByRole = handleAsyncErrors(async (req, res, next) => {
    const pipeline: PipelineStage[] = [
        {
            $group: {
                _id: '$role',
                count: { $sum: 1 },
            },
        },
        { $sort: { count: -1 } },
        {
            $project: {
                _id: 0,
                count: 1,
                role: '$_id',
            },
        },
    ];
    const stats = await User.aggregate(pipeline);

    sendSuccessResponse(res, 200, stats);
});

export const getUserCountByActivity = handleAsyncErrors(async (req, res, next) => {
    const pipeline: PipelineStage[] = [
        {
            $facet: {
                activeUsers: [{ $match: { isActive: true } }, { $count: 'count' }],
                inactiveUsers: [{ $match: { isActive: false } }, { $count: 'count' }],
            },
        },
        {
            $project: {
                activeUsers: { $arrayElemAt: ['$activeUsers.count', 0] },
                inactiveUsers: { $arrayElemAt: ['$inactiveUsers.count', 0] },
            },
        },
    ];

    const stats = await User.aggregate(pipeline);
    sendSuccessResponse(res, 200, stats[0]);
});

export const getIncomePerMonth = handleAsyncErrors(async (req, res, next) => {
    const month = +req.params.month;
    const currYear = new Date().getFullYear();

    let startDate: Date;
    let endDate: Date;
    let pipeline: PipelineStage[] = [];

    if (req.params.month === 'all') {
        startDate = new Date(currYear, 0, 1);
        endDate = new Date(currYear + 1, 0, 1);

        pipeline = [
            {
                $match: {
                    createdAt: { $gte: startDate, $lt: endDate },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                    },
                    income: { $sum: '$totalAmount' },
                },
            },
            { $sort: { '_id.month': 1 } },
            {
                $project: {
                    _id: 0,
                    year: '$_id.year',
                    month: '$_id.month',
                    income: 1,
                },
            },
        ];
    } else if (isNaN(month) || month < 1 || month > 12) {
        return next(new APIError(400, 'Invalid month provided.'));
    } else {
        startDate = new Date(currYear, month - 1, 1);
        endDate = new Date(currYear, month, 1);

        pipeline = [
            {
                $match: {
                    createdAt: { $gte: startDate, $lt: endDate },
                },
            },
            {
                $group: {
                    _id: null,
                    totalIncome: { $sum: '$totalAmount' },
                },
            },
            { $addFields: { month } },
            {
                $project: {
                    _id: 0,
                    month: 1,
                    totalIncome: 1,
                },
            },
        ];
    }

    const stats = await Payment.aggregate(pipeline);
    sendSuccessResponse(res, 200, stats);
});

export const getTopSellingItems = handleAsyncErrors(async (req, res, next) => {
    const pipeline: PipelineStage[] = [
        { $unwind: '$menuItems' },
        {
            $group: {
                _id: '$menuItems.menuItem',
                salesCount: { $sum: 1 },
            },
        },
        {
            $lookup: {
                from: 'menuitems',
                localField: '_id',
                foreignField: '_id',
                as: 'menuItem',
            },
        },
        { $sort: { salesCount: -1 } },
        { $limit: 5 },
        {
            $project: {
                _id: 0,
                menuItem: { $arrayElemAt: ['$menuItem', 0] },
                salesCount: 1,
            },
        },
    ];

    const stats = await Order.aggregate(pipeline);
    sendSuccessResponse(res, 200, stats);
});

export const getMostReservedTables = handleAsyncErrors(async (req, res, next) => {
    const pipeline: PipelineStage[] = [
        {
            $group: {
                _id: '$table',
                reservationCount: { $sum: 1 },
            },
        },
        {
            $lookup: {
                from: 'tables',
                localField: '_id',
                foreignField: '_id',
                as: 'table',
            },
        },
        { $sort: { reservationsCount: -1 } },
        { $limit: 5 },
        {
            $project: {
                _id: 0,
                table: { $arrayElemAt: ['$table', 0] },
                reservationsCount: 1,
            },
        },
    ];

    const stats = await Reservation.aggregate(pipeline);
    sendSuccessResponse(res, 200, stats);
});

export const getReviewPercentage = handleAsyncErrors(async (req, res, next) => {
    const { itemId } = req.params;

    if (!itemId) {
        return next(new APIError(400, 'Menu item is not provided.'));
    } else if (!Types.ObjectId.isValid(itemId)) {
        return next(new APIError(400, 'Invalid ID provided.'));
    } else if ((await Review.findOne({ menuItem: itemId })) === null) {
        return next(new APIError(400, 'This menu item has no reviews yet.'));
    }

    const ratingThreshold = 3;
    const pipeline: PipelineStage[] = [
        {
            $match: {
                menuItem: new Types.ObjectId(itemId),
            },
        },
        {
            $facet: {
                totalReviewCount: [
                    {
                        $group: {
                            _id: null,
                            count: { $sum: 1 },
                        },
                    },
                    { $project: { _id: 0, count: 1 } },
                ],
                positiveReviewCount: [
                    {
                        $match: {
                            rating: { $gt: ratingThreshold },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            count: { $sum: 1 },
                        },
                    },
                    { $project: { _id: 0, count: 1 } },
                ],
            },
        },
        {
            $project: {
                totalReviewCount: { $arrayElemAt: ['$totalReviewCount.count', 0] },
                positiveReview: {
                    $round: [
                        {
                            $multiply: [
                                100,
                                {
                                    $divide: [
                                        { $arrayElemAt: ['$positiveReviewCount.count', 0] },
                                        { $arrayElemAt: ['$totalReviewCount.count', 0] },
                                    ],
                                },
                            ],
                        },
                        2,
                    ],
                },
                negativeReview: {
                    $round: [
                        {
                            $multiply: [
                                100,
                                {
                                    $divide: [
                                        {
                                            $subtract: [
                                                { $arrayElemAt: ['$totalReviewCount.count', 0] },
                                                { $arrayElemAt: ['$positiveReviewCount.count', 0] },
                                            ],
                                        },
                                        { $arrayElemAt: ['$totalReviewCount.count', 0] },
                                    ],
                                },
                            ],
                        },
                        2,
                    ],
                },
            },
        },
    ];

    const stats = await Review.aggregate(pipeline);
    sendSuccessResponse(res, 200, stats[0]);
});
