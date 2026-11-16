export interface Entry {
  name: string;
  /** A role, or what was studied. */
  role?: string;
  dates: string;
  /** Shown in parentheses after the name on the resume, e.g. a YC batch. */
  note?: string;
  /** Resume bullet points. */
  highlights?: string[];
  /** Listed by name only, on the resume's "Previous" line. */
  previous?: boolean;
}

export const work: Entry[] = [
  {
    name: "Curbcut",
    role: "Lead Product Engineer",
    dates: "2026 – Now",
    highlights: [
      "Leading product for Curbcut Studio, a new SaaS platform giving planning teams self-serve access to hundreds of spatial indicators. Own the roadmap, design, prototyping, and system architecture, and manage one developer.",
      "Designed and built Studio from scratch: map exploration, an AI assistant that turns questions into maps, dashboards, and publishing, all bilingual with enterprise SSO.",
    ],
  },
  {
    name: "Upfront",
    role: "Founding Engineer",
    dates: "2024 – 2025",
    highlights: [
      "Built out MVP and scaled product to $100k monthly volume as company’s first hire.",
      "Laid foundation for dev team, implementing core architecture, auth, design system, CI pipeline, testing framework, and developer tooling.",
    ],
  },
  {
    name: "Floe",
    role: "Founder",
    dates: "2023 – 2024",
    highlights: [
      "Built an AI technical writing assistant for CI/CD, backed by District 3.",
    ],
  },
  {
    name: "Local Logic",
    role: "Lead Frontend Developer",
    dates: "2021 – 2023",
    highlights: [
      "Managed frontend team, led rebuild of flagship SDKs, and ran design sprints.",
    ],
  },
  {
    name: "Memberstack",
    note: "YC 2020",
    role: "Lead Frontend Developer",
    dates: "2020 – 2021",
    highlights: [
      "Worked closely with founders to redevelop frontend for Memberstack 2.0.",
    ],
  },
  {
    name: "Ada",
    role: "Founding Engineer",
    dates: "2016 – 2020",
    highlights: [
      "Defined frontend tech stack and built early versions of Ada’s dashboard, chat widget, embed script, iOS SDK, and more—now used by companies like Meta, Square, and Shopify, reaching 100M+ end-users.",
    ],
  },
  {
    name: "Trip Elephant",
    role: "Developer",
    dates: "2015 – 2016",
    previous: true,
  },
];

export const volunteer: Entry[] = [
  { name: "Santrovélo", role: "Bike Mechanic", dates: "2022 – Now" },
  {
    name: "Bike Sauce",
    role: "Bike Mechanic",
    dates: "2021 – 2022",
    previous: true,
  },
  { name: "Cycle Toronto", dates: "Various", previous: true },
  { name: "TIFF", dates: "Various", previous: true },
];

export const education: Entry[] = [
  { name: "OCAD", role: "Principles of Design", dates: "2015" },
  { name: "Bitmaker", role: "Web Development", dates: "2014" },
  {
    name: "Queen’s University",
    role: "B.Sc. Geological Engineering",
    dates: "2009 – 2013",
  },
];
