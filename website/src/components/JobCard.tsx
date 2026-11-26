import { ArrowRight, Briefcase, CalendarClock, MapPin } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { JobSummary } from "@/types";

export function JobCard({ job }: { job: JobSummary }) {
  return (
    <article className="group relative flex h-full flex-col border border-neutral-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-brand-gold hover:shadow-xl sm:p-7">
      <span aria-hidden className="absolute left-0 top-0 h-full w-1 origin-top scale-y-0 bg-gold-gradient transition duration-500 group-hover:scale-y-100" />
      <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-brand-gold-ink">{job.department}</p>
      <h3 className="mt-2 font-heading text-xl font-extrabold leading-snug text-brand-black">
        <Link href={`/careers/${job.slug}`} className="after:absolute after:inset-0">
          {job.title}
        </Link>
      </h3>
      <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-neutral-600">{job.summary}</p>
      <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-neutral-700">
        <li className="flex items-center gap-1.5">
          <MapPin className="size-4 text-brand-gold-dark" aria-hidden /> {job.location}
        </li>
        <li className="flex items-center gap-1.5">
          <Briefcase className="size-4 text-brand-gold-dark" aria-hidden /> {job.employmentType}
        </li>
        {job.deadline && (
          <li className="flex items-center gap-1.5">
            <CalendarClock className="size-4 text-brand-gold-dark" aria-hidden /> Closes {formatDate(job.deadline)}
          </li>
        )}
      </ul>
      <span className="mt-6 inline-flex items-center gap-2 border-t border-neutral-100 pt-5 font-heading text-xs font-bold uppercase tracking-wider text-brand-black">
        View & Apply <ArrowRight className="size-4 text-brand-gold-dark transition group-hover:translate-x-1" aria-hidden />
      </span>
    </article>
  );
}
