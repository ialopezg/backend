import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../..', '/.env') });

mongoose
  .connect(process.env.DATABASE_URI, {
    connectTimeoutMS: 0,
    socketTimeoutMS: 0,
  })
  .then(() => console.log('Database connected!'))
  .catch((error: any) => console.error(error));

const connection = mongoose.connection;

export { mongoose as db, connection };
