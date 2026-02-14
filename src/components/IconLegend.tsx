import { Radiation, CheckCircle, XCircle } from "lucide-react";

export function IconLegend() {
  return (
    <div className="bg-slate-50 rounded-lg p-4 sm:p-6 text-left">
      <h3 className="font-semibold mb-3 sm:mb-4 text-xs sm:text-sm">Leyenda de iconos:</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs">
        <div>
          <p className="font-medium mb-2">Twitter/X</p>
          <ul className="space-y-2 text-slate-600">
            <li className="flex items-center gap-2">
              <Radiation className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600 flex-shrink-0" />
              <span>Sin cuenta o inactiva</span>
            </li>
            <li className="flex items-center gap-2">
              <Radiation className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 flex-shrink-0" />
              <span>Cuenta activa</span>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-medium mb-2">Bluesky</p>
          <ul className="space-y-2 text-slate-600">
            <li className="flex items-center gap-2">
              <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-slate-300 flex-shrink-0" />
              <span>Sin cuenta</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-amber-400 flex-shrink-0" />
              <span>Cuenta inactiva</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600 flex-shrink-0" />
              <span>Cuenta activa</span>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-medium mb-2">Mastodon</p>
          <ul className="space-y-2 text-slate-600">
            <li className="flex items-center gap-2">
              <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 flex-shrink-0" />
              <span>Sin cuenta</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-amber-400 flex-shrink-0" />
              <span>Cuenta inactiva</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600 flex-shrink-0" />
              <span>Cuenta activa</span>
            </li>
          </ul>
        </div>
      </div>
      <p className="mt-3 sm:mt-4 text-xs text-slate-500">
        Los iconos de Twitter, Bluesky y Mastodon son clickables y te llevan al perfil de la entidad (cuando tienen cuenta).
      </p>
    </div>
  );
}
