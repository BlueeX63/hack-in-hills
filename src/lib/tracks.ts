/**
 * The problem statements, as structured data.
 *
 * Kept separate from `content.ts` because the first track carries a full technical annex —
 * contract specs, an endpoint, hazards, liquidity tables — and the UI renders each of those
 * shapes differently. Editing a track means editing this file and nothing else.
 */

export type ContractSpec = {
  contract: string;
  unit: string;
  quote: string;
  purity: string;
  expiry: string;
};

export type Hazard = { n: string; title: string; body: string };

export type Track = {
  id: string;
  title: string;
  /** Stable value stored against a registration; never renumber it. */
  slug: string;
  /** One line, shown collapsed. */
  tagline: string;
  /** Domain tags rendered as monospace chips. */
  stack: readonly string[];
  /** The site's altitude metaphor — harder track, higher camp. */
  elevation: string;
  problem: string;
  /** "Teams can explore solutions such as" — omitted where the brief gives none. */
  explore?: readonly { title: string; body: string }[];
  challenge: string;
  /** PDF download link for the problem statement */
  pdfUrl?: string;
  annex?: {
    label: string;
    intro: string;
    contracts?: readonly ContractSpec[];
    contractsNote?: string;
    data?: {
      rows: readonly { k: string; v: string }[];
      note: string;
      availability: readonly string[];
    };
    hazards?: readonly Hazard[];
    lifecycle?: readonly string[];
    normalisation?: {
      body: string;
      formula: string;
      multipliers: readonly { k: string; v: string }[];
      caveat: string;
    };
    liquidity?: {
      note: string;
      head: readonly string[];
      rows: readonly (readonly string[])[];
    };
    facts?: readonly { title: string; body: string }[];
  };
};

