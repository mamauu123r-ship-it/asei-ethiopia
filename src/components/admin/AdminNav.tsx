"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen, FolderKanban, Handshake, Image as ImageIcon, Inbox, LayoutDashboard,
  Layers, Mails, Newspaper, Settings, UserPlus, Users,
} from "lucide-react";
import type { Role } from "@/lib/auth";

const items: { href: string; label: string; Icon: typeof Inbox; roles?: Role[] }[] = [
  { href: "/admin/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/programs", label: "Programs", Icon: Layers, roles: ["super_admin", "editor"] },
  { href: "/admin/projects", label: "Projects", Icon: FolderKanban, roles: ["super_admin", "project_manager"] },
  { href: "/admin/news", label: "News", Icon: Newspaper, roles: ["super_admin", "editor"] },
  { href: "/admin/publications", label: "Publications", Icon: BookOpen, roles: ["super_admin", "editor"] },
  { href: "/admin/partners", label: "Partners", Icon: Handshake, roles: ["super_admin", "editor"] },
  { href: "/admin/inquiries", label: "Inquiries", Icon: Inbox, roles: ["super_admin", "project_manager"] },
  { href: "/admin/applications", label: "Volunteers", Icon: UserPlus, roles: ["super_admin"] },
  { href: "/admin/subscribers", label: "Subscribers", Icon: Mails, roles: ["super_admin"] },
  { href: "/admin/media", label: "Media", Icon: ImageIcon },
  { href: "/admin/users", label: "Users", Icon: Users, roles: ["super_admin"] },
  { href: "/admin/settings", label: "Settings", Icon: Settings, roles: ["super_admin"] },
];

export function AdminNav({ role }: { role: Role }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="flex flex-wrap gap-1 lg:flex-col">
      {items
        .filter((i) => !i.roles || i.roles.includes(role))
        .map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-11 items-center gap-2.5 rounded-lg px-3 text-[15px] font-semibold no-underline ${
                active ? "bg-sun text-ink" : "text-haze hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={18} aria-hidden="true" />
              {label}
            </Link>
          );
        })}
    </nav>
  );
}
