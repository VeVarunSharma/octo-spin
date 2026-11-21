import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { EventId } from "@/config/events";
import type { Attendee } from "./attendee";

export interface AttendeeList {
  attendees: Attendee[];
  isDemo: boolean;
}

/**
 * Reads the private list from data/<id>.json (gitignored).
 * Falls back to the committed faux list in src/data/demo/<id>.json.
 * Only call this from server components.
 */
export function loadAttendees(id: EventId): AttendeeList {
  const realPath = path.join(process.cwd(), "data", `${id}.json`);
  if (existsSync(realPath)) {
    return { attendees: JSON.parse(readFileSync(realPath, "utf8")), isDemo: false };
  }
  const demoPath = path.join(process.cwd(), "src", "data", "demo", `${id}.json`);
  return { attendees: JSON.parse(readFileSync(demoPath, "utf8")), isDemo: true };
}
