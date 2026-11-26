import { Schema, model, models, type Model } from "mongoose";
import { DEFAULT_AUTHOR, POST_CATEGORIES, POST_STATUSES, type PostCategory, type PostStatus } from "@/lib/constants";
import { toJSONOptions } from "@/models/shared";

export interface IPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: PostCategory;
  tags: string[];
  author: string;
  status: PostStatus;
  publishedAt?: Date | null;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    excerpt: { type: String, default: "", maxlength: 300 },
    content: { type: String, required: true },
    coverImage: { type: String, default: "" },
    category: { type: String, enum: POST_CATEGORIES, required: true },
    tags: { type: [String], default: [] },
    author: { type: String, default: DEFAULT_AUTHOR },
    status: { type: String, enum: POST_STATUSES, default: "draft", index: true },
    publishedAt: { type: Date, default: null, index: true },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
  },
  { timestamps: true, toJSON: toJSONOptions },
);

export const Post: Model<IPost> = (models.Post as Model<IPost>) ?? model<IPost>("Post", PostSchema);
