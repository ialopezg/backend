import mongoose from 'mongoose';

mongoose.connect('mongodb://user:password@localhost:27017/database', {
  connectTimeoutMS: 0,
  socketTimeoutMS: 0,
}).then(() => console.log('Database connected!'))
  .catch((error: any) => console.error(error));

export { mongoose as db };
