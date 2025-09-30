import 'server-only';
import { MongoClient, Db, ServerApiVersion } from 'mongodb';

const uri = process.env.DB_URI!;
if (!uri) throw new Error('Mongo URI not found!');

const DB_NAME = 'avensia_cv_generator_db';

type MongoCache = {
  client: MongoClient | null;
  promise: Promise<MongoClient> | null;
  db: Db | null;
};

// attach to global in dev to avoid re-connecting on every HMR
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const cached: MongoCache = global._mongoCache ?? { client: null, promise: null, db: null };
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
if (!global._mongoCache) global._mongoCache = cached;

async function getClient(): Promise<MongoClient> {
  if (cached.client) return cached.client;
  if (!cached.promise) {
    cached.promise = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    }).connect();
  }
  cached.client = await cached.promise;
  return cached.client;
}

export async function getDB(): Promise<Db> {
  if (cached.db) return cached.db;
  const client = await getClient();
  cached.db = client.db(DB_NAME);
  return cached.db;
}

import type { Document } from 'mongodb'; // or 'mongoose' if using Mongoose

export async function getCollection<T extends Document = Document>(name: string) {
  const db = await getDB();
  return db.collection<T>(name);
}
