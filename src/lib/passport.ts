export type StampInk = "purple" | "blue" | "red" | "green";

export type Stamp = {
  /** Big label inside the stamp. */
  label: string;
  /** Small arced/secondary text. */
  sub: string;
  /** e.g. a year or short code shown like an entry date. */
  code: string;
  ink: StampInk;
  /** Degrees of rotation for a hand-stamped feel. */
  rotate: number;
  /** Stamp silhouette. */
  shape: "oval" | "rect" | "rounded" | "circle";
};

export type StampBrand = Stamp & {
  brand: "IBM" | "ZEME" | "SUNCOAST";
};

export type Identity = {
  name: string;
  title: string;
  birthDate: string;
  school: string;
  university: string;
  location: string;
  currentRole: string;
  nationality: string;
  issuedBy: string;
  issued: string;
  expires: string;
  passportNo: string;
  /** Path under /public, or null → initials placeholder. */
  photo: string | null;
  signature: string;
  description: string[];
  linkedin: string;
  email: string;
  /** Machine-readable strip at the foot of the identification page. */
  mrz: string;
};

export type BoardingPass = {
  carrier: string;
  from: string;
  to: string;
  gate: string;
  flight: string;
  seat: string;
  board: string;
  depart: string;
  barcode: string;
};

export const identity: Identity = {
  name: "Trung Vo",
  title: "Product Designer",
  birthDate: "ADD BIRTH DATE",
  school: "University of California, Davis",
  university: "University of California, Davis",
  location: "San Jose, CA",
  currentRole: "IBM - watsonx.data",
  nationality: "Designer",
  issuedBy: "IBM",
  issued: "ISS 2026",
  expires: "∞",
  passportNo: "TV·0001·DSGN",
  photo: "/passport/identity.png",
  signature: "Trung Vo",
  description: [
    "I previously worked at startups that sparked my interest in Product Design.",
    "In early 2026, I joined IBM (watsonx.data), attracted by designing for complexity.",
    "Currently, I’m exploring how design can be enhanced with AI",
  ],
  linkedin: "https://www.linkedin.com/in/trungvo",
  email: "trungvanvo.823@gmail.com",
  mrz: "TRUNG>>>>VO>>>8232003>>>>06172025>>>>>>>>>>>>",
};

export const boardingPass: BoardingPass = {
  carrier: "Portfolio Air",
  from: "IBM",
  to: "AI",
  gate: "UX",
  flight: "WXDATA",
  seat: "PD",
  board: "2025",
  depart: "NOW",
  barcode: "TV101001110010101101011100100111010010110101110010101",
};

export const stampBrands: StampBrand[] = [
  {
    brand: "IBM",
    label: "IBM",
    sub: "watsonx.data · Verified",
    code: "'25",
    ink: "blue",
    rotate: -7,
    shape: "circle",
  },
  {
    brand: "ZEME",
    label: "ZEME",
    sub: "Leasing OS · Verified",
    code: "'24",
    ink: "red",
    rotate: 5,
    shape: "rect",
  },
  {
    brand: "SUNCOAST",
    label: "SUNCOAST",
    sub: "Design · Admitted",
    code: "'23",
    ink: "green",
    rotate: -3,
    shape: "rounded",
  },
];

// ---- EXPERIENCE (companies) ----  seeded from profile; confirm dates.
export const experience: Stamp[] = [
  {
    label: "IBM",
    sub: "watsonx.data · Entry",
    code: "'25",
    ink: "blue",
    rotate: -7,
    shape: "circle",
  },
  {
    label: "ZEME",
    sub: "Leasing OS · Verified",
    code: "'24",
    ink: "red",
    rotate: 5,
    shape: "rect",
  },
  {
    label: "SUNCOAST",
    sub: "Design · Admitted",
    code: "'23",
    ink: "green",
    rotate: -3,
    shape: "rounded",
  },
];

// ---- EDUCATION (schools) ---- TODO: replace with Trung's real schools + years.
export const education: Stamp[] = [
  {
    label: "UNIVERSITY",
    sub: "B.A. Design · Conferred",
    code: "'22",
    ink: "purple",
    rotate: 8,
    shape: "oval",
  },
  {
    label: "STUDIO",
    sub: "Program · Completed",
    code: "'20",
    ink: "green",
    rotate: -6,
    shape: "rounded",
  },
];

export const inkColor: Record<StampInk, string> = {
  purple: "var(--stamp-purple)",
  blue: "var(--stamp-blue)",
  red: "var(--stamp-red)",
  green: "var(--stamp-green)",
};
