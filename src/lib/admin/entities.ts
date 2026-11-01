import type { Role } from "@/lib/auth";
import { PROJECT_STATUSES } from "@/lib/types";

// Describes each kind of content that administrators manage.
// The admin list pages, edit forms and save actions are all built from this.

export type FieldType =
  | "text"
  | "url"
  | "slug"
  | "textarea"
  | "markdown"
  | "select"
  | "date"
  | "datetime"
  | "number"
  | "int"
  | "tags"
  | "image"
  | "document";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  max?: number;
  hint?: string;
  options?: readonly string[] | { value: string; label: string }[];
  defaultValue?: string;
  wide?: boolean;
};

export type Entity = {
  key: string;
  table: string;
  label: string; // plural
  singular: string;
  roles: Role[];
  titleField: string;
  statusField: string;
  publishedValue: string;
  draftValue: string;
  orderBy: { column: string; ascending: boolean };
  listColumns: { name: string; label: string }[];
  fields: Field[];
  publicPath: (row: Record<string, unknown>) => string | null;
};

const pubStatus = (name: string): Field => ({
  name,
  label: "Visibility",
  type: "select",
  required: true,
  options: [
    { value: "draft", label: "Draft (hidden from the public)" },
    { value: "published", label: "Published (visible on the website)" },
  ],
  defaultValue: "draft",
});

const slugField: Field = {
  name: "slug",
  label: "Web address",
  type: "slug",
  max: 120,
  hint: "Lowercase words joined by hyphens, like solar-for-schools. Leave empty to create it from the title.",
};

