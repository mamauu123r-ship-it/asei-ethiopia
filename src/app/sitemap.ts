import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getNews, getPrograms, getProjects } from "@/lib/content";

const staticRoutes = [
  "",
  "/about",
  "/vision-mission",
  "/programs",
  "/projects",
  "/research",
  "/publications",
  "/news",
  "/partners",
  "/get-involved",
  "/contact",
  "/privacy-policy",
  "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [programs, projects, news] = await Promise.all([getPrograms(), getProjects(), getNews()]);
  return [
    ...staticRoutes.map((r) => ({ url: `${site.url}${r}` })),
    ...programs.map((p) => ({ url: `${site.url}/programs/${p.slug}` })),
    ...projects.map((p) => ({ url: `${site.url}/projects/${p.slug}` })),
    ...news.map((n) => ({ url: `${site.url}/news/${n.slug}`, lastModified: n.publishedAt })),
  ];
}
