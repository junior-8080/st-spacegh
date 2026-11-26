import type { MetadataRoute } from "next";
import { getAllPosts, getFacilities, getJobs } from "@/lib/api";
import { services } from "@/lib/services";
import { siteUrl } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, jobs, facilities] = await Promise.all([getAllPosts(), getJobs(), getFacilities()]);

  const staticPages: MetadataRoute.Sitemap = ["", "/about", "/services", "/facilities", "/careers", "/blog", "/contact"].map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: path === "/blog" || path === "/careers" ? "daily" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));

  return [
    ...staticPages,
    ...services.map((service) => ({
      url: `${siteUrl}/services/${service.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...facilities.map((facility) => ({
      url: `${siteUrl}/facilities/${facility.slug}`,
      lastModified: facility.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...jobs.map((job) => ({
      url: `${siteUrl}/careers/${job.slug}`,
      lastModified: job.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
