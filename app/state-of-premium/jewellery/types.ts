// Shared types between the server page and the client charts.

export type Category = "performance" | "craft" | "trust" | "discoverability";

export type SignHit = {
  num: string;
  title: string;
  category: Category;
  severity: "low" | "medium" | "high";
};

export type AuditResult = {
  url: string;
  score: number;
  scores: Record<Category, number>;
  signs: SignHit[];
  pagespeed: {
    performance: number;
    accessibility: number;
    seo: number;
    bestPractices: number;
    lcp: number | null;
    cls: number | null;
    tbt: number | null;
  } | null;
};

export type Unreachable = {
  unreachable: true;
  reason: "blocked" | "not-found" | "server-error" | "unreachable" | "timeout";
  status?: number;
};

export type BrandMeta = {
  displayName: string;
  parent: string | null;
  ticker: string;
  domain: string;
  marketCapCr: number;
  qtrSalesCr: number;
  pe: number;
};

export type Row = {
  brand: BrandMeta;
  audit: AuditResult | Unreachable | { error: string };
};

export type Dataset = {
  set: {
    slug: string;
    year: number;
    vertical: string;
    framing: string;
  };
  generatedAt: string;
  results: Row[];
};

export function isAudit(a: Row["audit"]): a is AuditResult {
  return (
    typeof a === "object" &&
    a !== null &&
    "score" in a &&
    typeof (a as AuditResult).score === "number"
  );
}

export function isUnreachable(a: Row["audit"]): a is Unreachable {
  return (
    typeof a === "object" &&
    a !== null &&
    "unreachable" in a &&
    (a as Unreachable).unreachable === true
  );
}
