import type { NextRequest } from 'next/server';
import { getCfEnv } from '@/lib/database/d1db';
import getAuthUser from '@/lib/database/getAuthUser';

const jsonHeaders = {
  'Content-Type': 'application/json',
};

export async function POST(request: NextRequest) {
  // 1. Get env + bucket safely
  let R2_BUCKET: R2Bucket;

  try {
    const env = getCfEnv();
    R2_BUCKET = env.R2_BUCKET;
  } catch (err) {
    console.error('Failed to load Cloudflare env', err);
    return new Response(JSON.stringify({ error: 'Storage configuration error' }), {
      status: 500,
      headers: jsonHeaders,
    });
  }

  if (!R2_BUCKET) {
    console.error('R2_BUCKET is not configured');
    return new Response(JSON.stringify({ error: 'Storage is not configured' }), { status: 500, headers: jsonHeaders });
  }

  // 2. Parse form data
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch (err) {
    console.error('Failed to parse formData', err);
    return new Response(JSON.stringify({ error: 'Invalid form data' }), { status: 400, headers: jsonHeaders });
  }

  const file = formData.get('file');

  if (!(file instanceof File)) {
    return new Response(JSON.stringify({ error: 'No file provided' }), { status: 400, headers: jsonHeaders });
  }

  if (file.size === 0) {
    return new Response(JSON.stringify({ error: 'Empty file' }), { status: 400, headers: jsonHeaders });
  }

  // 3. Get authenticated user
  let user: Awaited<ReturnType<typeof getAuthUser>>;
  try {
    user = await getAuthUser();
  } catch (err) {
    console.error('Failed to get auth user', err);
    return new Response(JSON.stringify({ error: 'Authentication error' }), { status: 500, headers: jsonHeaders });
  }

  if (!user?.userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: jsonHeaders });
  }

  const key = `${user.userId}.jpg`; // adjust extension logic if needed

  // 4. Read file + store in R2
  let arrayBuffer: ArrayBuffer;
  try {
    arrayBuffer = await file.arrayBuffer();
  } catch (err) {
    console.error('Failed to read file buffer', err);
    return new Response(JSON.stringify({ error: 'Unable to read file' }), { status: 400, headers: jsonHeaders });
  }

  try {
    await R2_BUCKET.put(key, arrayBuffer, {
      httpMetadata: {
        contentType: file.type || 'image/jpeg',
      },
    });
  } catch (err) {
    console.error(`Failed to upload to R2 for key "${key}"`, err);
    return new Response(JSON.stringify({ error: 'Failed to store file' }), { status: 500, headers: jsonHeaders });
  }

  // 5. Success
  return new Response(JSON.stringify({ key }), { status: 200, headers: jsonHeaders });
}
