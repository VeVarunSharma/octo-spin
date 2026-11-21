import type { Metadata } from "next";
import BuildDaysRaffle from "@/components/build-days-raffle";
import { events } from "@/config/events";
import { loadAttendees } from "@/lib/load-attendees";

const event = events["build-days"];

export const metadata: Metadata = {
  title: event.title,
  description: event.description,
};

export default function Page() {
  const { attendees, isDemo } = loadAttendees(event.id);
  return <BuildDaysRaffle attendees={attendees} isDemo={isDemo} />;
}