export const TRACKS: readonly Track[] = [
  {
    id: "01",
    title: "Commodity Derivatives Intelligence",
    slug: "commodity-derivatives",
    tagline:
      "Find and act on relative mispricing between contracts on the same underlying metal.",
    stack: ["Data Engineering", "Quant Research", "Backtesting", "Python"],
    elevation: "3,200M",
    pdfUrl: "/Hack_in_Hills_26_Problem_Statements.pdf",
    problem:
      "Build a data product on India's public commodity futures record that finds and acts on relative mispricing between contracts on the same underlying metal. MCX lists the same gold in four sizes (GOLDM, GOLDTEN, GOLDGUINEA, GOLDPETAL), so per gram they should cost the same. They nearly do, and the small difference moves.",
    explore: [
      {
        title: "Cross-contract relative value",
        body: "Normalise size, quotation base and purity, then flag when one contract is unusually cheap per gram against another.",
      },
      {
        title: "Term structure & carry",
        body: "Separate mechanical roll-down toward expiry from genuine movement in the curve.",
      },
      {
        title: "Walk-forward backtesting",
        body: "Replay each expired contract a day at a time with no sight of the next day, net of dealing costs and thin-day liquidity.",
      },
      {
        title: "Trader-facing surfaces",
        body: "Dashboards or alerts that stay quiet when there is nothing to say, and attribute gains to the strategy rather than to the gold price.",
      },
      {
        title: "Contract lifecycle planning",
        body: "For each live contract show when it listed, when it becomes liquid enough to trade, when the tender period starts and when it expires — and place every entry and exit inside that calendar.",
      },
    ],
    challenge:
      "Create a functional prototype that turns exchange settlement data into a defensible signal, and proves on unseen history that the edge survives costs. Report profit in rupees after costs, at the prices of the contracts actually held, and separate it from what the gold price move alone would have given. Rigorously showing no edge survives is a valid result; a dashboard that signals every day is not.",
    annex: {
      label: "Starter Notes",
      intro:
        "Mechanics and data quirks only. No strategy, no results — that part is yours.",
      contracts: [
        { contract: "GOLDM", unit: "100 g", quote: "10 g", purity: "995", expiry: "3rd – 5th" },
        { contract: "GOLDTEN", unit: "10 g", quote: "10 g", purity: "999", expiry: "27th – 31st" },
        { contract: "GOLDGUINEA", unit: "8 g", quote: "8 g", purity: "999", expiry: "27th – 31st" },
        { contract: "GOLDPETAL", unit: "1 g", quote: "1 g", purity: "999", expiry: "27th – 31st" },
      ],
      contractsNote:
        "A 1 kg GOLD contract also exists. All four reference the same metal and move together almost perfectly, so anything interesting is in the differences, not in gold's direction. GOLDM rolls in the first week and the other three in the last, so they sit on different cycles for most of any month.",
      data: {
        rows: [
          { k: "Page", v: "mcxindia.com/market-data/bhavcopy" },
          { k: "Endpoint", v: ".../market-data/bhavcopy/GetDateWiseBhavCopy" },
          { k: "Params", v: "InstrumentName=FUTCOM&fromDate=DD/MM/YYYY" },
          { k: "Headers", v: "Accept: application/json · X-Requested-With: XMLHttpRequest · Referer: the bhavcopy page · User-Agent: a plain short string" },
          { k: "Cookies", v: "GET the bhavcopy page first to establish a session" },
        ],
        note:
          "Returns Symbol, Date, ExpiryDate, Open, High, Low, Close, Volume, OpenInterest. Every row carries its own ExpiryDate, so contracts stay separate — no stitching, no roll adjustment. Free, no key. Avoid the mcxlib package and anything under mcxindia.com/backpage.aspx/ — MCX retired those endpoints.",
        availability: [
          "GOLDGUINEA — 8 May 2008",
          "GOLDPETAL — 18 April 2011",
          "GOLDTEN — listed 31 March 2025, first traded 1 April 2025",
        ],
      },
      hazards: [
        {
          n: "01",
          title: "Silent date substitution",
          body: "Ask for a date MCX does not recognise — a holiday, a bad format, a future date — and it returns the most recent available day with no error. An unguarded bulk fetch fills your whole range with copies of one day. Always compare the response Date to the date you requested and discard mismatches.",
        },
        {
          n: "02",
          title: "The WAF hates real browsers",
          body: "A full Chrome-like User-Agent gets HTTP 403; a plain short string works. Leave ~0.8s between requests.",
        },
        {
          n: "03",
          title: "Three date formats, one response",
          body: "Requests use DD/MM/YYYY, the response Date uses MM/DD/YYYY, and ExpiryDate is \"04SEP2026\" — caps month, no separators. Symbol is space-padded (\"GOLDM   \").",
        },
        {
          n: "04",
          title: "Settlement data only",
          body: "OHLCV and open interest. No bid/ask, no depth, no intraday bars. And volume is not depth: one GOLDGUINEA far month traded 1,161 lots in a session with just 1 lot resting at the best price.",
        },
        {
          n: "05",
          title: "\"Near month\" is a slot, not a contract",
          body: "When one expires, everything shifts up. Any series built as \"the near month each day\" jumps at every expiry, and that jump is not a price move — it is you switching contracts. Anchor on expiry_date: PRIMARY KEY (obs_date, expiry_date).",
        },
      ],
      lifecycle: [
        "A new contract lists the trading day after one expires, six months out. Six are live at any time, and a trader can enter or exit on any trading day in between.",
        "Early life is thin. Across 7 fully expired six-month contracts, in the first 5 trading days GOLDGUINEA traded a median 16 lots/day and the petal-guinea gap moved a median ₹609/10g a day — against ₹66 in the final stretch.",
        "The end is fixed by circular. These are compulsory-delivery contracts: the last 5 trading days are the tender period, carrying 5% extra margin. Anything open at expiry is marked for physical delivery at 25%+ margin, and brokers often force an exit before tender even starts.",
      ],
      normalisation: {
        body:
          "GOLDM's contract is 100 g but its price is quoted per 10 g. Divide by trading unit and you get nonsense — 116.7% median dispersion across the four. Divide by the quotation base and it is 1.02%. Then adjust purity:",
        formula: "fine_multiplier = (10 / price_quote_g) × (999 / fineness)",
        multipliers: [
          { k: "GOLDM", v: "1.004020" },
          { k: "GOLDTEN", v: "1.0" },
          { k: "GOLDGUINEA", v: "1.25" },
          { k: "GOLDPETAL", v: "10.0" },
        ],
        caveat:
          "With maturities matched that takes dispersion to 0.76%, improving the fit on 98.4% of days. The residual ~0.76% is not noise to normalise away — it is differing expiry dates, retail premium in the small contracts, and liquidity. Do not assume it is an error. Do not assume it is tradeable either.",
      },
      liquidity: {
        note: "Median volume by days-to-expiry, 2021 onward. Liquidity collapses down the curve.",
        head: ["Contract", "0–15", "15–55", "55–100", "100+"],
        rows: [
          ["GOLDM", "9,713", "11,653", "1,504", "304"],
          ["GOLDTEN", "9,104", "12,085", "3,596", "402"],
          ["GOLDGUINEA", "1,401", "2,136", "148", "10"],
          ["GOLDPETAL", "16,096", "22,024", "1,927", "836"],
        ],
      },
      facts: [
        {
          title: "Contract life changed twice",
          body: "Trading days per contract: 64 before 2014; from 2014 to Sep 2025, 64 for GOLDM and GOLDTEN and 85 for GOLDGUINEA/GOLDPETAL; 126 for all four since. Listed months per day stepped up in 2014 and again in October 2025. Metrics computed across \"all listed months\" change shape at those boundaries for reasons that have nothing to do with the market.",
        },
        {
          title: "Settlement is not a fill",
          body: "Close is the exchange's official settlement price — right for valuing a position, wrong for assuming you could have traded there, especially in thin months.",
        },
        {
          title: "The reference point moves",
          body: "On the petal/guinea pair the per-10g gap went from about ₹1,688 cheaper in late 2024 to about ₹296 dearer in mid 2025 — a ₹2,000 swing that changed sign. No fixed threshold survives that; compute \"normal\" from recent, contract-specific history and recompute it daily.",
        },
      ],
    },
  },
  {
    id: "02",
    title: "Vision-Based Autonomous Robot",
    slug: "vision-robot",
    tagline:
      "A robot that sees its surroundings and navigates to an objective on its own.",
    stack: ["Computer Vision", "Robotics", "Embedded", "VLM"],
    elevation: "2,600M",
    pdfUrl: "/Hack_in_Hills_26_Problem_Statements.pdf",
    problem:
      "Build a robot that uses an AI vision model to understand its surroundings, identify objects and people, and autonomously navigate toward a given objective while avoiding obstacles.",
    explore: [
      {
        title: "AI",
        body: "Object detection, image classification, vision-language models.",
      },
      {
        title: "Robotics",
        body: "Motors, sensors, navigation, obstacle avoidance.",
      },
    ],
    challenge:
      "Demonstrate a robot that perceives a real environment and reaches a given objective without a human driving it.",
  },
  {
    id: "03",
    title: "Onchain Finance & Trading",
    slug: "onchain-finance",
    tagline:
      "Financial products that only work because settlement is fast and onchain.",
    stack: ["Solidity", "DeFi", "Market Design", "Onchain Data"],
    elevation: "2,900M",
    pdfUrl: "/Hack_in_Hills_26_Problem_Statements.pdf",
    problem:
      "Build a fully onchain financial product that leverages fast blockchain settlement to create innovative and transparent trading or lending markets without relying on centralized offchain infrastructure.",
    explore: [
      {
        title: "Onchain order books",
        body: "Matching and settlement both handled onchain.",
      },
      {
        title: "Perpetual futures",
        body: "Funding rates updated every block.",
      },
      {
        title: "Undercollateralized lending",
        body: "Use a user's onchain credit history to determine lending terms.",
      },
      {
        title: "Onchain market making",
        body: "Provide liquidity and respond dynamically to market conditions.",
      },
    ],
    challenge:
      "Create a functional prototype that demonstrates how blockchain-native infrastructure can enable financial products that are difficult or inefficient to build using traditional systems.",
  },
  {
    id: "04",
    title: "Securing Adversarial AI Safety Testing Infrastructure",
    slug: "bayora-ai-safety",
    tagline:
      "Isolate red-team, blue-team, and LLM workloads in a shared evaluation sandbox.",
    stack: ["Systems Security", "Container Isolation", "Infrastructure", "Audit"],
    elevation: "3,100M",
    pdfUrl: "/Hack_in_Hills_26_Problem_Statements.pdf",
    problem:
      "Bayora is an AI safety validation platform where red teams conduct adversarial testing, blue teams build defenses, and a client LLM runs evaluations — all in a shared Docker sandbox. Red-team payloads must stay hidden from blue-team, defensive logic must not leak to red-team, and the LLM must remain uncontaminated. How do you build an environment where adversaries, defenders, and the model operate simultaneously without exposing their sensitive state or creating exploitable side channels?",
    explore: [
      {
        title: "Container & Sandbox Isolation",
        body: "Stronger execution boundaries using Linux namespaces, seccomp, cgroup partitioning, and hardened runtimes.",
      },
      {
        title: "Network Segmentation",
        body: "Micro-segmented topologies where communication is policy-enforced and strictly controlled.",
      },
      {
        title: "Access Control & Secrets",
        body: "Capability-based or attribute-based models restricting access to payloads, logic, and weights.",
      },
      {
        title: "Audit Trails & Provenance",
        body: "Tamper-evident and cryptographically verifiable records for independent reconstruction.",
      },
      {
        title: "Resource Governance",
        body: "Prevent CPU, memory, I/O, and timing effects from distorting results or leaking information.",
      },
      {
        title: "LLM-Specific Threats",
        body: "Address shared KV-cache side channels, prompt leakage, model output isolation, and inference-time exfiltration.",
      },
      {
        title: "Observability & Anomaly Detection",
        body: "Detect policy violations without turning monitoring into an information-leakage channel.",
      },
    ],
    challenge:
      "Build a working proof of concept for secure adversarial AI testing infrastructure that demonstrates meaningful isolation, prevents cross-team information leakage, preserves auditability, and clearly communicates security guarantees and residual risks.",
  },
] as const;
