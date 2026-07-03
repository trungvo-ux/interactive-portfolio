import { caseStudies } from "@/lib/case-studies";
import { boardingPass, identity } from "@/lib/passport";

export type PaletteSection = "navigate" | "contact" | "secrets";

export type PaletteActionContext = {
  openCase: (slug: string) => void;
  scrollToPassport: () => void;
  openPassport: () => void;
  copy: (text: string, toast: string) => void;
  scrollTop: () => void;
  toast: (message: string) => void;
  stamp: () => void;
  pulseAccent: () => void;
};

export type PaletteCommand = {
  id: string;
  label: string;
  keywords: string[];
  section: PaletteSection;
  hint?: string;
  run: (ctx: PaletteActionContext) => void;
};

const sectionOrder: PaletteSection[] = ["navigate", "contact", "secrets"];

export const sectionLabels: Record<PaletteSection, string> = {
  navigate: "Navigate",
  contact: "Contact",
  secrets: "Secrets",
};

export function buildCommands(): PaletteCommand[] {
  const navigate: PaletteCommand[] = [
    {
      id: "top",
      label: "Go to top",
      keywords: ["home", "scroll", "start"],
      section: "navigate",
      run: (ctx) => ctx.scrollTop(),
    },
    {
      id: "passport-scroll",
      label: "Scroll to passport",
      keywords: ["passport", "booklet", "identity"],
      section: "navigate",
      hint: identity.passportNo,
      run: (ctx) => ctx.scrollToPassport(),
    },
    {
      id: "passport-open",
      label: "Open passport",
      keywords: ["open", "stamp", "book"],
      section: "navigate",
      run: (ctx) => {
        ctx.scrollToPassport();
        ctx.openPassport();
      },
    },
    ...caseStudies.map(
      (study): PaletteCommand => ({
        id: `case-${study.slug}`,
        label: study.title,
        keywords: [
          study.slug,
          study.tag.toLowerCase(),
          study.year,
          "case",
          "work",
          "project",
        ],
        section: "navigate",
        hint: study.tag,
        run: (ctx) => ctx.openCase(study.slug),
      })
    ),
  ];

  const contact: PaletteCommand[] = [
    {
      id: "copy-email",
      label: "Copy email",
      keywords: ["email", "mail", "contact", "reach"],
      section: "contact",
      hint: identity.email,
      run: (ctx) => ctx.copy(identity.email, "Email copied."),
    },
    {
      id: "copy-linkedin",
      label: "Copy LinkedIn",
      keywords: ["linkedin", "social", "profile"],
      section: "contact",
      run: (ctx) => ctx.copy(identity.linkedin, "LinkedIn copied."),
    },
  ];

  const secrets: PaletteCommand[] = [
    {
      id: "whoami",
      label: "whoami",
      keywords: ["who", "identity", "id"],
      section: "secrets",
      run: (ctx) =>
        ctx.toast(`${identity.name} — ${identity.title} · ${identity.currentRole}`),
    },
    {
      id: "cat-mrz",
      label: "cat mrz",
      keywords: ["mrz", "machine", "readable", "strip"],
      section: "secrets",
      run: (ctx) => ctx.toast(identity.mrz),
    },
    {
      id: "flight-status",
      label: "flight status",
      keywords: ["boarding", "plane", "travel", "gate"],
      section: "secrets",
      run: (ctx) =>
        ctx.toast(
          `${boardingPass.carrier} ${boardingPass.flight}: ${boardingPass.from} → ${boardingPass.to} · Gate ${boardingPass.gate} · Seat ${boardingPass.seat}`
        ),
    },
    {
      id: "stamp",
      label: "stamp passport",
      keywords: ["ink", "rubber", "thud"],
      section: "secrets",
      run: (ctx) => ctx.stamp(),
    },
    {
      id: "sudo-hire",
      label: "sudo hire trung",
      keywords: ["sudo", "hire", "recruit", "offer"],
      section: "secrets",
      run: (ctx) =>
        ctx.toast("Permission granted. Offer letter routed to passport No. TV·0001·DSGN."),
    },
    {
      id: "make-pop",
      label: "make it pop",
      keywords: ["pop", "accent", "design", "system"],
      section: "secrets",
      run: (ctx) => {
        ctx.pulseAccent();
        ctx.toast("One accent. No exceptions. (--accent #0066cc)");
      },
    },
    {
      id: "help",
      label: "help",
      keywords: ["?", "commands", "list"],
      section: "secrets",
      run: (ctx) =>
        ctx.toast(
          "Navigate work, copy contact, or poke the secrets. You already found the console — that counts."
        ),
    },
  ];

  return [...navigate, ...contact, ...secrets];
}

export function filterCommands(
  commands: PaletteCommand[],
  query: string
): PaletteCommand[] {
  const q = query.trim().toLowerCase();
  if (!q) return commands;

  return commands.filter((cmd) => {
    const haystack = [cmd.label, cmd.hint ?? "", ...cmd.keywords]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q) || q.split(/\s+/).every((part) => haystack.includes(part));
  });
}

export function groupCommands(commands: PaletteCommand[]) {
  return sectionOrder
    .map((section) => ({
      section,
      label: sectionLabels[section],
      commands: commands.filter((cmd) => cmd.section === section),
    }))
    .filter((group) => group.commands.length > 0);
}
