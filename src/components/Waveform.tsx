'use client';

interface WaveformProps {
  bars?: number;
  barWidth?: number;
  className?: string;
}

/**
 * Animated sound-wave visualisation: a row of bars whose heights follow a
 * sine curve, each pulsing with a staggered delay for a flowing wave effect.
 */
export default function Waveform({ bars = 32, barWidth = 3, className = '' }: WaveformProps) {
  return (
    <div className={`flex items-center gap-[3px] ${className}`} aria-hidden="true">
      {Array.from({ length: bars }).map((_, i) => {
        // Base height follows a sine curve so the bars form a wave shape
        const base = 0.3 + 0.7 * Math.abs(Math.sin((i / bars) * Math.PI * 2));
        return (
          <span
            key={i}
            className="wave-bar"
            style={{
              width: `${barWidth}px`,
              height: `${Math.round(base * 100)}%`,
              animationDelay: `${(i % 12) * -0.12}s`,
              animationDuration: `${1.1 + (i % 5) * 0.18}s`,
            }}
          />
        );
      })}
      <style jsx>{`
        .wave-bar {
          border-radius: 9999px;
          background: linear-gradient(to top, #f43f5e, #fb7185);
          animation: wave-pulse ease-in-out infinite;
        }
        @keyframes wave-pulse {
          0%, 100% {
            transform: scaleY(0.35);
          }
          50% {
            transform: scaleY(1);
          }
        }
      `}</style>
    </div>
  );
}
