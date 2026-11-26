import { randomUUID } from "node:crypto";
import { DeleteObjectsCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

type R2Config = { client: S3Client; bucket: string; publicUrl: string };

let config: R2Config | null = null;

/** Lazily creates the Cloudflare R2 client (R2 speaks the S3 API). */
function getR2(): R2Config {
  if (config) return config;
  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_URL } = process.env;
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME || !R2_PUBLIC_URL) {
    throw new Error(
      "Cloudflare R2 is not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME and R2_PUBLIC_URL in admin/.env.local.",
    );
  }
  config = {
    client: new S3Client({
      region: "auto",
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
    }),
    bucket: R2_BUCKET_NAME,
    publicUrl: R2_PUBLIC_URL.replace(/\/$/, ""),
  };
  return config;
}

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

/** Uploads an image under a random, immutable key and returns its public URL. */
export async function uploadImage(bytes: Uint8Array, contentType: string, folder = "facilities"): Promise<string> {
  const { client, bucket, publicUrl } = getR2();
  const key = `${folder}/${randomUUID()}.${EXTENSIONS[contentType] ?? "bin"}`;
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: bytes,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
  return `${publicUrl}/${key}`;
}

/** Returns the bucket key for a URL that points at our R2 bucket, or null for any other URL. */
export function r2KeyFromUrl(url: string): string | null {
  const publicUrl = process.env.R2_PUBLIC_URL?.replace(/\/$/, "");
  if (!publicUrl || !url.startsWith(`${publicUrl}/`)) return null;
  return decodeURIComponent(url.slice(publicUrl.length + 1));
}

/** Deletes the given R2 images (URLs outside our bucket are ignored). */
export async function deleteImages(urls: string[]): Promise<void> {
  const keys = urls.map(r2KeyFromUrl).filter((key): key is string => Boolean(key));
  if (!keys.length) return;
  const { client, bucket } = getR2();
  await client.send(new DeleteObjectsCommand({ Bucket: bucket, Delete: { Objects: keys.map((Key) => ({ Key })) } }));
}
