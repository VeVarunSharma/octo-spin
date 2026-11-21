import type { Metadata } from "next";
import DevDaysRaffle from "@/components/dev-days-raffle";
import { events } from "@/config/events";
import { loadAttendees } from "@/lib/load-attendees";

const event = events["dev-days"];

export const metadata: Metadata = {
  title: event.title,
  description: event.description,
};

export default function Page() {
  const { attendees, isDemo } = loadAttendees(event.id);
  return <DevDaysRaffle attendees={attendees} isDemo={isDemo} />;
}
