"use client";

import Image from "next/image";
import { GitHubLogo, RaffleStage, useRaffle, type StageTheme } from "@/components/raffle";
import { events } from "@/config/events";
import type { Attendee } from "@/lib/attendee";

const event = events.universe;

export default function UniverseRaffle({ attendees, isDemo }: { attendees: Attendee[]; isDemo: boolean }) {
  const raffle = useRaffle(attendees);

  const theme: StageTheme = {
    confettiColors: ["#54ec83", "#b18aff", "#6035ff", "#b9a900", "#e5ebe6"],
    cardClass: "draw-card",
    winnerLabelClass: "text-[#54ec83]",
    winnerNameClass: "winner-name",
    buttonReadyClass: "bg-[#54ec83] hover:bg-[#7cf29f] text-[#151b20]",
    idle: (remaining) => (
      <div className="flex flex-col items-center gap-4 text-[#8b949e]">
        <GitHubLogo className="w-16 h-16 text-[#54ec83]" />
        <p className="text-xl text-white font-semibold">The spotlight is yours.</p>
        <p className="text-sm">Ready to draw a winner!</p>
        <p className="text-sm">{remaining} people in the pool</p>
      </div>
    ),
    footer: (
      <>Powered by GitHub Copilot ✨ • {event.footerLabel} • {attendees.length} {event.countLabel}</>
    ),
  };

  return (
    <div className="universe-page flex flex-col items-center min-h-screen px-4 py-8 relative overflow-hidden">
      <header className="universe-header w-full max-w-4xl mb-8">
        <div className="universe-masthead">
          <div className="flex items-center gap-3">
            <GitHubLogo className="w-7 h-7" />
            <span className="universe-wordmark">UNIVERSE<span>&apos;</span>26</span>
          </div>
          <span className="event-label">ON THE ROAD / VANCOUVER</span>
        </div>
        <div className="universe-hero">
          <div className="universe-intro">
            <p className="event-label mb-3">GITHUB UNIVERSE ON THE ROAD 2026</p>
            <h1>Vancouver.<br /><span>Your next lucky moment.</span></h1>
            <p className="mt-4 text-[#b8c1c5]">In-person raffle / Live draw</p>
          </div>
          <Image
            src={event.banner}
            alt={event.bannerAlt}
            width={800}
            height={420}
            loading="eager"
            fetchPriority="high"
            sizes="(max-width: 640px) 100vw, 450px"
            className="universe-art"
          />
        </div>
        <div className="universe-stats flex flex-wrap gap-3 text-sm">
          <span className="gh-card px-3 py-1">👥 {attendees.length} {event.countLabel}</span>
          <span className="gh-card px-3 py-1">🎯 {raffle.remaining.length} remaining</span>
          <span className="gh-card px-3 py-1">🏆 {raffle.previousWinners.length} winners</span>
        </div>
      </header>

      <RaffleStage raffle={raffle} theme={theme} isDemo={isDemo} />
    </div>
  );
}
