import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { eventList } from "@/config/events";

export const metadata: Metadata = {
  title: "Octo Spin — Pick your event",
  description: "Live raffle spinner for GitHub events. Pick a view to start drawing.",
};

export default function Home() {
  return (
    <div className="picker-page flex flex-col items-center min-h-screen px-4 py-12">
      <header className="w-full max-w-5xl mb-10">
        <p className="event-label text-[#8b949e] mb-2">OCTO SPIN</p>
        <h1 className="text-3xl md:text-4xl font-bold">Pick your event.</h1>
        <p className="mt-2 text-[#8b949e]">Each view has its own look and attendee list.</p>
      </header>

      <main className="grid gap-6 w-full max-w-5xl md:grid-cols-3">
        {eventList.map((event, i) => (
          <Link key={event.id} href={event.route} className="picker-card gh-card overflow-hidden flex flex-col">
            <Image
              src={event.banner}
              alt=""
              width={800}
              height={450}
              loading={i === 0 ? "eager" : "lazy"}
              sizes="(max-width: 768px) 100vw, 33vw"
              className="picker-art"
            />
            <div className="p-5 flex flex-col gap-1">
              <span className="text-lg font-bold">{event.name}</span>
              <span className="text-sm text-[#8b949e]">{event.tagline}</span>
              <span className="event-label text-[#58a6ff] mt-3">{event.route} →</span>
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
}
