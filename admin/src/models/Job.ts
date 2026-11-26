import { Schema, model, models, type Model } from "mongoose";
import {
  COMPANY_EMAIL,
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVELS,
  JOB_LOCATIONS,
  JOB_STATUSES,
  type EmploymentType,
  type ExperienceLevel,
  type JobLocation,
  type JobStatus,
} from "@/lib/constants";
import { toJSONOptions } from "@/models/shared";

export interface IJob {
  title: string;
  slug: string;
  department: string;
  location: JobLocation;
  employmentType: EmploymentType;
  experienceLevel?: ExperienceLevel | "";
  salary?: string;
  summary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  applicationEmail: string;
  applicationWhatsapp?: string;
  applicationInstructions?: string;
  deadline?: Date | null;
  status: JobStatus;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    department: { type: String, required: true, trim: true },
    location: { type: String, enum: JOB_LOCATIONS, required: true },
    employmentType: { type: String, enum: EMPLOYMENT_TYPES, required: true },
    experienceLevel: { type: String, enum: [...EXPERIENCE_LEVELS, ""], default: "" },
    salary: { type: String, default: "" },
    summary: { type: String, required: true },
    description: { type: String, default: "" },
    responsibilities: { type: [String], default: [] },
    requirements: { type: [String], default: [] },
    benefits: { type: [String], default: [] },
    applicationEmail: { type: String, default: COMPANY_EMAIL },
    applicationWhatsapp: { type: String, default: "" },
    applicationInstructions: { type: String, default: "" },
    deadline: { type: Date, default: null },
    status: { type: String, enum: JOB_STATUSES, default: "draft", index: true },
    publishedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true, toJSON: toJSONOptions },
);

export const Job: Model<IJob> = (models.Job as Model<IJob>) ?? model<IJob>("Job", JobSchema);
