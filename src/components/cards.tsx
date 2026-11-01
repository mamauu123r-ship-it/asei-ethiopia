import Link from "next/link";
import Image from "next/image";
import {
  Droplets,
  FlaskConical,
  GraduationCap,
  HeartPulse,
  MapPin,
  Sun,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { NewsArticle, Program, ProgramIcon, Project, ProjectStatus } from "@/lib/types";
import { formatDate } from "@/lib/content";
import { TextLink } from "./ui";

const programStyle: Record<ProgramIcon, { Icon: LucideIcon; tile: string }> = {
  solar: { Icon: Sun, tile: "bg-sage text-leaf" },
  training: { Icon: GraduationCap, tile: "bg-sun-pale text-sun-dark" },
  water: { Icon: Droplets, tile: "bg-sky-pale text-sky-dark" },
  research: { Icon: FlaskConical, tile: "bg-iris-pale text-iris-dark" },
  community: { Icon: Users, tile: "bg-sage text-leaf" },
  health: { Icon: HeartPulse, tile: "bg-sun-pale text-sun-dark" },
};

export function ProgramVisual({ program, className = "h-40" }: { program: Program; className?: string }) {
  const { Icon, tile } = programStyle[program.icon];
  if (program.imageUrl) {
    return (
      <div className={`relative ${className}`}>
        <Image src={program.imageUrl} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
      </div>
    );
  }
  return (
    <div className={`flex items-center justify-center ${tile} ${className}`}>
      <Icon size={56} strokeWidth={1.6} aria-hidden="true" />
    </div>
  );
}

export function ProgramCard({ program }: { program: Program }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white">
      <ProgramVisual program={program} />
      <div className="flex flex-grow flex-col gap-2.5 p-6">
        <h3 className="font-display text-xl font-semibold text-ink">{program.title}</h3>
        <p className="flex-grow">{program.summary}</p>
        <TextLink href={`/programs/${program.slug}`}>Learn more</TextLink>
      </div>
    </article>
  );
}

const statusStyle: Record<ProjectStatus, string> = {
  Proposed: "bg-iris-pale text-iris-dark",
  "Seeking Funding": "bg-sun-pale text-sun-dark",
  "In Progress": "bg-sky-pale text-sky-dark",
  Completed: "bg-sage text-leaf",
  "On Hold": "bg-[#ECECEC] text-[#444]",
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span className={`self-start rounded-full px-2.5 py-1 text-[13px] font-bold ${statusStyle[status]}`}>
      {status}
    </span>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white">
      <div className="relative h-52 bg-[#E8EEEB]">
        {project.imageUrl && (
          <Image src={project.imageUrl} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        )}
      </div>
      <div className="flex flex-col gap-2.5 p-6">
        <StatusBadge status={project.status} />
        <h3 className="font-display text-xl font-semibold text-ink">{project.title}</h3>
        <span className="flex items-center gap-1.5 text-[15px] text-muted">
          <MapPin size={16} aria-hidden="true" />
          {project.country}, {project.location}
        </span>
        <p>{project.summary}</p>
        <TextLink href={`/projects/${project.slug}`}>View project</TextLink>
      </div>
    </article>
  );
}

export function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <article className="flex flex-col gap-2.5 rounded-2xl border border-line bg-white p-6">
      <span className="text-sm font-semibold text-leaf">
        {article.category}, {formatDate(article.publishedAt)}
      </span>
      <h3 className="font-display text-lg font-semibold text-ink">
        <Link href={`/news/${article.slug}`} className="text-ink no-underline hover:text-leaf">
          {article.title}
        </Link>
      </h3>
      <p>{article.excerpt}</p>
    </article>
  );
}
