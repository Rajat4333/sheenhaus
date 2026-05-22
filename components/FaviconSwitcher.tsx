"use client";
import { useEffect } from "react";

/**
 * Favicon Easter egg — swaps the favicon's glyph when the tab is hidden.
 *
 * Active tab:    S    (the brand letter)
 * Inactive tab:  §    (the typographer's section sign)
 *
 * The kind of detail the right luxury client notices. No animation,
 * no JS framework, just a data: URL swap on visibility change.
 */
const SVG_TEMPLATE = (glyph: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="%23f4efe6"/><text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-family="Instrument Serif, Georgia, serif" font-style="italic" font-size="46" fill="%238a6a35">${glyph}</text></svg>`
      .replace(/%23/g, "#")
      // The dual replace above keeps the # chars safe inside the SVG
  )}`;

const FAVICON_ACTIVE   = SVG_TEMPLATE("S");
const FAVICON_INACTIVE = SVG_TEMPLATE("§");

function setFavicon(href: string) {
  let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.type = "image/svg+xml";
  link.href = href;
}

export default function FaviconSwitcher() {
  useEffect(() => {
    if (typeof document === "undefined") return;

    setFavicon(document.hidden ? FAVICON_INACTIVE : FAVICON_ACTIVE);

    const onVisibility = () => {
      setFavicon(document.hidden ? FAVICON_INACTIVE : FAVICON_ACTIVE);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return null;
}
