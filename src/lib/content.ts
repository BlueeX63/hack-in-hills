/**
 * Every piece of event copy the site renders, in one place.
 *
 * Sections import from here rather than hard-coding strings, so the content can be
 * updated without touching layout or animation code.
 */

export const EVENT = {
  name: "Hack in Hills '26",
  format: "Offline",
  category: "Software Development",
  host: "Galgotias University (GU), Greater Noida",
  venue: "Manali, Himachal Pradesh, India",
  coordinates: "32.2396° N, 77.1887° E",
  altitude: "2,050M",
  teamSize: "1 – 3 Members",
  /** Grand finale, which is the date the hero advertises. */
  dateLine: "20 – 21 NOVEMBER 2026",
  durationLine: "24+ HOURS",
  registerUrl:
    "https://unstop.com/hackathons/hack-in-hills-26-galgotias-university-gu-greater-noida-1752595?lb=TUn3UTaD",
} as const;

export const TAGLINE = "Not a Marathon. A Mountain Sprint.";

export const INTRO = [
  "Hack in Hills '26 is a 24+ hour offline hackathon in Manali, bringing together developers, designers, marketers, and Web3 and gaming creators to build, collaborate, and solve problems with the Himalayas as the backdrop.",
  "The team behind Hack in Hills has organised 300+ events, supported 15,000+ hackers, built communities of 50,000+ members, and worked with 50+ Web3 and gaming partners.",
] as const;

/** Track record of the organising team. Rendered as oversized figures. */
export const TRACK_RECORD = [
  { value: 300, suffix: "+", label: "Events organised" },
  { value: 15000, suffix: "+", label: "Hackers supported" },
  { value: 50000, suffix: "+", label: "Community members" },
  { value: 50, suffix: "+", label: "Web3 & gaming partners" },
] as const;

/** "What to expect" — the shape of the event itself. */
export const EXPECTATIONS = [
  { value: "40+", label: "Selected hackers" },
  { value: "10,000+", label: "Registration target" },
  { value: "35+", label: "Web3 & gaming partners" },
  { value: "24+", label: "Hours of building" },
  { value: "₹50,000", label: "Bounty pool" },
  { value: "Manali", label: "Offline finale" },
] as const;

export const PRIZE = {
  poolLabel: "Total Bounty Pool",
  poolValue: 50000,
  breakdown: [
    {
      id: "01",
      rank: "THE SUMMIT",
      position: "01 // WINNER",
      amount: 25000,
      note: "Awarded to the team with the strongest problem–solution fit and execution.",
    },
    {
      id: "02",
      rank: "1ST RUNNER UP",
      position: "02 // 1ST RUNNER UP",
      amount: 15000,
      note: "Awarded for exceptional technical execution and scalability.",
    },
    {
      id: "03",
      rank: "2ND RUNNER UP",
      position: "03 // 2ND RUNNER UP",
      amount: 10000,
      note: "Awarded for innovation and real-world impact.",
    },
  ],
} as const;

/**
 * The schedule, in the order it runs, as published on the event page. `window` is the
 * published date range; `elevation` is the site's own altitude metaphor for how far up the
 * climb each stage sits. `image` is optional; the timeline renders text-only without it.
 */
export const STAGES = [
  {
    id: "01",
    label: "Round 1",
    title: "Registration + Idea & PPT Submission",
    window: "10 SEP — 10 OCT 2026",
    elevation: "1,900M",
    status: "Live",
    summary:
      "Register and submit your idea as a deck using the official template. Cover the problem statement, proposed solution, innovation, target users, tech stack, expected impact and implementation approach.",
    detail: "Open to all registered teams.",
    link: {
      label: "PPT Template",
      href: "https://d8it4huxumps7.cloudfront.net/uploads/submissions_case/6aac310a03938_ppt_template.pptx",
    },
    image: "/timeline-1.webp",
    align: "left",
  },
  {
    id: "02",
    label: "Round 1",
    title: "Shortlisting",
    window: "11 — 12 OCT 2026",
    elevation: "2,100M",
    summary:
      "Every submitted deck is reviewed against the brief. Teams that clear the bar move on to build.",
    detail: "Shortlisted teams are notified by email.",
    image: "/timeline-5.webp",
    align: "right",
  },
  {
    id: "03",
    label: "Round 2A",
    title: "Prototype Development",
    window: "13 — 19 OCT 2026",
    elevation: "2,300M",
    summary:
      "Build a working prototype or MVP that demonstrates core functionality, technical implementation, usability and real-world impact.",
    detail:
      "Submit the prototype, a demo video, your repository link and any supporting documentation.",
    image: "/timeline-2.webp",
    align: "left",
  },
  {
    id: "04",
    label: "Round 2B",
    title: "Social Pitch & Outreach",
    window: "20 — 25 OCT 2026",
    elevation: "2,600M",
    summary:
      "Take the pitch public: a LinkedIn post presenting the idea, an Instagram Reel on why your team is coming, and a short video of the working prototype with its repository link.",
    detail:
      "Tag Eren, BuilderBase, Nexido and Web3 India in the post and the Reel. Submit all links through the designated form.",
    image: "/timeline-3.webp",
    align: "right",
  },
  {
    id: "05",
    label: "Finalists",
    title: "Finalists Announcement — Top 10",
    window: "30 OCT 2026",
    elevation: "2,900M",
    summary:
      "The ten strongest teams are announced and invited to the grand finale in Manali.",
    detail: "Selection weighs the prototype and the social pitch together.",
    image: "/timeline-6.webp",
    align: "left",
  },
  {
    id: "06",
    label: "Round 3",
    title: "Grand Finale",
    window: "20 — 21 NOV 2026 · MANALI",
    elevation: "3,200M",
    summary:
      "The 24+ hour offline finale. Finalists build, refine and present in front of mentors and judges at altitude.",
    detail:
      "Judged on innovation, technical execution, impact, scalability, problem–solution fit, usability and final presentation. Teams compete for the ₹50,000 bounty pool.",
    image: "/timeline-4.webp",
    align: "right",
  },
] as const;

export const FAQS = [
  {
    id: "01",
    question: "WHAT IS HACK IN HILLS '26?",
    answer:
      "A 24+ hour offline hackathon held in Manali, Himachal Pradesh, hosted by Galgotias University. It brings together developers, designers, marketers and Web3 and gaming creators to build with the Himalayas as the backdrop.",
  },
  {
    id: "02",
    question: "WHO CAN PARTICIPATE?",
    answer:
      "Anyone building software. Teams are 1 to 3 members, and 40+ hackers are selected for the offline finale from a registration target of 10,000+.",
  },
  {
    id: "03",
    question: "HOW DOES SELECTION WORK?",
    answer:
      "Registration and idea/PPT submission run 10 Sep – 10 Oct, with shortlisting on 11–12 Oct. Shortlisted teams build a prototype (13–19 Oct) and run a social pitch (20–25 Oct). The top 10 are announced on 30 Oct and travel to Manali for the grand finale on 20–21 Nov.",
  },
  {
    id: "04",
    question: "WHAT AM I COMPETING FOR?",
    answer:
      "A ₹50,000 bounty pool, judged on innovation, technical execution, impact, scalability, problem–solution fit, usability and final presentation — plus mentors, speakers and time with builders and ecosystem leaders.",
  },
  {
    id: "05",
    question: "WHAT DO I NEED TO BRING?",
    answer:
      "Your hardware and warm clothing. The finale runs 24+ hours at altitude in November, so pack for the cold.",
  },
] as const;
