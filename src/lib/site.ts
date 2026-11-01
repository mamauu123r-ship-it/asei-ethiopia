// Fixed organization details. Contact details and social links are edited
// in the admin dashboard (Settings) and read with getSettings().
export const site = {
  name: "Africa Solar Energy Initiative",
  shortName: "ASEI",
  slogan: "Powering Africa. Empowering Generations.",
  description:
    "Advancing sustainable energy through solar engineering, research, innovation, education, and community development.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};

export const mainNav = [
  { label: "About", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Projects", href: "/projects" },
  { label: "Research", href: "/research" },
  { label: "News", href: "/news" },
  { label: "Partners", href: "/partners" },
  { label: "Get Involved", href: "/get-involved" },
];

export const organizationLinks = [
  { label: "About ASEI", href: "/about" },
  { label: "Vision and Mission", href: "/vision-mission" },
  { label: "Projects", href: "/projects" },
  { label: "Research", href: "/research" },
  { label: "Publications", href: "/publications" },
  { label: "News", href: "/news" },
  { label: "Get Involved", href: "/get-involved" },
  { label: "Contact", href: "/contact" },
];
