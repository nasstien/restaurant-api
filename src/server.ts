import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import app from './app';

dotenv.config({ path: path.resolve(__dirname, '..', 'config.env') });

const PORT = process.env.PORT || 5000;
const database = process.env.DATABASE_URI as string;

mongoose
    .connect(database)
    .then(() => {
        console.log('Mongoose successfully connected!');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}.`);
        });
    })
    .catch(console.error);
