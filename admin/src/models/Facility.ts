import { Schema, model, models, type Model } from "mongoose";
import {
  FACILITY_STATUSES,
  FACILITY_TYPES,
  PRICE_PERIODS,
  type FacilityStatus,
  type FacilityType,
  type PricePeriod,
} from "@/lib/constants";
import { toJSONOptions } from "@/models/shared";

export interface IFacility {
  name: string;
  slug: string;
  type: FacilityType;
  location: string;
  summary: string;
  description: string;
  features: string[];
  /** Image paths/URLs; the first one is the cover image. */
  images: string[];
  price?: number | null;
  pricePeriod: PricePeriod;
  featured: boolean;
  status: FacilityStatus;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const FacilitySchema = new Schema<IFacility>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    type: { type: String, enum: FACILITY_TYPES, required: true },
    location: { type: String, required: true, trim: true },
    summary: { type: String, default: "", maxlength: 300 },
    description: { type: String, default: "" },
    features: { type: [String], default: [] },
    images: { type: [String], default: [] },
    price: { type: Number, default: null, min: 0 },
    pricePeriod: { type: String, enum: PRICE_PERIODS, default: "" },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: FACILITY_STATUSES, default: "draft", index: true },
    publishedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true, toJSON: toJSONOptions },
);

export const Facility: Model<IFacility> =
  (models.Facility as Model<IFacility>) ?? model<IFacility>("Facility", FacilitySchema);
