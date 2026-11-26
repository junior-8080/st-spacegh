import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { ZodError, z } from "zod";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ data }, init);
}

export function fail(error: string, status: number, details?: unknown) {
  return NextResponse.json(details === undefined ? { error } : { error, details }, { status });
}

export function notFound(what = "Resource") {
  return fail(`${what} not found`, 404);
}

export function isValidId(id: string): boolean {
  return mongoose.isValidObjectId(id);
}

/** Maps known error types to the API's JSON error shape. */
export function handleError(error: unknown) {
  if (error instanceof ZodError) {
    return fail("Validation failed", 400, z.flattenError(error).fieldErrors);
  }
  if (error instanceof SyntaxError) {
    return fail("Invalid JSON body", 400);
  }
  if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
    return fail("An item with this slug already exists", 409);
  }
  console.error(error);
  return fail("Internal server error", 500);
}

export function paginate(searchParams: URLSearchParams, defaultLimit: number, maxLimit = 50) {
  const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const limit = Math.min(maxLimit, Math.max(1, Number.parseInt(searchParams.get("limit") ?? "", 10) || defaultLimit));
  return { page, limit, skip: (page - 1) * limit };
}

export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
