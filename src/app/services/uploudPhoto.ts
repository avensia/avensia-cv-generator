type DirectUploadResponse = {
  key: string;
  message?: string;
  // add other fields from your API if needed
};

class UploadError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'UploadError';
    this.status = status;
  }
}

export default async function uploadPhoto(file: File): Promise<string> {
  if (!file) {
    throw new UploadError('No file provided');
  }

  const body = new FormData();
  body.append('file', file);

  let res: Response;

  try {
    res = await fetch('/api/cloudflare/upload-photo', {
      method: 'POST',
      body,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    // Network / CORS / offline, etc.
    throw new UploadError('Network error while uploading image');
  }

  let data: DirectUploadResponse | unknown;

  // Try to parse JSON, but don’t blow up if it’s invalid
  try {
    data = await res.json();
  } catch {
    if (!res.ok) {
      // Non-OK & not JSON, try to give something meaningful
      const fallbackText = await res.text().catch(() => '');
      throw new UploadError(fallbackText || `Image upload failed with status ${res.status}`, res.status);
    }

    throw new UploadError('Upload succeeded but response was not valid JSON', res.status);
  }

  const json = data as Partial<DirectUploadResponse>;

  if (!res.ok) {
    const message = json.message || `Image upload failed with status ${res.status}`;
    throw new UploadError(message, res.status);
  }

  if (!json.key) {
    throw new UploadError('Upload response did not contain a file key', res.status);
  }

  return json.key;
}
