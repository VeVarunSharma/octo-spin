export type EventId = "universe" | "dev-days" | "build-days";

// next/image does not prefix basePath on src, so static assets need it added (e.g. GitHub Pages).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const asset = (path: string) => `${basePath}${path}`;

export interface EventConfig {
  id: EventId;
  route: `/${string}`;
  name: string;
  tagline: string;
  banner: string;
  bannerAlt: string;
  title: string;
  description: string;
  /** Shown next to the attendee count, e.g. "82 in-person registrants". */
  countLabel: string;
  /** Short location or audience line shown in the footer. */
  footerLabel: string;
  /** Build Days only: the customer hosting the in-account event. */
  customerName?: string;
}

export const events: Record<EventId, EventConfig> = {
  universe: {
    id: "universe",
    route: "/universe",
    name: "GitHub Universe on the Road",
    tagline: "Vancouver / In-person raffle",
    banner: asset("/universe-26-banner.png"),
    bannerAlt: "Universe '26 with a colorful row of Octocats",
    title: "Universe '26 Vancouver — In-person Raffle",
    description: "GitHub Universe on the Road Vancouver — live raffle for in-person registrants",
    countLabel: "in-person registrants",
    footerLabel: "Vancouver",
  },
  "dev-days": {
    id: "dev-days",
    route: "/dev-days",
    name: "GitHub Copilot Dev Days",
    tagline: "Canada / Live raffle draw",
    banner: asset("/dev-days-banner.png"),
    bannerAlt: "GitHub Copilot Dev Days Canada banner with the Copilot mascot",
    title: "GitHub Copilot Dev Days Canada — Raffle",
    description: "GitHub Copilot Dev Days Canada — live raffle for checked-in attendees",
    countLabel: "registered",
    footerLabel: "Canada",
  },
  "build-days": {
    id: "build-days",
    route: "/build-days",
    name: "Microsoft + GitHub Build Days",
    tagline: "In-account workshop / Live raffle",
    banner: asset("/build-days-banner.png"),
    bannerAlt: "Microsoft and GitHub Build Days banner with colorful squares and branch lines",
    title: "Build Days — Raffle",
    description: "Microsoft + GitHub Build Days — live raffle for workshop attendees",
    countLabel: "builders",
    footerLabel: "In-account Build Day",
    // Change this before each in-account event.
    customerName: "Your Company",
  },
};

export const eventList: EventConfig[] = [events.universe, events["dev-days"], events["build-days"]];
