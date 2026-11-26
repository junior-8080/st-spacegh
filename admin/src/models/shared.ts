import type { ToObjectOptions } from "mongoose";

/** Exposes `id` instead of `_id` and drops `__v` when documents are sent as JSON. */
export const toJSONOptions: ToObjectOptions = {
  versionKey: false,
  transform: (_doc, ret: Record<string, unknown>) => {
    ret.id = String(ret._id);
    delete ret._id;
    return ret;
  },
};
