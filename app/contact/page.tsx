"use client";

/* /contact — inbound enquiry form for international + local prospects.
 *
 * Posts to /api/contact which forwards the enquiry to hello@sheenhaus.com
 * via Resend. Required fields: name, email, message. Optional but very
 * useful for qualifying: company URL, project type, budget, timeline.
 *
 * Cream / clinical theme matching the rest of the site. */

import { useState, FormEvent } from "react";
import Link from "next/link";
import ClinicalNavbar from "@/components/ClinicalNavbar";
import ClinicalFooter from "@/components/ClinicalFooter";

type Status = "idle" | "sending" | "sent" | "error";

const PROJECT_TYPES = [
  "New build — full website",
  "Revamp — rebuild of existing site",
  "Audit only",
  "Workflow / automation engagement",
  "AI-native integration",
  "Ongoing studio retainer",
  "Other",
];

const TIMELINES = [
  "ASAP / within 30 days",
  "30 – 90 days",
  "90+ days",
  "Exploring",
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [projectType, setProjectType] = useState("");
  const [timeline, setTimeline] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          projectType,
          timeline,
          message,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(
          data?.error === "missing_required"
            ? "Please fill in your name, email and a brief message."
            : data?.error === "invalid_email"
            ? "That doesn't look like a valid email address."
            : "Something failed on our side. Try again, or email hello@sheenhaus.com directly."
        );
        return;
      }
      setStatus("sent");
    } catch {
      setStatus("error");
      setErrorMsg(
        "Network error. Try again, or email hello@sheenhaus.com directly."
      );
    }
  };

  if (status === "sent") {
    return (
      <main className="theme-clinical" style={{ background: "var(--cl-bg)" }}>
        <ClinicalNavbar />
        <section className="relative z-10 shell pt-40 sm:pt-48 md:pt-56 pb-32 text-center">
          <div className="inline-flex items-center gap-3 justify-center">
            <span className="w-6 h-px bg-accent" />
            <span className="font-mono text-[12px] uppercase tracking-[0.22em] text-text-mid">
              Received
            </span>
          </div>
          <h1 className="display-serif font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.04] tracking-[-0.025em] mt-10 max-w-[24ch] mx-auto">
            Thank you. We&rsquo;ll{" "}
            <em className="italic-accent">be in touch</em> within two working days.
          </h1>
          <p className="text-text-mid text-[16px] max-w-xl mx-auto mt-10 leading-[1.85]">
            If your timing is urgent, a direct email to{" "}
            <a
              href="mailto:hello@sheenhaus.com"
              className="text-accent underline-offset-4 hover:underline"
            >
              hello@sheenhaus.com
            </a>{" "}
            usually gets a faster reply than the form. We read every enquiry
            in person &mdash; no auto-responders, no triage queue.
          </p>
          <Link
            href="/"
            data-link-style="bronze"
            className="inline-block mt-16 font-mono text-[11px] uppercase tracking-[0.22em] text-text-dim"
          >
            ← Back to home
          </Link>
        </section>
        <ClinicalFooter />
    </main>
    );
  }

  return (
    <main className="theme-clinical" style={{ background: "var(--cl-bg)" }}>
      <ClinicalNavbar />

      {/* Masthead */}
      <section className="relative z-10 shell pt-40 sm:pt-48 md:pt-56 pb-12 max-w-3xl">
        <div className="inline-flex items-center gap-3">
          <span className="w-6 h-px bg-accent" />
          <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-text-mid whitespace-nowrap">
            Contact · Studio enquiries
          </span>
        </div>
        <h1 className="display-serif font-serif text-[clamp(2.5rem,7vw,5rem)] leading-[1.04] tracking-[-0.035em] mt-10 max-w-[18ch]">
          Tell us about the{" "}
          <em className="italic-accent">work.</em>
        </h1>
        <p className="text-text-mid text-[17px] mt-10 leading-[1.8] max-w-2xl">
          We take on three engagements at a time. If you&rsquo;re a founder,
          a heritage brand going digital, an agency needing white-label
          engineering, or a studio looking for an AI-native partner &mdash;
          start here. We reply to every enquiry in person within two
          working days.
        </p>
      </section>

      {/* Form */}
      <section className="relative z-10 shell pb-24 md:pb-32 max-w-3xl">
        <form onSubmit={submit} className="space-y-10">
          {/* Row 1 — name + email */}
          <div className="grid md:grid-cols-2 gap-8">
            <Field
              label="Your name"
              required
              value={name}
              onChange={setName}
              placeholder="Riya Mehta"
              autoComplete="name"
            />
            <Field
              label="Email"
              required
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="riya@brand.com"
              autoComplete="email"
            />
          </div>

          {/* Row 2 — company */}
          <Field
            label="Company / website"
            value={company}
            onChange={setCompany}
            placeholder="brand.com"
            autoComplete="url"
          />

          {/* Row 3 — project type + timeline */}
          <div className="grid md:grid-cols-2 gap-8">
            <SelectField
              label="Project type"
              value={projectType}
              onChange={setProjectType}
              options={PROJECT_TYPES}
            />
            <SelectField
              label="Timeline"
              value={timeline}
              onChange={setTimeline}
              options={TIMELINES}
            />
          </div>

          {/* Row 4 — message */}
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint mb-3">
              Message
              <span className="text-accent ml-1">·</span> Required
            </label>
            <textarea
              required
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What are you trying to build, where are you stuck, and what would success look like?"
              className="w-full bg-transparent border-0 border-b border-border focus:border-accent outline-none font-serif text-lg md:text-xl text-text placeholder:text-text-faint placeholder:italic transition-colors py-3 resize-none"
              style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
            />
          </div>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4">
            <button
              type="submit"
              disabled={status === "sending"}
              className="btn-bronze whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === "sending" ? "Sending…" : "Send enquiry"}{" "}
              <span aria-hidden>→</span>
            </button>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint max-w-md leading-[1.7]">
              We reply to every enquiry within two working days.
              <br />
              No newsletter, no automated follow-ups.
            </p>
          </div>

          {status === "error" && errorMsg && (
            <p
              className="font-mono text-[11px] uppercase tracking-[0.18em] max-w-2xl"
              style={{ color: "var(--color-accent)" }}
            >
              <span style={{ color: "var(--color-text-mid)" }}>—</span>{" "}
              {errorMsg}
            </p>
          )}
        </form>

        {/* Direct contacts */}
        <div className="mt-24 pt-12 border-t border-border grid md:grid-cols-2 gap-12">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint">
              Direct
            </span>
            <a
              href="mailto:hello@sheenhaus.com"
              className="block font-serif text-xl md:text-2xl text-text mt-3 hover:text-accent transition-colors"
            >
              hello@sheenhaus.com
            </a>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint mt-2">
              Prefer to skip the form? This works too.
            </p>
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint">
              Calendar
            </span>
            <a
              href="https://cal.com/sheenhaus-yseo4c"
              target="_blank"
              rel="noopener noreferrer"
              className="block font-serif text-xl md:text-2xl text-text mt-3 hover:text-accent transition-colors"
            >
              Book a 30-minute call →
            </a>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint mt-2">
              Mon–Fri · IST · UK / EU / ME / US Pacific friendly.
            </p>
          </div>
        </div>

        {/* Studio footer */}
        <div className="mt-20 pt-10 border-t border-border">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint">
            Studio
          </span>
          <p className="text-text-mid text-[14px] mt-4 leading-[1.85] max-w-2xl">
            Sheenhaus is a small studio based in Delhi. We work in
            Indian Standard Time and overlap the working hours of UK,
            Europe, the Middle East, and US Pacific. Engagements are
            async-first with live calls scheduled in your time zone.
          </p>
        </div>
      </section>
      <ClinicalFooter />
    </main>
  );
}

/* ─── Form primitives ───────────────────────────────────────── */

function Field({
  label,
  value,
  onChange,
  required = false,
  type = "text",
  placeholder,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="block font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint mb-3">
        {label}
        {required && (
          <>
            <span className="text-accent ml-1">·</span> Required
          </>
        )}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full bg-transparent border-0 border-b border-border focus:border-accent outline-none font-serif text-lg md:text-xl text-text placeholder:text-text-faint placeholder:italic transition-colors py-3"
        style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="block font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint mb-3">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-0 border-b border-border focus:border-accent outline-none font-serif text-lg text-text transition-colors py-3 cursor-pointer"
        style={{
          fontFamily: "var(--font-instrument-serif), Georgia, serif",
          color: value ? "var(--color-text)" : "var(--color-text-faint)",
        }}
      >
        <option value="">Select…</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
