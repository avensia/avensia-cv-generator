// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { mkdir, writeFile, access } from 'fs/promises';
import { constants } from 'fs';
import path from 'path';
import crypto from 'crypto';

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  // (optional) validate mime types and size
  const allowed = new Set(['image/jpeg', 'image/png', 'image/webp']);
  if (!allowed.has(file.type)) {
    return NextResponse.json({ error: 'Unsupported image type' }, { status: 415 });
  }
  const MAX_BYTES = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File too large' }, { status: 413 });
  }

  // Read bytes and hash them
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const hash = crypto.createHash('sha256').update(buffer).digest('hex').slice(0, 32);

  // Pick an extension from mime (fallback to original)
  const ext = mimeToExt(file.type) ?? (path.extname(file.name) || '.bin');

  // Content-addressed filename
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadsDir, { recursive: true });
  const filename = `${hash}${ext}`;
  const filePath = path.join(uploadsDir, filename);

  // If the file already exists, skip writing
  try {
    await access(filePath, constants.F_OK);
    // exists -> do nothing
  } catch {
    await writeFile(filePath, buffer);
  }

  // Return the stable URL (same file -> same URL)
  return NextResponse.json({ url: `/uploads/${filename}`, hash });
}

function mimeToExt(mime: string): string | null {
  switch (mime) {
    case 'image/jpeg':
      return '.jpeg';
    case 'image/png':
      return '.png';
    case 'image/webp':
      return '.webp';
    default:
      return null;
  }
}
