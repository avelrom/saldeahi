import { useState, useEffect } from "react";
import { Mainbar } from "@/components/Mainbar";
import { Info } from "lucide-react";

interface MainbarWrapperProps {
  initialStats: {
    enX: number;
    fueraDeX: number;
    mastodon: number;
    bluesky: number;
    sinAlternativa: number;
  };
}

export function MainbarWrapper({ initialStats }: MainbarWrapperProps) {
  const [stats, setStats] = useState(initialStats);

  useEffect(() => {
    const handleStatsChange = (e: any) => {
      setStats(e.detail);
    };

    window.addEventListener('stats-change', handleStatsChange);

    return () => {
      window.removeEventListener('stats-change', handleStatsChange);
    };
  }, []);

  return (
    <>
      <div className="space-y-4 sm:space-y-6 w-full">
        {/* Barra 1: Estado en X */}
        <div className="w-full">
          <h3 className="text-xs sm:text-sm font-medium text-slate-700 mb-2 text-center">
            ¿Siguen en X?
          </h3>
          <div className="mainbar-container w-full max-w-full overflow-hidden">
            <Mainbar
              className="mt-2"
              trackClassName="ring-0 shadow-none"
              segments={[
                { label: "Fuera de X", value: stats.fueraDeX, colorClass: "bg-emerald-600" },
                { label: "Siguen en X",       value: stats.enX,      colorClass: "bg-red-500"     },
              ]}
              ariaLabel={`${stats.fueraDeX} fuera de X, ${stats.enX} siguen en X`}
              height={14}
              roundedClass="rounded-full"
            />
          </div>
        </div>

        {/* Barra 2: Alternativas federadas */}
        <div className="w-full">
         <div className="flex items-center justify-center gap-1 mb-2">
  <h3 className="text-xs sm:text-sm font-medium text-slate-700 text-center leading-none">
    Con alternativas federadas
  </h3>

  <div className="group relative">
    <Info className="h-4 w-4 text-slate-400 cursor-help align-middle" />

    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-64 p-3 bg-slate-800 text-white text-xs rounded shadow-lg z-10">
      <strong>Bluesky</strong> usa AT Protocol, que actualmente no es federado al 100% como ActivityPub (Mastodon).
    </div>
  </div>
</div>
          <div className="mainbar-container w-full max-w-full overflow-hidden">
            <Mainbar
              className="mt-2"
              trackClassName="ring-0 shadow-none"
              segments={[
                { label: "Mastodon",       value: stats.mastodon,       colorClass: "bg-purple-600" },
                { label: "Bluesky",        value: stats.bluesky,        colorClass: "bg-sky-500"    },
                { label: "Sin alternativa", value: stats.sinAlternativa, colorClass: "bg-slate-300"  },
              ]}
              ariaLabel={`${stats.mastodon} en Mastodon, ${stats.bluesky} en Bluesky, ${stats.sinAlternativa} sin alternativa`}
              height={14}
              roundedClass="rounded-full"
            />
          </div>
        </div>
      </div>
    </>
  );
}