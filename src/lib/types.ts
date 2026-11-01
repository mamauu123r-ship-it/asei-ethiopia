export type ProgramIcon = "solar" | "training" | "water" | "research" | "community" | "health";

export type Program = {
  slug: string;
  title: string;
  summary: string;
  description: string; // Markdown
  focusAreas: string[];
  icon: ProgramIcon;
  imageUrl?: string | null;
};

export const PROJECT_STATUSES = [
  "Proposed",
  "Seeking Funding",
  "In Progress",
  "Completed",
  "On Hold",
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export type Project = {
  slug: string;
  title: string;
  country: string;
  location: string;
  summary: string;
  description: string; // Markdown
  objectives: string; // Markdown
  technicalInfo: string; // Markdown
  status: ProjectStatus;
  fundingStatus: string;
  startDate?: string | null;
  endDate?: string | null;
  imageUrl?: string | null;
};

export type NewsCategory = "Announcement" | "Energy news" | "Project update";

export type NewsArticle = {
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown
  category: NewsCategory;
  publishedAt: string;
  imageUrl?: string | null;
};

export type Publication = {
  id: string;
  title: string;
  description: string;
  category: "Technical publication" | "Research report";
  publishedAt: string;
  documentUrl: string | null;
};

export type Partner = {
  name: string;
  type: string;
  website?: string | null;
  logoUrl?: string | null;
};

export type ImpactStat = { label: string; value: number; unit?: string | null };

export type SiteSettings = {
  email: string;
  phone: string;
  address: string;
  social: { label: string; href: string }[];
  impactIsPilot: boolean;
};
