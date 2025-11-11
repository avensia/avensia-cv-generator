import { getCloudflareContext } from '@opennextjs/cloudflare';

export function getCfEnv() {
  const { env } = getCloudflareContext();

  return env;
}

export function getDB() {
  return getCfEnv().cvs as D1Database; // or env.DB
}
