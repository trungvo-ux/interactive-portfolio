export type CaseStudySection = {
  heading: string;
  body: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  /** One-line description shown under the title on the detail hero. */
  blurb: string;
  /** Card thumbnail + detail hero image (shared element). */
  image: string;
  /** How the image sits inside the parchment card. */
  fit: "contain" | "cover-top";
  tag: string;
  year: string;
  role: string;
  /** Accent color of the tile behind the hero. */
  surface: "light" | "parchment";
  sections: CaseStudySection[];
};

// NOTE: narratives are realistic placeholders — Trung swaps in real copy later.
export const caseStudies: CaseStudy[] = [
  {
    slug: "watsonx-infrastructure-manager",
    title: "Infrastructure Manager",
    blurb:
      "A spatial canvas for watsonx.data — letting data teams see, connect, and reason about every engine, catalog, and storage bucket at a glance.",
    image: "/case-studies/img46.png",
    fit: "cover-top",
    tag: "IBM · watsonx.data",
    year: "2025",
    role: "Lead Product Designer",
    surface: "parchment",
    sections: [
      {
        heading: "The problem",
        body: "Enterprise data platforms sprawl. Engines, catalogs, and storage live in separate tables and dialogs, so understanding how a query actually resolves means holding a mental graph nobody can see. Onboarding took weeks and misconfigurations were silent until they broke production.",
      },
      {
        heading: "My role",
        body: "I led the end-to-end design of the Infrastructure Manager: the topology model, the node/edge visual language, the association flows, and the design-system primitives the team reused across watsonx.data.",
      },
      {
        heading: "The approach",
        body: "We reframed infrastructure as a living graph. Engines at the top, catalogs in the middle, storage and data sources below — with association lines that show, literally, what talks to what. Direct-manipulation editing replaced buried forms; a mini-map and zoom controls made the largest deployments navigable.",
      },
      {
        heading: "The outcome",
        body: "Time-to-first-association dropped dramatically and the graph became the shared mental model teams used to talk about their systems. The node language shipped as reusable components across the product.",
      },
    ],
  },
  {
    slug: "pillar-health",
    title: "Pillar",
    blurb:
      "Understanding you on a deeper level — turning at-home microbiome samples into clear, science-backed health guidance.",
    image: "/case-studies/img45.png",
    fit: "cover-top",
    tag: "Health · 0→1",
    year: "2025",
    role: "Product Designer",
    surface: "light",
    sections: [
      {
        heading: "The problem",
        body: "Gut-health results are dense lab PDFs most people can't act on. Pillar needed to translate microbiome data into something a person feels ownership over — not another confusing dashboard.",
      },
      {
        heading: "My role",
        body: "I designed the mobile experience end to end: the sample-to-insight flow, the health-score system, and the daily companion surface that keeps people engaged between tests.",
      },
      {
        heading: "The approach",
        body: "A single Health Score anchors the experience, backed by plain-language explanations and gentle trend lines. Upload, results, and an AI assistant form a three-step loop that always answers 'what do I do next?'",
      },
      {
        heading: "The outcome",
        body: "A warm, legible product that made a clinical domain feel personal — and a waitlist that converted on the strength of the first screen alone.",
      },
    ],
  },
  {
    slug: "zeme-leasing-os",
    title: "Zeme",
    blurb:
      "Save 10–12 hours a week — an AI-powered leasing OS that turns leads into signed leases automatically.",
    image: "/case-studies/img47.png",
    fit: "cover-top",
    tag: "PropTech · SaaS",
    year: "2024",
    role: "Product Designer",
    surface: "parchment",
    sections: [
      {
        heading: "The problem",
        body: "Property managers drown in leads across email, texts, and spreadsheets. Applications stall, follow-ups slip, and every hour on admin is an hour not spent closing.",
      },
      {
        heading: "My role",
        body: "I shaped the marketing story and the core CRM: the application pipeline, verification states, and the AI surfaces that quietly do the busywork.",
      },
      {
        heading: "The approach",
        body: "One table to rule the pipeline — applicants, status, and contact in a scannable grid, with AI drafting responses and flagging verified renters. The landing page mirrors the product's calm confidence.",
      },
      {
        heading: "The outcome",
        body: "A leasing workflow that feels like a teammate, not a tool — collapsing a multi-app routine into a single, trustworthy surface.",
      },
    ],
  },
  {
    slug: "expresso-network",
    title: "Expresso",
    blurb:
      "A warmer way to find your people — a student-and-alumni network for mentorship, built around real faces and real intent.",
    image: "/case-studies/img48.png",
    fit: "cover-top",
    tag: "Community · Mobile-web",
    year: "2024",
    role: "Product Designer",
    surface: "light",
    sections: [
      {
        heading: "The problem",
        body: "Campus networking tools feel like directories: cold lists, dead profiles, no reason to reach out. Students couldn't tell who was actually open to talk.",
      },
      {
        heading: "My role",
        body: "I designed the discovery experience — the browse grid, the filters that matter (major, interests, careers), and the profile cards that invite a first message.",
      },
      {
        heading: "The approach",
        body: "Big, human portraits over data rows. Each card leads with a face, a one-line intent ('Let's chat about…'), and shared interests — so reaching out feels natural instead of transactional.",
      },
      {
        heading: "The outcome",
        body: "A directory that reads like a community. Connection requests rose because the interface made openness visible.",
      },
    ],
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
