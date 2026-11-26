import { ArrowRight, CheckCircle2, HardHat } from "lucide-react";
import Link from "next/link";
import { CTASection } from "@/components/CTASection";
import { FacilityCard } from "@/components/FacilityCard";
import { Hero } from "@/components/home/Hero";
import { Industries } from "@/components/home/Industries";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { JobCard } from "@/components/JobCard";
import { PhotoFrame } from "@/components/PhotoFrame";
import { PostCard } from "@/components/PostCard";
import { Reveal } from "@/components/Reveal";
import { ServiceCard } from "@/components/ServiceCard";
import { CircleBadge, Container, Ribbon, SectionHeading, buttonClass } from "@/components/ui";
import { getFacilities, getJobs, getPosts } from "@/lib/api";
import { services } from "@/lib/services";

export const revalidate = 60;

export default async function HomePage() {
  const [jobs, posts, facilities] = await Promise.all([getJobs(), getPosts({ limit: 3 }), getFacilities()]);
  const latestJobs = jobs.slice(0, 3);
  const showcase = facilities.slice(0, 6); // featured facilities come first from the API

  return (
    <>
      <Hero />

      <section className="bg-brand-offwhite py-20 sm:py-28" aria-labelledby="services-heading">
        <Container>
          <SectionHeading
            ribbon="Our services"
            title={<span id="services-heading">Complete solutions for your property</span>}
            description="One trusted partner for the maintenance, management, project support and hygiene of your facility."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <Reveal key={service.slug} delay={index * 80}>
                <ServiceCard service={service} index={index} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <Container className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative">
            <PhotoFrame
              icon={HardHat}
              alt="ST-SPACE supervisor inspecting a facility"
              className="aspect-[4/3] w-full"
            />
            <CircleBadge
              lines={["One partner.", "All solutions.", "Exceptional results."]}
              className="absolute -bottom-8 right-4 sm:-right-6"
            />
            <div aria-hidden className="absolute -left-3 -top-3 -z-0 h-20 w-20 border-l-2 border-t-2 border-brand-gold" />
          </Reveal>
          <Reveal delay={120}>
            <Ribbon>About ST-SPACE</Ribbon>
            <h2 className="mt-5 font-heading text-3xl font-extrabold uppercase leading-tight text-brand-black sm:text-4xl">
              Your trusted partner in <span className="highlight-gold">facilities management</span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-neutral-600">
              ST-SPACE helps organisations across Ghana keep their properties safe, efficient and productive. From our offices
              in Accra and Kumasi, we bring together skilled technicians, cleaners, project supervisors and pest control
              specialists under one accountable partner.
            </p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {["Planned preventive maintenance", "Fast, 24/7 response", "Trained, supervised teams", "Clear reporting"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm font-semibold text-brand-black">
                  <CheckCircle2 className="size-5 shrink-0 text-brand-gold-dark" aria-hidden /> {item}
                </li>
              ))}
            </ul>
            <Link href="/about" className={`${buttonClass("dark", "lg")} mt-10`}>
              More about us <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Reveal>
        </Container>
      </section>

      <WhyChooseUs />

      {showcase.length > 0 && (
        <section className="bg-white py-20 sm:py-28" aria-labelledby="facilities-heading">
          <Container>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading
                align="left"
                ribbon="Our facilities"
                title={
                  <span id="facilities-heading">
                    Facilities we <span className="highlight-gold">manage</span>
                  </span>
                }
                description="A selection of the offices, estates and commercial properties in our care."
              />
              <Link href="/facilities" className={buttonClass("outline-dark")}>
                View all facilities <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {showcase.map((facility, index) => (
                <Reveal key={facility.id} delay={(index % 3) * 80}>
                  <FacilityCard facility={facility} />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      <Industries />

      {latestJobs.length > 0 && (
        <section className="bg-white py-20 sm:py-28" aria-labelledby="jobs-heading">
          <Container>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading
                align="left"
                ribbon="Careers"
                title={<span id="jobs-heading">Join our team</span>}
                description="We're always looking for dedicated people who take pride in their work."
              />
              <Link href="/careers" className={buttonClass("outline-dark")}>
                View all careers <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {latestJobs.map((job, index) => (
                <Reveal key={job.id} delay={index * 80}>
                  <JobCard job={job} />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {posts.data.length > 0 && (
        <section className="bg-brand-offwhite py-20 sm:py-28" aria-labelledby="blog-heading">
          <Container>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading
                align="left"
                ribbon="Insights"
                title={
                  <span id="blog-heading">
                    Latest from the <span className="highlight-gold">blog</span>
                  </span>
                }
                description="Practical advice on maintenance, hygiene and getting the most from your property."
              />
              <Link href="/blog" className={buttonClass("outline-dark")}>
                View all articles <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.data.map((post, index) => (
                <Reveal key={post.id} delay={index * 80}>
                  <PostCard post={post} />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      <CTASection />
    </>
  );
}
