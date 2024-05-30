import { Document, Query, PopulateOptions, FilterQuery } from 'mongoose';

export interface RequestObject {
    [key: string]: string;
}

class QueryHandler<T extends Document> {
    public query: Query<T[], T>;
    private params: RequestObject;
    private queryString: RequestObject;

    constructor(query: Query<T[], T>, queryString: RequestObject, params: RequestObject) {
        this.query = query;
        this.queryString = queryString;
        this.params = params;
    }

    sort() {
        this.query = this.query.sort(this.queryString.sort ? this.queryString.sort : '-createdAt');
        return this;
    }

    select() {
        const fields = this.queryString.fields && this.queryString.fields.replace(',', ' ');
        this.query = this.query.select(fields ? fields : '-__v');
        return this;
    }

    paginate() {
        const page = +this.queryString.page || 1;
        const limit = +this.queryString.limit || 30;
        const skip = page * limit - limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }

    filter() {
        let filterObj: FilterQuery<T>;

        if (this.params.userId) {
            filterObj = { user: this.params.userId };
        } else if (this.params.itemId) {
            filterObj = { menuItem: this.params.itemId };
        } else {
            const queryObj = { ...this.queryString };
            const excluded = ['sort', 'fields', 'page', 'limit'];

            excluded.forEach((field) => delete queryObj[field]);

            const queryStr = JSON.stringify(queryObj).replace(/\b(gt|gte|lt|lte)\b/, (match) => `$${match}`);
            filterObj = JSON.parse(queryStr);
        }
        this.query = this.query.find(filterObj);
        return this;
    }

    populate(populateOptions: PopulateOptions | undefined) {
        if (populateOptions) this.query = this.query.populate(populateOptions) as Query<T[], T>;
        return this;
    }
}

export default QueryHandler;
