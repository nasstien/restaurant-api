import pluralize from 'pluralize';
import { RequestHandler } from 'express';
import { Document, Model, PopulateOptions } from 'mongoose';
import { handleAsyncErrors, addSpaceBeforeBigLetter } from '@utils/utils';
import { sendSuccessResponse } from '@utils/responses';
import QueryHandler, { RequestObject } from '@utils/classes/QueryHandler';
import APIError from '@utils/classes/APIError';
import User from '@models/user';

export const getAll = <T extends Document>(Model: Model<T>, populateOptions?: PopulateOptions): RequestHandler => {
    return handleAsyncErrors(async (req, res, next) => {
        const features = new QueryHandler(Model.find(), req.query as RequestObject, req.params)
            .sort()
            .select()
            .paginate()
            .filter()
            .populate(populateOptions);
        const docs = await features.query;
        const modelName = pluralize.plural(addSpaceBeforeBigLetter(Model.modelName).toLowerCase());

        if (!docs || docs.length == 0) {
            return sendSuccessResponse(res, 200, undefined, `No ${modelName} found.`);
        }

        sendSuccessResponse(res, 200, docs);
    });
};

export const getOne = <T extends Document>(Model: Model<T>, populateOptions?: PopulateOptions): RequestHandler => {
    return handleAsyncErrors(async (req, res, next) => {
        let query = Model.findById(req.params.id);

        if (populateOptions) query && query.populate(populateOptions);

        const doc = await query;
        const modelName = addSpaceBeforeBigLetter(Model.modelName);

        if (!doc) {
            return next(new APIError(404, `${modelName} not found.`));
        }

        sendSuccessResponse(res, 200, doc);
    });
};

export const createOne = <T extends Document>(Model: Model<T>) => {
    return handleAsyncErrors(async (req, res, next) => {
        const doc = await Model.create(req.body);
        const modelName = addSpaceBeforeBigLetter(Model.modelName);
        const propName = pluralize.plural(modelName.toLowerCase());

        if (req.body.user) {
            const updateObj: any = {};
            updateObj[`$push`] = { [propName]: doc._id };
            await User.findByIdAndUpdate(req.body.user, updateObj);
        }

        sendSuccessResponse(res, 201, doc, `${modelName} has been successfully created.`);
    });
};

export const updateOne = <T extends Document>(Model: Model<T>) => {
    return handleAsyncErrors(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            runValidators: true,
            new: true,
        });
        const modelName = addSpaceBeforeBigLetter(Model.modelName);

        if (!doc) {
            return next(new APIError(404, `${modelName} not found.`));
        }

        sendSuccessResponse(res, 200, doc, `${modelName} has been successfully updated.`);
    });
};

export const deleteOne = <T extends Document>(Model: Model<T>) => {
    return handleAsyncErrors(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);
        const modelName = addSpaceBeforeBigLetter(Model.modelName);

        if (!doc) {
            return next(new APIError(404, `${modelName} not found.`));
        }

        sendSuccessResponse(res, 204, undefined, `${modelName} has been successfully deleted.`);
    });
};

export const search = <T extends Document>(Model: Model<T>, fields: string[]) => {
    return handleAsyncErrors(async (req, res, next) => {
        if (!req.query.q) {
            return next(new APIError(400, "You haven't specified search criteria."));
        }

        const modelName = pluralize.plural(addSpaceBeforeBigLetter(Model.modelName).toLowerCase());
        const matchFields = fields.map((field) => {
            return { [field]: { $regex: req.query.q, $options: 'i' } };
        });

        const docs = await Model.aggregate([{ $match: { $or: matchFields } }]);

        if (!docs || docs.length === 0) {
            return sendSuccessResponse(res, 200, undefined, `No ${modelName} found.`);
        }

        sendSuccessResponse(res, 200, docs);
    });
};
