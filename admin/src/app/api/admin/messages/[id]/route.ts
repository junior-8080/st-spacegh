import { connectDB } from "@/lib/db";
import { handleError, isValidId, notFound, ok } from "@/lib/http";
import { messageUpdateSchema } from "@/lib/validators";
import { Message } from "@/models/Message";

export const runtime = "nodejs";

type Context = RouteContext<"/api/admin/messages/[id]">;

export async function PATCH(request: Request, { params }: Context) {
  try {
    const { id } = await params;
    if (!isValidId(id)) return notFound("Message");
    const { read } = messageUpdateSchema.parse(await request.json());
    await connectDB();
    const message = await Message.findByIdAndUpdate(id, { read }, { returnDocument: "after" });
    return message ? ok(message) : notFound("Message");
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  try {
    const { id } = await params;
    if (!isValidId(id)) return notFound("Message");
    await connectDB();
    const message = await Message.findByIdAndDelete(id);
    return message ? ok({ id }) : notFound("Message");
  } catch (error) {
    return handleError(error);
  }
}
