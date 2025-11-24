import type { NextRequest } from 'next/server';
import { getCfEnv } from '@/lib/database/d1db';

type RouteParams = {
  key: string;
};

type RouteContext = {
  params: Promise<RouteParams>;
};

export async function GET(_req: NextRequest, context: RouteContext) {
  // OpenNext on Cloudflare makes `params` a Promise, so we must await it
  const { key } = await context.params;

  if (!key) {
    return new Response('Missing key parameter', { status: 400 });
  }

  let R2_BUCKET: unknown;

  try {
    const env = getCfEnv();
    R2_BUCKET = (env as { R2_BUCKET?: unknown }).R2_BUCKET;

    if (!R2_BUCKET) {
      console.error('R2_BUCKET is not configured');
      return new Response('Storage configuration error', { status: 500 });
    }
  } catch (err) {
    console.error('Failed to get Cloudflare env', err);
    return new Response('Internal configuration error', { status: 500 });
  }

  // Narrow R2 bucket type just enough for `.get`
  const bucket = R2_BUCKET as {
    get: (key: string) => Promise<{
      body: ReadableStream | null;
      httpMetadata?: { contentType?: string };
    } | null>;
  };

  try {
    const object = await bucket.get(key);

    if (!object) {
      return new Response('Not found', { status: 404 });
    }

    const contentType = object.httpMetadata?.contentType ?? 'application/octet-stream';

    return new Response(object.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    });
  } catch (err) {
    console.error(`Error fetching object from R2 for key "${key}"`, err);
    return new Response('Failed to fetch object', { status: 500 });
  }
}
