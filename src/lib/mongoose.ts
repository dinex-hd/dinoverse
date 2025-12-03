import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string | undefined;
const MONGODB_DB = process.env.MONGODB_DB as string | undefined; // optional database name

if (!MONGODB_URI) {
  // We do not throw here to avoid crashing during build; runtime will fail gracefully
  console.warn('MONGODB_URI is not set. API routes requiring DB will fail until configured.');
}

const globalWithMongoose = global as typeof global & {
  _mongooseConn?: Promise<typeof mongoose>;
};

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error('Missing MONGODB_URI environment variable');
  }

  const trimmedUri = MONGODB_URI.trim();
  if (!trimmedUri.startsWith('mongodb://') && !trimmedUri.startsWith('mongodb+srv://')) {
    throw new Error('Invalid MONGODB_URI scheme. It must start with "mongodb://" or "mongodb+srv://"');
  }

  if (!globalWithMongoose._mongooseConn) {
    globalWithMongoose._mongooseConn = mongoose
      .connect(trimmedUri, {
        bufferCommands: false,
        // If your URI does not include a database, you can set MONGODB_DB in env
        dbName: MONGODB_DB || undefined,
      })
      .then((m) => m);
  }

  return globalWithMongoose._mongooseConn;
}


