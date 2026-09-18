"use client";

import { useCallback } from "react";
import { useLenis } from "lenis/react";

/** Clears the fixed header when scrolling to a named section. */
const NAV_OFFSET = -96;

type Options = {
  /** Jump with no animation — for keeping an element pinned while layout around it moves. */
  immediate?: boolean;
};

/**
 * Anchor navigation that works with or without Lenis. Lenis is not mounted on low-end
 * devices, so `useLenis()` returns undefined there and we fall back to native scrolling
 * rather than silently doing nothing.
 *
 * A selector target gets the nav offset applied; a number is treated as an absolute scroll
 * position and used as given, so callers that have already done their own measuring do not
 * get silently shifted by another 96px.
 */
export function useScrollTo() {
  const lenis = useLenis();

  return useCallback(
    (target: string | number, options: Options = {}) => {
      const isSelector = typeof target === "string";

      if (lenis) {
        lenis.scrollTo(target, {
          offset: isSelector ? NAV_OFFSET : 0,
          immediate: options.immediate,
          duration: options.immediate ? 0 : 1.8,
          easing: (t: number) => 1 - Math.pow(1 - t, 4),
        });
        return;
      }

      const behavior = options.immediate ? "auto" : "smooth";

      if (!isSelector) {
        window.scrollTo({ top: target, behavior });
        return;
      }

      const node = document.querySelector(target);
      if (!node) return;

      const top = node.getBoundingClientRect().top + window.scrollY + NAV_OFFSET;
      window.scrollTo({ top, behavior });
    },
    [lenis]
  );
}
