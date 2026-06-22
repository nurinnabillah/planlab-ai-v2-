"use client"

import React from "react";
import { Layers, RotateCcw, AlertCircle, Database, HelpCircle, Shuffle } from "lucide-react";

interface HeaderProps {
  onReset: () => void;
  onApplyPreset: (presetName: string) => void;
  hasModifications: boolean;
  activeInterventionsCount: number;
}

export default function Header({
  onReset,
  onApplyPreset,
  hasModifications,
  activeInterventionsCount,
}: HeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md px-6 py-4 sticky top-0 z-50 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 max-w-[1700px] mx-auto">
        {/* Brand and Metadata */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg shadow-sm text-white">
            <Layers className="h-6 w-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-2xl tracking-tight text-slate-900">
                PlanLab <span className="text-blue-600">AI</span>
              </span>
              <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100">
                MVP v1.0
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Seksyen 7 Shah Alam • Urban Impact Simulator
            </p>
          </div>
        </div>

        {/* Real-time Status Center */}
        <div className="hidden lg:flex items-center gap-6 text-xs bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-600 font-mono font-medium">Prototype Active</span>
          </div>

          <div className="h-4 w-[1px] bg-slate-200"></div>

          <div className="flex items-center gap-2 font-medium">
            <Database className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Dataset:</span>
            <span className="text-blue-600 font-mono bg-blue-50 px-1.5 py-0.5 rounded border border-blue-105/30">
              seksyen7_grid_baseline.json
            </span>
          </div>

          {hasModifications && (
            <>
              <div className="h-4 w-[1px] bg-slate-200"></div>
              <div className="flex items-center gap-2">
                <span className="text-indigo-600 font-mono font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  {activeInterventionsCount} active interventions
                </span>
              </div>
            </>
          )}
        </div>

        {/* Control Actions / presets */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Sandbox Presets */}
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5 text-xs mr-2">
            <span className="text-[10px] uppercase font-mono text-slate-500 px-2.5 font-bold">
              PLAN PRESETS:
            </span>
            <button
              id="btn-preset-green"
              onClick={() => onApplyPreset("green_city")}
              className="px-2.5 py-1 rounded text-slate-600 hover:text-slate-900 hover:bg-white transition-all cursor-pointer font-semibold"
            >
              Eco-Avenue
            </button>
            <button
              id="btn-preset-transit"
              onClick={() => onApplyPreset("transit_oriented")}
              className="px-2.5 py-1 rounded text-slate-600 hover:text-slate-900 hover:bg-white transition-all cursor-pointer font-semibold"
            >
              Transit Hub
            </button>
          </div>

          <button
            id="btn-reset-sandbox"
            onClick={onReset}
            disabled={!hasModifications}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all border cursor-pointer ${
              hasModifications
                ? "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:text-slate-900 active:scale-95 shadow-sm"
                : "bg-slate-100/50 text-slate-400 border-slate-200 cursor-not-allowed"
            }`}
            title="Restore baseline cell scores and clean modifications"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Simulator
          </button>
        </div>
      </div>
    </header>
  );
}
