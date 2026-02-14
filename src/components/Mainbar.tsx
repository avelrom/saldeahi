import * as React from "react";
import { cn } from "@/lib/utils";

type Segment = {
  label: string;
  value: number;        // porcentaje o valor relativo
  colorClass?: string;  // tailwind class para el color del segmento
};

type Props = {
  /** Selector del elemento cuyo ancho quieres igualar (p.ej. "#hero-h2") */
  targetSelector: string;
  /** Segmentos (si 'total' no se pasa, se suma 'value') */
  segments: Segment[];
  /** Valor total opcional; si no se pasa, se usa la suma de 'value' */
  total?: number;
  /** Alto en px (S=12/14, M=16, L=20). Por defecto 14 */
  height?: number;
  /** Radio del track (p. ej., "rounded-full"). Por defecto "rounded-full" */
  roundedClass?: string;
  /** Texto accesible resumido para SR; si no se pasa se genera a partir de los segmentos */
  ariaLabel?: string;
  /** Clases extras para el wrapper externo (permite mt-6, etc.) */
  className?: string;
  /** Clases extra para el track (p.ej. "ring-0 shadow-none" para quitar “borde”) */
  trackClassName?: string;
};

export function Mainbar({
  targetSelector,
  segments,
  total,
  height = 14,
  roundedClass = "rounded-full",
  ariaLabel,
  className,
  trackClassName,
}: Props) {
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const [matchedWidth, setMatchedWidth] = React.useState<number | null>(null);
  const [mounted, setMounted] = React.useState(false);

  // 1) Igualar el ancho al target usando ResizeObserver
  React.useEffect(() => {
    const target = document.querySelector<HTMLElement>(targetSelector);
    const wrap = wrapRef.current;
    if (!target || !wrap) return;

    const apply = () => {
      const w = Math.ceil(target.getBoundingClientRect().width);
      setMatchedWidth(w);
    };
    apply();

    const ro = new ResizeObserver(apply);
    ro.observe(target);
    window.addEventListener("resize", apply, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", apply as any);
    };
  }, [targetSelector]);

  // 2) Animación de entrada (width: 0 → %)
  React.useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  // 3) Cálculos
  const sum = total ?? segments.reduce((acc, s) => acc + (Number(s.value) || 0), 0);
  const aria = ariaLabel ?? segments.map((s) => `${s.label}: ${s.value}`).join(", ");

  return (
    <div
      ref={wrapRef}
      className={cn("mx-auto", className)}
      style={matchedWidth ? { width: `${matchedWidth}px` } : undefined}
    >
      {/* Track */}
      <div
        role="img"
        aria-label={aria}
        className={cn(
          "w-full overflow-hidden bg-muted shadow-xs ring-1 ring-border", // puedes quitar “borde” con trackClassName="ring-0 shadow-none"
          roundedClass,
          trackClassName
        )}
        style={{ height }}
      >
        <div className="flex h-full">
          {segments.map((seg, i) => {
            const pct = sum > 0 ? (seg.value / sum) * 100 : 0;
            const delay = 90 * i; // stagger sutil
            return (
              <div
                key={`${seg.label}-${i}`}
                className={cn(
                  "relative h-full transition-[width,filter] ease-[cubic-bezier(.16,1,.3,1)]",
                  seg.colorClass ??
                    (i === 0
                      ? "bg-emerald-600" // verde
                      : i === 1
                      ? "bg-amber-500"   // amarillo
                      : i === 2
                      ? "bg-red-600"     // rojo
                      : "bg-slate-500"), // gris
                  "hover:brightness-110 hover:saturate-125"
                )}
                aria-hidden="true"
                style={{
                  width: mounted ? `${pct}%` : "0%",
                  transitionDuration: "800ms",
                  transitionDelay: `${delay}ms`,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* LEYENDA centrada */}
      <ul className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
        {segments.map((seg, i) => {
          const pct = sum > 0 ? Math.round((seg.value / sum) * 100) : 0;
          const dotClass =
            seg.colorClass ??
            (i === 0
              ? "bg-emerald-600"
              : i === 1
              ? "bg-amber-500"
              : i === 2
              ? "bg-red-600"
              : "bg-slate-500");
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