export const entities: Record<string, Entity> = {
  programs: {
    key: "programs",
    table: "programs",
    label: "Programs",
    singular: "program",
    roles: ["super_admin", "editor"],
    titleField: "title",
    statusField: "status",
    publishedValue: "published",
    draftValue: "draft",
    orderBy: { column: "sort_order", ascending: true },
    listColumns: [
      { name: "title", label: "Title" },
      { name: "status", label: "Visibility" },
      { name: "updated_at", label: "Last updated" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, max: 160 },
      slugField,
      { name: "summary", label: "Short description", type: "textarea", required: true, max: 300, hint: "Shown on program cards. Up to 300 characters." },
      { name: "description", label: "Full description", type: "markdown", max: 20000, wide: true },
      { name: "focus_areas", label: "Focus areas", type: "tags", hint: "One per line." },
      {
        name: "icon",
        label: "Icon (used when there is no photo)",
        type: "select",
        required: true,
        defaultValue: "solar",
        options: [
          { value: "solar", label: "Sun" },
          { value: "training", label: "Graduation cap" },
          { value: "water", label: "Water drops" },
          { value: "research", label: "Laboratory flask" },
          { value: "community", label: "People" },
          { value: "health", label: "Heart" },
        ],
      },
      { name: "featured_image", label: "Photo", type: "image" },
      { name: "sort_order", label: "Order on the page", type: "int", defaultValue: "0", hint: "Lower numbers appear first." },
      pubStatus("status"),
    ],
    publicPath: (r) => `/programs/${r.slug}`,
  },

  projects: {
    key: "projects",
    table: "projects",
    label: "Projects",
    singular: "project",
    roles: ["super_admin", "project_manager"],
    titleField: "title",
    statusField: "publication_status",
    publishedValue: "published",
    draftValue: "draft",
    orderBy: { column: "created_at", ascending: false },
    listColumns: [
      { name: "title", label: "Title" },
      { name: "location", label: "Location" },
      { name: "project_status", label: "Project status" },
      { name: "publication_status", label: "Visibility" },
    ],
    fields: [
      { name: "title", label: "Project title", type: "text", required: true, max: 160 },
      slugField,
      { name: "country", label: "Country", type: "text", required: true, max: 80, defaultValue: "Ethiopia" },
      { name: "location", label: "Location (region, town or site)", type: "text", max: 160 },
      { name: "summary", label: "Short description", type: "textarea", max: 300, hint: "Shown on project cards." },
      { name: "description", label: "Project description", type: "markdown", max: 20000, wide: true },
      { name: "objectives", label: "Objectives", type: "markdown", max: 10000, wide: true, hint: "Use a list: start each line with - " },
      { name: "technical_info", label: "Technical information", type: "markdown", max: 10000, wide: true, hint: "For example: system size (kW), batteries, equipment." },
      { name: "start_date", label: "Start date", type: "date" },
      { name: "end_date", label: "End date", type: "date" },
      { name: "budget", label: "Budget (USD)", type: "number" },
      { name: "funding_status", label: "Funding status", type: "select", required: true, defaultValue: "Not funded", options: ["Not funded", "Partially funded", "Fully funded"] },
      { name: "project_status", label: "Project status", type: "select", required: true, defaultValue: "Proposed", options: PROJECT_STATUSES, hint: "Never mark a proposed project as completed." },
      { name: "featured_image", label: "Featured photo", type: "image" },
      pubStatus("publication_status"),
    ],
    publicPath: (r) => `/projects/${r.slug}`,
  },

  news: {
    key: "news",
    table: "news",
    label: "News",
    singular: "article",
    roles: ["super_admin", "editor"],
    titleField: "title",
    statusField: "publication_status",
    publishedValue: "published",
    draftValue: "draft",
    orderBy: { column: "published_at", ascending: false },
    listColumns: [
      { name: "title", label: "Title" },
      { name: "category", label: "Category" },
      { name: "published_at", label: "Publication date" },
      { name: "publication_status", label: "Visibility" },
    ],
    fields: [
      { name: "title", label: "Article title", type: "text", required: true, max: 200 },
      slugField,
      { name: "category", label: "Category", type: "select", required: true, defaultValue: "Announcement", options: ["Announcement", "Energy news", "Project update"] },
      { name: "excerpt", label: "Article description", type: "textarea", max: 400, hint: "A short summary shown in news lists." },
      { name: "content", label: "Article content", type: "markdown", max: 50000, wide: true },
      { name: "featured_image", label: "Featured image", type: "image" },
      { name: "published_at", label: "Publication date and time", type: "datetime", required: true, hint: "A future date keeps the article hidden until then." },
      pubStatus("publication_status"),
    ],
    publicPath: (r) => `/news/${r.slug}`,
  },

  publications: {
    key: "publications",
    table: "publications",
    label: "Publications",
    singular: "publication",
    roles: ["super_admin", "editor"],
    titleField: "title",
    statusField: "publication_status",
    publishedValue: "published",
    draftValue: "draft",
    orderBy: { column: "publication_date", ascending: false },
    listColumns: [
      { name: "title", label: "Title" },
      { name: "category", label: "Category" },
      { name: "publication_date", label: "Publication date" },
      { name: "publication_status", label: "Visibility" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, max: 200 },
      { name: "description", label: "Description", type: "textarea", max: 2000 },
      { name: "category", label: "Category", type: "select", required: true, defaultValue: "Research report", options: ["Technical publication", "Research report"] },
      { name: "document_url", label: "Document (PDF)", type: "document" },
      { name: "publication_date", label: "Publication date", type: "date", required: true },
      pubStatus("publication_status"),
    ],
    publicPath: () => "/publications",
  },

  partners: {
    key: "partners",
    table: "partners",
    label: "Partners",
    singular: "partner",
    roles: ["super_admin", "editor"],
    titleField: "organization_name",
    statusField: "display_status",
    publishedValue: "visible",
    draftValue: "hidden",
    orderBy: { column: "organization_name", ascending: true },
    listColumns: [
      { name: "organization_name", label: "Organization" },
      { name: "partner_type", label: "Type" },
      { name: "display_status", label: "Shown on website" },
    ],
    fields: [
      { name: "organization_name", label: "Organization name", type: "text", required: true, max: 160 },
      {
        name: "partner_type",
        label: "Partner type",
        type: "select",
        required: true,
        defaultValue: "Organization",
        options: ["University", "Government", "Renewable energy company", "Development organization", "Research institution", "Individual", "Organization"],
      },
      { name: "website", label: "Website", type: "url", max: 300 },
      { name: "logo_url", label: "Logo", type: "image" },
      { name: "description", label: "Description", type: "textarea", max: 2000 },
      {
        name: "display_status",
        label: "Show on website",
        type: "select",
        required: true,
        defaultValue: "hidden",
        options: [
          { value: "hidden", label: "Hidden" },
          { value: "visible", label: "Visible on the Partners page" },
        ],
        hint: "Only show partners after the agreement is confirmed.",
      },
    ],
    publicPath: () => "/partners",
  },
};

export function getEntity(key: string): Entity | undefined {
  return Object.prototype.hasOwnProperty.call(entities, key) ? entities[key] : undefined;
}

export function optionValues(f: Field): string[] {
  return (f.options ?? []).map((o) => (typeof o === "string" ? o : o.value));
}
