// Content shown only when Supabase is not configured yet (for local preview).
// The same programs are added to the database by supabase/03_starter_content.sql.
import type { ImpactStat, Program, SiteSettings } from "./types";

const programs: Program[] = [
  {
    slug: "solar-engineering-and-technology",
    title: "Solar Engineering and Technology",
    summary: "Design, installation and maintenance of reliable solar systems for homes, institutions and businesses.",
    description:
      "This program covers the technical work of bringing solar power to people: assessing energy needs, designing systems, and installing and maintaining them to good standards.\n\nWe work with institutions, businesses and communities to choose solutions that are affordable, safe and built to last.",
    focusAreas: ["Energy needs assessments", "Solar system design", "Installation quality and safety", "Operation and maintenance"],
    icon: "solar",
  },
  {
    slug: "renewable-energy-training",
    title: "Renewable Energy Training",
    summary: "Practical courses that build skilled solar technicians, engineers and energy professionals.",
    description:
      "Skilled people are needed to install, run and repair solar systems. This program offers practical training for students, technicians and professionals.\n\nCourses combine classroom learning with hands-on practice, so participants can apply their skills straight away.",
    focusAreas: ["Solar technician training", "Short courses for professionals", "Training of trainers", "Partnerships with universities and colleges"],
    icon: "training",
  },
  {
    slug: "solar-agriculture-and-water",
    title: "Solar Agriculture and Water",
    summary: "Solar-powered irrigation, water pumping and food processing for farming communities.",
    description:
      "Farming communities need reliable water and power. This program supports solar water pumping, irrigation and processing equipment that lowers fuel costs.\n\nWe help farmers and cooperatives choose suitable systems and learn to look after them.",
    focusAreas: ["Solar water pumping", "Solar irrigation", "Drinking water supply", "Solar food processing and cold storage"],
    icon: "water",
  },
  {
    slug: "research-and-innovation",
    title: "Research and Innovation",
    summary: "Applied research on solar performance, storage and technologies suited to African conditions.",
    description:
      "This program studies how solar technology performs in local conditions and how it can work better for the people who use it.\n\nWe share findings openly through our publications, so engineers, researchers and policymakers can use them.",
    focusAreas: ["System performance studies", "Energy storage", "Low-cost and local technologies", "Policy and market research"],
    icon: "research",
  },
  {
    slug: "community-energy-development",
    title: "Community Energy Development",
    summary: "Working with local communities to plan, own and sustain clean energy access.",
    description:
      "Energy projects last longest when communities help shape them. This program works with local leaders and residents to plan solar projects that meet real needs.\n\nWe support local ownership, fair management and the skills needed to keep systems running.",
    focusAreas: ["Community needs mapping", "Mini-grids and shared systems", "Local ownership models", "Productive use of energy"],
    icon: "community",
  },
  {
    slug: "solar-for-schools-and-healthcare",
    title: "Solar for Schools and Healthcare",
    summary: "Reliable power for classrooms, clinics and health centres that serve their communities.",
    description:
      "Schools need light and power for learning. Clinics need power for lighting, medical equipment and keeping vaccines cold.\n\nThis program helps schools and health facilities get dependable solar power and the support to maintain it.",
    focusAreas: ["Solar for schools", "Solar for health centres", "Vaccine and medicine cold chain", "Maintenance support"],
    icon: "health",
  },
];

const impact: ImpactStat[] = [
  { label: "Solar capacity supported", value: 0, unit: "kW" },
  { label: "Projects implemented", value: 0 },
  { label: "Institutions supported", value: 0 },
  { label: "People trained", value: 0 },
  { label: "Countries reached", value: 1 },
];

const settings: SiteSettings = {
  email: "[official email]",
  phone: "[telephone]",
  address: "Addis Ababa, Ethiopia",
  social: [],
  impactIsPilot: true,
};

export const starter = { programs, impact, settings };
