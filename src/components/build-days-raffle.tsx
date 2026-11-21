"use client";

import Image from "next/image";
import { GitHubLogo, RaffleStage, useRaffle, type StageTheme } from "@/components/raffle";
import { events } from "@/config/events";
import type { Attendee } from "@/lib/attendee";

const event = events["build-days"];

export default function BuildDaysRaffle({ attendees, isDemo }: { attendees: Attendee[]; isDemo: boolean }) {
  const raffle = useRaffle(attendees);

  const theme: StageTheme = {
    confettiColors: ["#f25022", "#7fba00", "#00a4ef", "#ffb900", "#a371f7", "#3fb950"],
    cardClass: "build-card",
    winnerLabelClass: "text-[#7fba00]",
    winnerNameClass: "build-winner-name",
    buttonReadyClass: "bg-[#a371f7] hover:bg-[#b58cff] text-white",
    idle: (remaining) => (
      <div className="flex flex-col items-center gap-4 text-[#8b949e]">
        <GitHubLogo className="w-16 h-16 text-[#a371f7]" />
        <p className="text-xl text-white font-semibold">Ship it. Then win it.</p>
        <p className="text-sm">Ready to draw a winner!</p>
        <p className="text-sm">{remaining} people in the pool</p>
      </div>
    ),
    footer: (
      <>Powered by GitHub Copilot ✨ • {event.footerLabel} at {event.customerName} • {attendees.length} {event.countLabel}</>
    ),
  };

  return (
    <div className="theme-build-days flex flex-col items-center min-h-screen px-4 py-8 relative overflow-hidden">
      <header className="build-header w-full max-w-4xl mb-8">
        <Image
          src={event.banner}
          alt={event.bannerAlt}
          width={1920}
          height={1080}
          loading="eager"
          fetchPriority="high"
          sizes="(max-width: 896px) 100vw, 896px"
          className="build-banner"
        />
        <div className="build-intro">
          <div>
            <p className="event-label build-label mb-2">IN-ACCOUNT BUILD DAY</p>
            <h1>
              {event.customerName} <span>× GitHub</span>
            </h1>
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="gh-card px-3 py-1">👥 {attendees.length} {event.countLabel}</span>
            <span className="gh-card px-3 py-1">🎯 {raffle.remaining.length} remaining</span>
            <span className="gh-card px-3 py-1">🏆 {raffle.previousWinners.length} winners</span>
          </div>
        </div>
      </header>

      <RaffleStage raffle={raffle} theme={theme} isDemo={isDemo} />
    </div>
  );
}
