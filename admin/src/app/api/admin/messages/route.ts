import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { handleError, paginate } from "@/lib/http";
import { Message } from "@/models/Message";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { page, limit, skip } = paginate(request.nextUrl.searchParams, 20, 100);
    const [messages, total] = await Promise.all([
      Message.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Message.countDocuments(),
    ]);
    return NextResponse.json({ data: messages, total, page, totalPages: Math.max(1, Math.ceil(total / limit)) });
  } catch (error) {
    return handleError(error);
  }
}
