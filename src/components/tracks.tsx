"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VelocitySkew } from "./ui/scroll-fx";
import { TRACKS, type Track } from "@/lib/tracks";
import { useScrollTo } from "@/hooks/use-scroll-to";

/**
 * The tracks, as mission dossiers.
 *
 * Collapsed, each is a numbered row carrying the title and its domain tags. Opened, it
 * inverts to a briefing document: objective, routes, summit condition, and — where the
 * brief provides one — a full technical annex with contract specs, the data endpoint,
 * numbered hazards and liquidity tables.
 *
 * Only one dossier is open at a time. The depth here is the point: the first track's annex
 * is the difference between a team starting on the actual problem and a team spending two
 * days discovering that the exchange silently substitutes dates.
 */
export function Tracks() {
  const [openId, setOpenId] = useState<string | null>(null);
  const rowRefs = useRef(new Map<string, HTMLDivElement>());
  const scrollTo = useScrollTo();

  /**
   * Switching dossiers collapses the open one. If that one sits above the row you clicked,
   * the page loses height above it and the row you were aiming at slides up out from under
   * the cursor. So: measure where the clicked row is, then hold it at that exact viewport
   * position for the length of the accordion animation.
   */
  const handleToggle = useCallback(
    (id: string) => {
      const el = rowRefs.current.get(id);
      const anchor = el?.getBoundingClientRect().top;

      setOpenId((prev) => (prev === id ? null : id));

      if (!el || anchor === undefined) return;

      let cancelled = false;
      // Any real scroll input hands control straight back to the reader.
      const release = () => {
        cancelled = true;
      };
      window.addEventListener("wheel", release, { passive: true, once: true });
      window.addEventListener("touchstart", release, { passive: true, once: true });

      const started = performance.now();
      const hold = () => {
        if (cancelled) return;

        const drift = el.getBoundingClientRect().top - anchor;
        if (Math.abs(drift) > 0.5) {
          scrollTo(window.scrollY + drift, { immediate: true });
        }

        // The expand/collapse runs 700ms; follow it a little past the end to settle.
        if (performance.now() - started < 900) {
          requestAnimationFrame(hold);
        } else {
          window.removeEventListener("wheel", release);
          window.removeEventListener("touchstart", release);
        }
      };

      requestAnimationFrame(hold);
    },
    [scrollTo]
  );

  return (
    <section
      id="tracks"
      className="relative w-full bg-[#E6E1D6] text-[#1A1A1A] py-32 md:py-48 overflow-hidden selection:bg-[#1A1A1A] selection:text-[#E6E1D6]"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 border-b border-[#1A1A1A]/15 pb-8 gap-6">
          <div>
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#1A1A1A]/50 mb-4 block">
              {String(TRACKS.length).padStart(2, "0")} Routes · Pick One
            </span>
            <VelocitySkew>
              <h2 className="font-display text-4xl md:text-6xl font-black uppercase tracking-tighter">
                THE TRACKS
              </h2>
            </VelocitySkew>
          </div>
          <p className="font-mono text-[11px] leading-relaxed tracking-[0.12em] uppercase text-[#1A1A1A]/50 max-w-xs md:text-right">
            Your project must fit the track you choose. Open a dossier for the full brief.
          </p>
        </div>

        <div className="w-full flex flex-col border-t border-[#1A1A1A]/15">
          {TRACKS.map((track) => (
            <Dossier
              key={track.id}
              track={track}
              open={openId === track.id}
              onToggle={() => handleToggle(track.id)}
              registerRef={(el) => {
                if (el) rowRefs.current.set(track.id, el);
                else rowRefs.current.delete(track.id);
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Dossier({
  track,
  open,
  onToggle,
  registerRef,
}: {
  track: Track;
  open: boolean;
  onToggle: () => void;
  registerRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div ref={registerRef} className="border-b border-[#1A1A1A]/15">
      {/* The row. A button, so it is reachable by keyboard and announces its state. */}
      <button
        onClick={onToggle}
        aria-expanded={open}
        data-cursor="expand"
        data-cursor-text={open ? "CLOSE" : "OPEN"}
        data-cursor-alt={`TRACK ${track.id}`}
        className="group w-full text-left py-6 md:py-7 flex items-start gap-5 md:gap-8 cursor-none"
      >
        <span className="font-mono text-[11px] md:text-sm text-[#1A1A1A]/35 tabular-nums pt-2 md:pt-3 shrink-0">
          {track.id}
        </span>

        <span className="flex-1 min-w-0">
          <span
            className={`block font-display text-xl sm:text-3xl lg:text-[2.75rem] font-black uppercase tracking-tighter leading-[0.95] transition-all duration-500 ${
              open ? "opacity-100 md:translate-x-2" : "opacity-75 group-hover:opacity-100"
            }`}
          >
            {track.title}
          </span>

          <span className="block font-sans text-[13px] md:text-sm font-light text-[#1A1A1A]/55 mt-2 max-w-xl">
            {track.tagline}
          </span>

          <span className="flex flex-wrap gap-x-2 gap-y-2 mt-4">
            {track.stack.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[9px] tracking-[0.18em] uppercase border border-[#1A1A1A]/20 px-2.5 py-1 text-[#1A1A1A]/60"
              >
                {tag}
              </span>
            ))}
          </span>
        </span>

        <span className="flex flex-col items-end gap-3 shrink-0 pt-1">
          <span className="font-display font-[var(--font-anton)] text-sm md:text-lg tracking-tight text-[#1A1A1A]/40 tabular-nums">
            {track.elevation}
          </span>
          <span
            className="flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-full border border-[#1A1A1A]/25 transition-transform duration-500"
            style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M7 0V14M0 7H14" stroke="#1A1A1A" strokeWidth="1.5" />
            </svg>
          </span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <Briefing track={track} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * The opened brief.
 *
 * No panel. An inverted slab sitting inside a light section read as a card dropped onto the
 * page — it never aligned with the title above it, and the metadata rail it needed left a
 * tall empty column beside dense text. The brief now lives on the same surface as the list
 * and takes its structure from rules, indentation and type scale instead of a container.
 * The metadata is already in the collapsed row, so it is not repeated here.
 */
function Briefing({ track }: { track: Track }) {
  return (
    <div className="pb-14 md:pb-16 md:pl-[4.5rem]">
      <div className="flex flex-col gap-11">
        <section>
          <SectionLabel>Objective</SectionLabel>
          <p className="font-sans text-lg md:text-[1.45rem] font-light leading-[1.45] text-[#1A1A1A] max-w-4xl">
            {track.problem}
          </p>
        </section>

        {track.explore ? (
          <section>
            <SectionLabel>
              {track.explore.length > 2 ? "Possible Routes" : "Disciplines"}
            </SectionLabel>
            <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-7 max-w-5xl">
              {track.explore.map((item, i) => (
                <li
                  key={item.title}
                  className="flex gap-4 border-t border-[#1A1A1A]/12 pt-4"
                >
                  <span className="font-mono text-[10px] text-[#1A1A1A]/35 tabular-nums pt-0.5 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block font-display font-bold uppercase tracking-tight text-[13px] mb-1.5">
                      {item.title}
                    </span>
                    <span className="block font-sans text-[13px] font-light leading-relaxed text-[#1A1A1A]/60">
                      {item.body}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        <section className="border-l-2 border-[#FF512F] pl-6">
          <SectionLabel accent>Summit Condition</SectionLabel>
          <p className="font-sans text-sm md:text-base font-light leading-relaxed text-[#1A1A1A]/75 max-w-3xl">
            {track.challenge}
          </p>
        </section>

        {track.annex ? <Annex annex={track.annex} /> : null}
      </div>
    </div>
  );
}

function Annex({ annex }: { annex: NonNullable<Track["annex"]> }) {
  const available = ANNEX_TABS.filter((t) => Boolean(annex[t.key]));
  const [tab, setTab] = useState<AnnexKey>(available[0]?.key ?? "contracts");

  if (available.length === 0) return null;

  return (
    <section className="border border-[#1A1A1A]/15 p-5 md:p-7 max-w-5xl">
      <header className="mb-6">
        <SectionLabel>{annex.label}</SectionLabel>
        <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#1A1A1A]/45">
          {annex.intro}
        </p>
      </header>

      {/*
        * Tabs, not a stack. Laid end to end this annex ran to eight sections and several
        * thousand words — opening a dossier buried the brief under reference material.
        * One panel at a time keeps the dossier the height of a document, not a manual.
        */}
      <div className="flex gap-1 overflow-x-auto border-b border-[#1A1A1A]/15 mb-6 -mx-1 px-1">
        {available.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            data-cursor-hover
            data-cursor-text={t.label.toUpperCase()}
            className={`relative shrink-0 font-mono text-[10px] tracking-[0.18em] uppercase px-3 py-2.5 transition-colors cursor-none ${
              tab === t.key ? "text-[#33556F]" : "text-[#1A1A1A]/45 hover:text-[#1A1A1A]/70"
            }`}
          >
            {t.label}
            {tab === t.key ? (
              <motion.span
                layoutId={`annex-tab-${annex.label}`}
                className="absolute left-0 right-0 -bottom-px h-px bg-[#33556F]"
              />
            ) : null}
          </button>
        ))}
      </div>

      <div className="min-h-[200px]">
      {tab === "contracts" && annex.contracts ? (
        <div>
          <div>
                    {/* Horizontal scroll rather than a squeezed table: five columns of numbers do not
              fold gracefully onto a phone. */}
          <div className="overflow-x-auto -mx-5 px-5 md:mx-0 md:px-0">
            <table className="w-full min-w-[520px] border-collapse font-mono text-[11px] md:text-xs">
              <thead>
                <tr className="text-[#1A1A1A]/45 uppercase tracking-[0.15em]">
                  {["Contract", "Trading Unit", "Quoted Per", "Purity", "Expiry Lands"].map((h) => (
                    <th key={h} className="text-left font-normal pb-3 border-b border-[#1A1A1A]/15 pr-6">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {annex.contracts.map((c) => (
                  <tr key={c.contract} className="border-b border-[#1A1A1A]/10">
                    <td className="py-3 pr-6 font-bold text-[#33556F]">{c.contract}</td>
                    <td className="py-3 pr-6 tabular-nums">{c.unit}</td>
                    <td className="py-3 pr-6 tabular-nums">{c.quote}</td>
                    <td className="py-3 pr-6 tabular-nums">{c.purity}</td>
                    <td className="py-3 pr-6 text-[#1A1A1A]/60">{c.expiry}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {annex.contractsNote ? (
            <p className="font-sans text-sm font-light leading-relaxed text-[#1A1A1A]/60 mt-5 max-w-3xl">
              {annex.contractsNote}
            </p>
          ) : null}
        </div></div>
      ) : null}

      {tab === "data" && annex.data ? (
        <div>
          <div>
                    <dl className="border border-[#1A1A1A]/15 divide-y divide-[#1A1A1A]/10">
            {annex.data.rows.map((row) => (
              <div key={row.k} className="flex flex-col sm:flex-row gap-1 sm:gap-6 px-4 py-3">
                <dt className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#1A1A1A]/45 sm:w-24 shrink-0 pt-0.5">
                  {row.k}
                </dt>
                <dd className="font-mono text-[11px] md:text-xs text-[#33556F] break-words min-w-0">
                  {row.v}
                </dd>
              </div>
            ))}
          </dl>
          <p className="font-sans text-sm font-light leading-relaxed text-[#1A1A1A]/60 mt-5 max-w-3xl">
            {annex.data.note}
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 mt-4 font-mono text-[10px] tracking-[0.12em] uppercase text-[#1A1A1A]/45">
            {annex.data.availability.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div></div>
      ) : null}

      {tab === "hazards" && annex.hazards ? (
        <div>
          <div>
                    <ol className="flex flex-col">
            {annex.hazards.map((h) => (
              <li
                key={h.n}
                className="flex gap-5 py-5 border-b border-[#1A1A1A]/10 last:border-0"
              >
                <span className="font-display font-black text-2xl text-[#FF512F] tabular-nums leading-none pt-0.5 shrink-0">
                  {h.n}
                </span>
                <span className="min-w-0">
                  <span className="block font-display font-bold uppercase tracking-tight text-base mb-1.5">
                    {h.title}
                  </span>
                  <span className="block font-sans text-sm font-light leading-relaxed text-[#1A1A1A]/60">
                    {h.body}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div></div>
      ) : null}

      {tab === "normalisation" && annex.normalisation ? (
        <div>
          <div>
                    <p className="font-sans text-sm font-light leading-relaxed text-[#1A1A1A]/60 max-w-3xl mb-5">
            {annex.normalisation.body}
          </p>
          <div className="border border-[#33556F]/30 bg-[#33556F]/[0.05] px-4 py-4 md:px-6 overflow-x-auto">
            <code className="font-mono text-xs md:text-sm text-[#33556F] whitespace-nowrap">
              {annex.normalisation.formula}
            </code>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3 mt-5">
            {annex.normalisation.multipliers.map((m) => (
              <span key={m.k} className="font-mono text-[11px]">
                <span className="text-[#1A1A1A]/45 uppercase tracking-[0.15em]">{m.k}</span>{" "}
                <span className="text-[#1A1A1A] tabular-nums">{m.v}</span>
              </span>
            ))}
          </div>
          <p className="font-sans text-sm font-light leading-relaxed text-[#1A1A1A]/60 mt-5 max-w-3xl">
            {annex.normalisation.caveat}
          </p>
        </div></div>
      ) : null}

      {tab === "liquidity" && annex.liquidity ? (
        <div>
          <div>
                    <p className="font-sans text-sm font-light text-[#1A1A1A]/60 mb-5 max-w-3xl">
            {annex.liquidity.note}
          </p>
          <div className="overflow-x-auto -mx-5 px-5 md:mx-0 md:px-0">
            <table className="w-full min-w-[440px] border-collapse font-mono text-[11px] md:text-xs">
              <thead>
                <tr className="text-[#1A1A1A]/45 uppercase tracking-[0.15em]">
                  {annex.liquidity.head.map((h, i) => (
                    <th
                      key={h}
                      className={`font-normal pb-3 border-b border-[#1A1A1A]/15 pr-6 ${
                        i === 0 ? "text-left" : "text-right"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {annex.liquidity.rows.map((row) => (
                  <tr key={row[0]} className="border-b border-[#1A1A1A]/10">
                    {row.map((cell, i) => (
                      <td
                        key={i}
                        className={`py-3 pr-6 tabular-nums ${
                          i === 0 ? "font-bold text-[#33556F]" : "text-right text-[#1A1A1A]/70"
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div></div>
      ) : null}

      {tab === "lifecycle" && annex.lifecycle ? (
        <div>
          <div>
                    <div className="flex flex-col gap-4 max-w-3xl">
            {annex.lifecycle.map((p, i) => (
              <p
                key={i}
                className="font-sans text-sm font-light leading-relaxed text-[#1A1A1A]/60"
              >
                {p}
              </p>
            ))}
          </div>
        </div></div>
      ) : null}

      {tab === "facts" && annex.facts ? (
        <div>
          <div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {annex.facts.map((f) => (
              <div key={f.title} className="border-t border-[#1A1A1A]/15 pt-4">
                <span className="block font-display font-bold uppercase tracking-tight text-sm mb-2">
                  {f.title}
                </span>
                <span className="block font-sans text-sm font-light leading-relaxed text-[#1A1A1A]/60">
                  {f.body}
                </span>
              </div>
            ))}
          </div>
        </div></div>
      ) : null}
      </div>
    </section>
  );
}

type AnnexKey =
  | "contracts"
  | "data"
  | "hazards"
  | "normalisation"
  | "liquidity"
  | "lifecycle"
  | "facts";

const ANNEX_TABS: readonly { key: AnnexKey; label: string }[] = [
  { key: "contracts", label: "Contracts" },
  { key: "data", label: "Data" },
  { key: "hazards", label: "Hazards" },
  { key: "normalisation", label: "Normalising" },
  { key: "liquidity", label: "Liquidity" },
  { key: "lifecycle", label: "Lifecycle" },
  { key: "facts", label: "Notes" },
];

function SectionLabel({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <span
      className={`flex items-center gap-3 font-mono text-[10px] tracking-[0.25em] uppercase mb-4 ${
        accent ? "text-[#FF512F]" : "text-[#1A1A1A]/45"
      }`}
    >
      <span className={`w-5 h-px ${accent ? "bg-[#FF512F]" : "bg-[#1A1A1A]/30"}`} />
      {children}
    </span>
  );
}
