"use client";

import Image from "next/image";
import { GitHubLogo, RaffleStage, useRaffle, type StageTheme } from "@/components/raffle";
import { events } from "@/config/events";
import type { Attendee } from "@/lib/attendee";

const event = events["dev-days"];

export default function DevDaysRaffle({ attendees, isDemo }: { attendees: Attendee[]; isDemo: boolean }) {
  const raffle = useRaffle(attendees);

  const theme: StageTheme = {
    confettiColors: ["#238636", "#8b5cf6", "#ec4899", "#58a6ff", "#f59e0b", "#ef4444", "#10b981"],
    cardClass: "",
    winnerLabelClass: "text-[#3fb950]",
    winnerNameClass: "bg-gradient-to-r from-[#f59e0b] via-[#ec4899] to-[#8b5cf6] bg-clip-text text-transparent",
    buttonReadyClass: "bg-[#238636] hover:bg-[#2ea043] text-white",
    idle: (remaining) => (
      <div className="flex flex-col items-center gap-4 text-[#8b949e]">
        <GitHubLogo className="w-16 h-16 opacity-20" />
        <p className="text-xl">Ready to draw a winner!</p>
        <p className="text-sm">{remaining} people in the pool</p>
      </div>
    ),
    footer: (
      <>Powered by GitHub Copilot ✨ • {event.footerLabel} • {attendees.length} checked-in attendees</>
    ),
  };

  return (
    <div className="theme-dev-days flex flex-col items-center min-h-screen px-4 py-8 relative overflow-hidden">
      <header className="flex flex-col items-center gap-4 mb-8 w-full max-w-4xl">
        <Image
          src={event.banner}
          alt={event.bannerAlt}
          width={1920}
          height={1080}
          loading="eager"
          fetchPriority="high"
          sizes="(max-width: 896px) 100vw, 896px"
          className="dev-days-banner"
        />
        <h1 className="text-3xl md:text-5xl font-bold text-center bg-gradient-to-r from-[#58a6ff] via-[#8b5cf6] to-[#ec4899] bg-clip-text text-transparent">
          GitHub Copilot Dev Days Canada
        </h1>
        <p className="text-[#8b949e] text-lg">{event.tagline}</p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-[#8b949e]">
          <span className="gh-card px-3 py-1">👥 {attendees.length} {event.countLabel}</span>
          <span className="gh-card px-3 py-1">🎯 {raffle.remaining.length} remaining</span>
          <span className="gh-card px-3 py-1">🏆 {raffle.previousWinners.length} winners</span>
        </div>
      </header>

      <RaffleStage raffle={raffle} theme={theme} isDemo={isDemo} />
    </div>
  );
}
