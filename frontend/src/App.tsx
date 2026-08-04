import React from "react";
import { ETHIOPIAN_REGIONS, ADDIS_ABABA_SUBCITIES } from "@zero-delala/shared";
import { Building2, MapPin, CheckCircle } from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl border border-slate-700 p-6 shadow-xl text-center space-y-4">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <Building2 className="w-8 h-8" />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Zero Delala (ዜሮ ደላላ)
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Ethiopian Real Estate Telegram Mini App
          </p>
        </div>

        <div className="pt-2 border-t border-slate-700/50 flex flex-col gap-2 text-left">
          <div className="flex items-center justify-between bg-slate-900/50 p-3 rounded-lg border border-slate-700/30">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-400" /> Supported Regions
            </span>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
              {ETHIOPIAN_REGIONS.length} Regions
            </span>
          </div>

          <div className="flex items-center justify-between bg-slate-900/50 p-3 rounded-lg border border-slate-700/30">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-blue-400" /> Addis Ababa
              Sub-Cities
            </span>
            <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
              {ADDIS_ABABA_SUBCITIES.length} Sub-Cities
            </span>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-center gap-2 text-xs text-slate-400">
          <CheckCircle className="w-4 h-4 text-emerald-400" /> Shared Monorepo
          Package Verified
        </div>
      </div>
    </div>
  );
}
