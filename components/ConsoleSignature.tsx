"use client";

/* Console signature.
 *
 * Devs and curious visitors open DevTools — when they do, we want them to find
 * something. A small, set-in-type studio signature with a hire link.
 *
 * Runs once per browser session (idempotent via window flag). No-op on the
 * server. Single useEffect, no state.
 */

import { useEffect } from "react";

const CAL_LINK = "https://cal.com/sheenhaus-yseo4c";
const MAIL = "hello@sheenhaus.com";

export default function ConsoleSignature() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Idempotent — never print twice across HMR / route changes
    const w = window as unknown as { __sheenhausSig?: boolean };
    if (w.__sheenhausSig) return;
    w.__sheenhausSig = true;

    const gold =
      "color:#8a6a35;font-family:'Bodoni Moda','Instrument Serif',serif;font-size:42px;line-height:1;letter-spacing:0.04em;font-weight:600;text-shadow:0 1px 0 rgba(0,0,0,0.05);";
    const rule = "color:#8a6a35;font-family:monospace;font-size:11px;letter-spacing:0.3em;";
    const body = "color:#4a4233;font-family:monospace;font-size:11px;line-height:1.7;";
    const italic =
      "color:#6a5e48;font-family:'Instrument Serif',Georgia,serif;font-size:13px;font-style:italic;line-height:1.6;";
    const link =
      "color:#8a6a35;font-family:monospace;font-size:11px;text-decoration:underline;text-underline-offset:3px;";

    // Stylized SH wordmark
    console.log("%csheenhaus", gold);
    console.log(
      "%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      rule
    );

    console.log(
      "%cend-to-end tech for businesses with big ambition.\n" +
        "cinematic websites · workflow automation · AI-native tools.\n" +
        "hand-coded by a small studio. delhi, india.",
      body
    );

    console.log(
      "%c\nYou opened the console. You're paying attention.\nThat is the kind of person we build for.",
      italic
    );

    console.log("%c\n→ Book a call:  " + CAL_LINK, link);
    console.log("%c→ Say hello:    " + MAIL + "\n", link);

    console.log(
      "%cset in Bodoni Moda, Instrument Serif & Satoshi · " +
        new Date().getFullYear(),
      "color:#8a7d68;font-family:monospace;font-size:10px;letter-spacing:0.18em;"
    );
  }, []);

  return null;
}
