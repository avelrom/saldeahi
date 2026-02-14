import * as React from "react";
import { cn } from "@/lib/utils";

type Segment = {
  label: string;
  value: number;
  colorClass?: string;
};

type Props = {
  segments: Segment[];
  total?: number;
  height?: number;
  roundedClass?: string;
  ariaLabel?: string;
  className?: string;
  trackClassName?: string;
};

export function Mainbar({
  segments,
  total,
  height = 14,
  roundedClass = "rounded-full",
  ariaLabel,
  className,
  trackClassName,
}: Props) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  const sum = total ?? segments.reduce((acc, s) => acc + (Number(s.value) || 0), 0);
  const aria = ariaLabel ?? segments.map((s) => `${s.label}: ${s.value}`).join(", ");

  return (
    <div className={cn("w-full", className)}>
      <div
        role="img"
        aria-label={aria}
        className={cn(
          "w-full overflow-hidden bg-muted ring-1 ring-border",
          roundedClass,
          trackClassName
        )}
        style={{ height }}
      >
        <div className="flex h-full">
          {segments.map((seg, i) => {
            const pct = sum > 0 ? (seg.value / sum) * 100 : 0;
            return (
              <div
                key={`${seg.label}-${i}`}
                className={cn(
                  "relative h-full transition-[width,filter] ease-[cubic-bezier(.16,1,.3,1)] hover:brightness-110 hover:saturate-125",
                  seg.colorClass ?? (
                    i === 0 ? "bg-emerald-600" :
                    i === 1 ? "bg-amber-500"   :
                    i === 2 ? "bg-red-600"      :
                               "bg-slate-500"
                  )
                )}
                aria-hidden="true"
                style={{
                  width: mounted ? `${pct}%` : "0%",
                  transitionDuration: "800ms",
                  transitionDelay: `${90 * i}ms`,
                }}
              />
            );
          })}
        </div>
      </div>

      <ul className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
        {segments.map((seg, i) => {
          const pct = sum > 0 ? Math.round((seg.value / sum) * 100) : 0;
          const dotClass = seg.colorClass ?? (
            i === 0 ? "bg-emerald-600" :
            i === 1 ? "bg-amber-500"   :
            i === 2 ? "bg-red-600"     :
                       "bg-slate-500"
          );
          return (
            <li key={`legend-${seg.label}-${i}`} className="inline-flex items-center gap-2">
              <span className={cn("inline-block size-2.5 rounded-full", dotClass)} aria-hidden="true" />
              <span className="font-medium">{seg.label}</span>
              <span className="text-muted-foreground">({pct}%)</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
