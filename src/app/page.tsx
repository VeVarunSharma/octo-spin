"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import attendeesData from "../../data/attendees.json";

interface Attendee {
  name: string;
  github: string;
  company: string;
}

const attendees: Attendee[] = attendeesData as Attendee[];

function GitHubLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function Confetti() {
  const colors = ["#238636", "#8b5cf6", "#ec4899", "#58a6ff", "#f59e0b", "#ef4444", "#10b981"];
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    color: colors[Math.floor(Math.random() * colors.length)],
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 3,
    size: 6 + Math.random() * 10,
    shape: Math.random() > 0.5 ? "rounded-full" : "rounded-sm",
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map((p) => (
        <div
          key={p.id}
          className={`confetti-piece ${p.shape}`}
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const [isDrawing, setIsDrawing] = useState(false);
  const [winner, setWinner] = useState<Attendee | null>(null);
  const [previousWinners, setPreviousWinners] = useState<Attendee[]>([]);
  const [shuffleDisplay, setShuffleDisplay] = useState<Attendee | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);

  const remaining = attendees.filter(
    (a) => !previousWinners.some((w) => w.github === a.github)
  );

  const playTick = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800 + Math.random() * 400;
      osc.type = "square";
      gain.gain.value = 0.05;
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch {
      // Audio not available
    }
  }, []);

  const playWinSound = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      const ctx = audioContextRef.current;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = "sine";
        gain.gain.value = 0.1;
        osc.start(ctx.currentTime + i * 0.15);
        osc.stop(ctx.currentTime + i * 0.15 + 0.3);
      });
    } catch {
      // Audio not available
    }
  }, []);

  const drawWinner = useCallback(() => {
    if (remaining.length === 0 || isDrawing) return;

    setIsDrawing(true);
    setWinner(null);
    setShowConfetti(false);

    // Clear any prior timeouts
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    const totalTicks = 40;
    const baseSpeed = 50;
    let elapsed = 0;

    // Pick the winner up front (crypto-random if available)
    const winnerIdx = Math.floor(Math.random() * remaining.length);
    const selected = remaining[winnerIdx];

    for (let i = 0; i < totalTicks; i++) {
      const delay = baseSpeed + i * 4;
      elapsed += delay;
      const isLast = i === totalTicks - 1;

      const t = setTimeout(() => {
        if (isLast) {
          setShuffleDisplay(null);
          setWinner(selected);
          setPreviousWinners((prev) => [...prev, selected]);
          setIsDrawing(false);
          setShowConfetti(true);
          playWinSound();
          setTimeout(() => setShowConfetti(false), 5000);
        } else {
          const randomIdx = Math.floor(Math.random() * remaining.length);
          setShuffleDisplay(remaining[randomIdx]);
          playTick();
        }
      }, elapsed);

      timeoutsRef.current.push(t);
    }
  }, [remaining, isDrawing, playTick, playWinSound]);

  const resetRaffle = () => {
    setPreviousWinners([]);
    setWinner(null);
    setShuffleDisplay(null);
    setShowConfetti(false);
  };

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-8 relative overflow-hidden">
      {showConfetti && <Confetti />}

      {/* Header */}
      <header className="flex flex-col items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <GitHubLogo className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-center bg-gradient-to-r from-[#58a6ff] via-[#8b5cf6] to-[#ec4899] bg-clip-text text-transparent">
          GitHub Copilot Dev Days
        </h1>
        <p className="text-[#8b949e] text-lg">Edmonton 🇨🇦 — Live Raffle Draw</p>
        <div className="flex gap-4 text-sm text-[#8b949e]">
          <span className="gh-card px-3 py-1">
            👥 {attendees.length} registered
          </span>
          <span className="gh-card px-3 py-1">
            🎯 {remaining.length} remaining
          </span>
          <span className="gh-card px-3 py-1">
            🏆 {previousWinners.length} winners
          </span>
        </div>
      </header>

      {/* Main Draw Area */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl gap-8">
        {/* Display Card */}
        <div className="gh-card w-full p-8 md:p-12 text-center min-h-[280px] flex flex-col items-center justify-center relative overflow-hidden">
          {isDrawing && shuffleDisplay && (
            <div className="slot-shuffle">
              <p className="text-2xl md:text-4xl font-bold text-[#8b949e]">
                {shuffleDisplay.name}
              </p>
              <p className="text-lg text-[#6e7681] mt-2">
                @{shuffleDisplay.github}
              </p>
            </div>
          )}

          {!isDrawing && winner && (
            <div className="winner-reveal">
              <p className="text-sm uppercase tracking-widest text-[#238636] mb-4 font-bold">
                🎉 Winner! 🎉
              </p>
              <p className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-[#f59e0b] via-[#ec4899] to-[#8b5cf6] bg-clip-text text-transparent mb-4">
                {winner.name}
              </p>
              {winner.github && !["NA", "none", "N/A", "n/a"].includes(winner.github) && (
                <a
                  href={`https://github.com/${winner.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#58a6ff] hover:underline text-xl mb-3"
                >
                  <GitHubLogo className="w-5 h-5" />
                  @{winner.github}
                </a>
              )}
              {winner.company && (
                <p className="text-[#8b949e] text-lg mt-1">
                  🏢 {winner.company}
                </p>
              )}
            </div>
          )}

          {!isDrawing && !winner && (
            <div className="flex flex-col items-center gap-4 text-[#8b949e]">
              <GitHubLogo className="w-16 h-16 opacity-20" />
              <p className="text-xl">Ready to draw a winner!</p>
              <p className="text-sm">{remaining.length} people in the pool</p>
            </div>
          )}
        </div>

        {/* Draw Button */}
        <button
          onClick={drawWinner}
          disabled={isDrawing || remaining.length === 0}
          className={`
            relative px-12 py-5 rounded-xl text-xl font-bold transition-all duration-300
            ${
              isDrawing
                ? "bg-[#30363d] text-[#8b949e] cursor-not-allowed"
                : remaining.length === 0
                ? "bg-[#30363d] text-[#8b949e] cursor-not-allowed"
                : "bg-[#238636] hover:bg-[#2ea043] text-white glow-pulse cursor-pointer hover:scale-105 active:scale-95"
            }
          `}
        >
          {isDrawing ? (
            <span className="flex items-center gap-3">
              <svg className="w-5 h-5 spin" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              Drawing...
            </span>
          ) : remaining.length === 0 ? (
            "All winners drawn! 🎊"
          ) : (
            "🎰 Draw Winner"
          )}
        </button>

        {remaining.length === 0 && previousWinners.length > 0 && (
          <button
            onClick={resetRaffle}
            className="px-6 py-2 rounded-lg text-sm text-[#8b949e] border border-[#30363d] hover:border-[#8b949e] transition-colors cursor-pointer"
          >
            Reset Raffle
          </button>
        )}
      </main>

      {/* Previous Winners */}
      {previousWinners.length > 0 && (
        <section className="w-full max-w-2xl mt-8">
          <h2 className="text-lg font-bold text-[#8b949e] mb-4 flex items-center gap-2">
            <span>🏆</span> Winners ({previousWinners.length})
          </h2>
          <div className="grid gap-2">
            {[...previousWinners].reverse().map((w, i) => (
              <div
                key={w.github + i}
                className="gh-card px-4 py-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[#8b949e] text-sm w-6">
                    #{previousWinners.length - i}
                  </span>
                  <span className="font-bold">{w.name}</span>
                  {w.github && !["NA", "none", "N/A", "n/a"].includes(w.github) && (
                    <span className="text-[#58a6ff] text-sm">@{w.github}</span>
                  )}
                </div>
                <span className="text-[#8b949e] text-sm">{w.company}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-8 pb-4 text-center text-[#6e7681] text-xs">
        Powered by GitHub Copilot ✨ • {attendees.length} checked-in attendees
      </footer>
    </div>
  );
}
