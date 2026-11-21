import type { Metadata } from "next";
import UniverseRaffle from "@/components/universe-raffle";
import { events } from "@/config/events";
import { loadAttendees } from "@/lib/load-attendees";

const event = events["universe"];

export const metadata: Metadata = {
  title: event.title,
  description: event.description,
};

export default function Page() {
  const { attendees, isDemo } = loadAttendees(event.id);
  return <UniverseRaffle attendees={attendees} isDemo={isDemo} />;
}
