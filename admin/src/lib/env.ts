/** Public website URL, inlined at build time so client components can link to it. */
export const WEBSITE_URL = (process.env.NEXT_PUBLIC_WEBSITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
