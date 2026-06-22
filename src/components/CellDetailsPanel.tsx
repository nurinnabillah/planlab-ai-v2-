"use client";

import React from "react";
import { GridCell, Intervention, INTERVENTIONS } from "../../types";
import {
  Info,
  MapPin,
  Sparkles,
  Trash2,
  ArrowRightLeft,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

interface CellDetailsPanelProps {
  cell: GridCell | null;
  onClearIntervention: (gridId: string) => void;
}

export default function CellDetailsPanel({ cell, onClearIntervention }: CellDetailsPanelProps) {
  if (!cell) {
    return (
      <div className="flex flex-col h-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm p-6 justify-between">
        <div className="space-y-6 text-center my-auto py-10">
          <div className="mx-auto w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-450 shadow-sm">
            <MapPin className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-display font-bold text-slate-800 text-sm tracking-wide uppercase">
              No Grid Cell Selected
            </h3>
            <p className="text-xs text-slate-550 mt-2 max-w-xs mx-auto leading-relaxed">
              Click any land-use coordinate on the center map to inspect baseline telemetry,
              simulated changes, and geographical markers.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-650 leading-relaxed space-y-2">
          <div className="flex items-center gap-1 text-slate-800 font-bold font-mono text-[10px] uppercase">
            <Info className="h-3 w-3 text-blue-500" />
            Quick Planning Tip
          </div>
          <p>
            Choose a brush in the left toolbar (e.g., <strong>Pocket Park</strong>), then paint it
            on any <strong>Residential</strong> or <strong>Commercial</strong> cell to lower heat
            risk and improve local walkability scores.
          </p>
        </div>
      </div>
    );
  }

  // Find cell intervention, if any
  const cellIntervention = cell.interventionId
    ? INTERVENTIONS.find((i) => i.id === cell.interventionId)
    : null;

  // Let's list the scores to draw progress comparison bars
  const scoreKeys = [
    { key: "green_space_index", label: "Green Space Index", better: "high", suffix: "" },
    { key: "walkability_score", label: "Walkability Score", better: "high", suffix: "%" },
    { key: "accessibility_score", label: "Accessibility Score", better: "high", suffix: "%" },
    { key: "public_transport_score", label: "Public Transport Score", better: "high", suffix: "%" },
    { key: "heat_risk_score", label: "Heat Risk Score", better: "low", suffix: " pts" },
    { key: "noise_score", label: "Noise Score", better: "low", suffix: " dB" },
    { key: "traffic_score", label: "Traffic Score", better: "low", suffix: " Vol" },
  ];

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* Panel title */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-mono font-bold text-slate-450">
            Selected Cell
          </span>
          <h3 className="font-display font-bold text-lg text-slate-900 tracking-tight flex items-center gap-2 mt-0.5">
            <MapPin className="h-4.5 w-4.5 text-blue-500" />
            Cell ID: <span className="font-mono font-bold text-blue-600">{cell.grid_id}</span>
          </h3>
        </div>

        <span className="text-[11px] font-mono bg-white border border-slate-200 text-slate-600 px-2.5 py-1 rounded-lg shadow-sm">
          Row {cell.row} • Col {cell.col}
        </span>
      </div>

      {/* Primary specs (Coordinates and Land Use) */}
      <div className="p-4 border-b border-slate-200 space-y-3.5 bg-slate-50/20">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-slate-450 block text-[10px] uppercase font-mono font-bold">
              Latitude (Center)
            </span>
            <span className="font-mono text-slate-800 font-bold">
              {Number(cell.center_lat).toFixed(6)}° N
            </span>
          </div>
          <div>
            <span className="text-slate-455 block text-[10px] uppercase font-mono font-bold">
              Longitude (Center)
            </span>
            <span className="font-mono text-slate-800 font-bold">
              {Number(cell.center_lng).toFixed(6)}° E
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 shadow-sm">
          <div>
            <span className="text-[9px] uppercase font-mono font-bold text-slate-400">
              Primary Land Use
            </span>
            <span className="text-sm font-bold block text-slate-800 mt-0.5">{cell.land_use}</span>
          </div>

          {cell.secondary_land_use && (
            <div className="text-right">
              <span className="text-[9px] uppercase font-mono font-bold text-slate-400">
                Secondary Use
              </span>
              <span className="text-xs font-bold block text-slate-500 mt-0.5 font-sans">
                {cell.secondary_land_use}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Active simulation intervention status block */}
      <div className="p-4 border-b border-slate-200">
        <h4 className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 mb-2">
          Sandbox Operations
        </h4>

        {cellIntervention ? (
          <div className="p-3.5 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50/50 to-indigo-50/30">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5 text-blue-600 font-bold text-xs">
                <Sparkles className="h-3.5 w-3.5" />
                Active Intervention
              </div>

              <button
                id="btn-clear-cell"
                onClick={() => onClearIntervention(cell.grid_id)}
                className="p-1 rounded bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-200 cursor-pointer shadow-sm transition-colors"
                title="Restore Baseline (delete modification)"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            <h5 className="font-bold text-slate-900 mt-1.5">{cellIntervention.name}</h5>
            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
              {cellIntervention.description}
            </p>
          </div>
        ) : (
          <div className="text-xs text-slate-550 bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-2">
            <Info className="h-4 w-4 text-slate-400 flex-shrink-0" />
            <p>
              No modifications active. Currently running on real OpenDOSM-calibrated baseline stats.
            </p>
          </div>
        )}
      </div>

      {/* Score details comparitor scrolling area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scroll">
        <h4 className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 mb-2">
          Cell Impact Scores
        </h4>

        <div className="space-y-4">
          {scoreKeys.map(({ key, label, better, suffix }) => {
            const rawBaseline = (cell as any)[key] as number;

            // Calculate active score adjusted by delta
            let activeScore = rawBaseline;
            let delta = 0;
            if (cellIntervention?.impact) {
              delta = (cellIntervention.impact as any)[key] || 0;
              activeScore = Math.max(0, Math.min(100, rawBaseline + delta));
            }

            const isPositiveValue = better === "high" ? delta > 0 : delta < 0;
            const isNegativeValue = better === "high" ? delta < 0 : delta > 0;

            return (
              <div key={key} className="space-y-1.5">
                {/* Metric Title and Stats */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{label}</span>

                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-450 font-mono text-[10px]" title="Baseline">
                      {rawBaseline}
                    </span>
                    {delta !== 0 && (
                      <>
                        <ArrowRight className="h-2.5 w-2.5 text-slate-400" />
                        <span className="font-mono font-extrabold text-slate-900">
                          {activeScore}
                        </span>

                        <span
                          className={`text-[10px] font-mono rounded px-1.5 py-0.5 border font-bold ${
                            isPositiveValue
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : isNegativeValue
                                ? "bg-rose-50 text-rose-700 border-rose-100"
                                : "bg-slate-100 text-slate-500 border-slate-200"
                          }`}
                        >
                          {delta > 0 ? `+${delta}` : delta}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Progress bar scale */}
                <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  {/* Baseline fill */}
                  <div
                    className="absolute top-0 bottom-0 left-0 bg-slate-400 transition-all rounded-full"
                    style={{ width: `${rawBaseline}%` }}
                  />

                  {/* Delta positive overlap */}
                  {delta > 0 && (
                    <div
                      className="absolute top-0 bottom-0 bg-emerald-500 transition-all opacity-90"
                      style={{
                        left: `${rawBaseline}%`,
                        width: `${Math.min(100 - rawBaseline, delta)}%`,
                      }}
                    />
                  )}

                  {/* Delta negative decline overlap */}
                  {delta < 0 && (
                    <div
                      className="absolute top-0 bottom-0 bg-rose-500 transition-all opacity-90"
                      style={{
                        left: `${Math.max(0, rawBaseline + delta)}%`,
                        width: `${Math.abs(delta)}%`,
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
