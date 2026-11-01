// All public pages read content through these functions.
// When Supabase is configured they read from the database (published content only).
// Without Supabase settings they show the built-in starter content, so the site
// still runs on your computer before the database is set up.

import { cache } from "react";
import { supabaseConfigured } from "./env";
import { createPublicClient } from "./supabase/public";
import { starter } from "./starter";
import type {
  ImpactStat,
  NewsArticle,
  Partner,
  Program,
  Project,
  ProjectStatus,
  Publication,
  SiteSettings,
} from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */
const toProgram = (r: any): Program => ({
  slug: r.slug,
  title: r.title,
  summary: r.summary,
  description: r.description,
  focusAreas: r.focus_areas ?? [],
  icon: r.icon,
  imageUrl: r.featured_image,
});

const toProject = (r: any): Project => ({
  slug: r.slug,
  title: r.title,
  country: r.country,
  location: r.location,
  summary: r.summary,
  description: r.description,
  objectives: r.objectives,
  technicalInfo: r.technical_info,
  status: r.project_status as ProjectStatus,
  fundingStatus: r.funding_status,
  startDate: r.start_date,
  endDate: r.end_date,
  imageUrl: r.featured_image,
});

const toArticle = (r: any): NewsArticle => ({
  slug: r.slug,
  title: r.title,
  excerpt: r.excerpt,
  content: r.content,
  category: r.category,
  publishedAt: r.published_at,
  imageUrl: r.featured_image,
});

function logError(where: string, error: { message: string } | null) {
  if (error) console.error(`[content] ${where}:`, error.message);
}

export const getPrograms = cache(async (): Promise<Program[]> => {
  if (!supabaseConfigured) return starter.programs;
  const { data, error } = await createPublicClient()
    .from("programs")
    .select("*")
    .eq("status", "published")
    .order("sort_order");
  logError("programs", error);
  return (data ?? []).map(toProgram);
});

export async function getProgram(slug: string): Promise<Program | undefined> {
  return (await getPrograms()).find((p) => p.slug === slug);
}

export const getProjects = cache(async (): Promise<Project[]> => {
  if (!supabaseConfigured) return [];
  const { data, error } = await createPublicClient()
    .from("projects")
    .select("*")
    .eq("publication_status", "published")
    .order("created_at", { ascending: false });
  logError("projects", error);
  return (data ?? []).map(toProject);
});

export async function getProject(slug: string): Promise<Project | undefined> {
  return (await getProjects()).find((p) => p.slug === slug);
}

export const getNews = cache(async (): Promise<NewsArticle[]> => {
  if (!supabaseConfigured) return [];
  const { data, error } = await createPublicClient()
    .from("news")
    .select("*")
    .eq("publication_status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });
  logError("news", error);
  return (data ?? []).map(toArticle);
});

export async function getArticle(slug: string): Promise<NewsArticle | undefined> {
  return (await getNews()).find((n) => n.slug === slug);
}

export const getPublications = cache(async (): Promise<Publication[]> => {
  if (!supabaseConfigured) return [];
  const { data, error } = await createPublicClient()
    .from("publications")
    .select("*")
    .eq("publication_status", "published")
    .order("publication_date", { ascending: false });
  logError("publications", error);
  return (data ?? []).map((r: any) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    category: r.category,
    publishedAt: r.publication_date,
    documentUrl: r.document_url,
  }));
});

export const getPartners = cache(async (): Promise<Partner[]> => {
  if (!supabaseConfigured) return [];
  const { data, error } = await createPublicClient()
    .from("partners")
    .select("*")
    .eq("display_status", "visible")
    .order("organization_name");
  logError("partners", error);
  return (data ?? []).map((r: any) => ({
    name: r.organization_name,
    type: r.partner_type,
    website: r.website,
    logoUrl: r.logo_url,
  }));
});

export const getImpact = cache(async (): Promise<ImpactStat[]> => {
  if (!supabaseConfigured) return starter.impact;
  const { data, error } = await createPublicClient()
    .from("impact_stats")
    .select("label, value, unit")
    .order("sort_order");
  logError("impact", error);
  return (data ?? []).map((r: any) => ({ label: r.label, value: Number(r.value), unit: r.unit }));
});

export const getSettings = cache(async (): Promise<SiteSettings> => {
  if (!supabaseConfigured) return starter.settings;
  const { data, error } = await createPublicClient()
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  logError("settings", error);
  if (!data) return starter.settings;
  return {
    email: data.official_email || starter.settings.email,
    phone: data.telephone || starter.settings.phone,
    address: data.address || starter.settings.address,
    social: Array.isArray(data.social_links) ? data.social_links : [],
    impactIsPilot: Boolean(data.impact_is_pilot),
  };
});

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
