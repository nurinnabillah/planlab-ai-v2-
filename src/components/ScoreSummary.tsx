"use client"

import React from "react";
import { GridCell, INTERVENTIONS } from "../../types";
import * as Icons from "lucide-react";

interface ScoreSummaryProps {
  cells: GridCell[];
}

export default function ScoreSummary({ cells }: ScoreSummaryProps) {
  // Calculate baselines (unaltered values)
  const count = cells.length || 1;

  const calculateAverages = (items: GridCell[], applyInterventions: boolean) => {
    let totalGreen = 0;
    let totalWalk = 0;
    let totalAccess = 0;
    let totalTransit = 0;
    let totalHeat = 0;
    let totalNoise = 0;
    let totalTraffic = 0;

    items.forEach((cell) => {
      let g = cell.green_space_index;
      let w = cell.walkability_score;
      let a = cell.accessibility_score;
      let t_trans = cell.public_transport_score;
      let h = cell.heat_risk_score;
      let n = cell.noise_score;
      let c_traf = cell.traffic_score;

      if (applyInterventions && cell.interventionId) {
        const intervention = INTERVENTIONS.find((i) => i.id === cell.interventionId);
        if (intervention?.impact) {
          const imp = intervention.impact;
          g = Math.max(0, Math.min(100, g + (imp.green_space_index || 0)));
          w = Math.max(0, Math.min(100, w + (imp.walkability_score || 0)));
          a = Math.max(0, Math.min(100, a + (imp.accessibility_score || 0)));
          t_trans = Math.max(0, Math.min(100, t_trans + (imp.public_transport_score || 0)));
          h = Math.max(0, Math.min(100, h + (imp.heat_risk_score || 0)));
          n = Math.max(0, Math.min(100, n + (imp.noise_score || 0)));
          c_traf = Math.max(0, Math.min(100, c_traf + (imp.traffic_score || 0)));
        }
      }

      totalGreen += g;
      totalWalk += w;
      totalAccess += a;
      totalTransit += t_trans;
      totalHeat += h;
      totalNoise += n;
      totalTraffic += c_traf;
    });

    return {
      green_space_index: totalGreen / count,
      walkability_score: totalWalk / count,
      accessibility_score: totalAccess / count,
      public_transport_score: totalTransit / count,
      heat_risk_score: totalHeat / count,
      noise_score: totalNoise / count,
      traffic_score: totalTraffic / count,
    };
  };

  const baselines = calculateAverages(cells, false);
  const simulateds = calculateAverages(cells, true);

  // Cards metadata
  const cards = [
    {
      key: "green_space_index",
      label: "Green Space Index",
      baseline: baselines.green_space_index,
      simulated: simulateds.green_space_index,
      better: "high",
      icon: "Trees",
      description: "Average ecological/canopy score",
      theme: "emerald",
    },
    {
      key: "walkability_score",
      label: "Walkability Index",
      baseline: baselines.walkability_score,
      simulated: simulateds.walkability_score,
      better: "high",
      icon: "Footprints",
      description: "Pedestrian accessibility & safety",
      theme: "teal",
    },
    {
      key: "accessibility_score",
      label: "Public Accessibility",
      baseline: baselines.accessibility_score,
      simulated: simulateds.accessibility_score,
      better: "high",
      icon: "Signpost",
      description: "Local mixed destination reach",
      theme: "cyan",
    },
    {
      key: "public_transport_score",
      label: "Transit Efficiency",
      baseline: baselines.public_transport_score,
      simulated: simulateds.public_transport_score,
      better: "high",
      icon: "Bus",
      description: "Microtransit shelter integration",
      theme: "blue",
    },
    {
      key: "heat_risk_score",
      label: "Heat Risk Score",
      baseline: baselines.heat_risk_score,
      simulated: simulateds.heat_risk_score,
      better: "low",
      icon: "ThermometerSun",
      description: "Urban Heat Island threat level",
      theme: "orange",
    },
    {
      key: "noise_score",
      label: "Noise Score",
      baseline: baselines.noise_score,
      simulated: simulateds.noise_score,
      better: "low",
      icon: "VolumeX",
      description: "Decibel noise pollution index",
      theme: "violet",
    },
    {
      key: "traffic_score",
      label: "Traffic Score",
      baseline: baselines.traffic_score,
      simulated: simulateds.traffic_score,
      better: "low",
      icon: "Car",
      description: "Average vehicular load volume",
      theme: "rose",
    },
  ];

  const getThemeColors = (theme: string) => {
    switch (theme) {
      case "emerald":
        return {
          text: "text-emerald-700",
          border: "border-emerald-200",
          bg: "bg-emerald-50",
          shadow: "shadow-emerald-500/5",
        };
      case "teal":
        return {
          text: "text-teal-700",
          border: "border-teal-200",
          bg: "bg-teal-50",
          shadow: "shadow-teal-500/5",
        };
      case "cyan":
        return {
          text: "text-cyan-700",
          border: "border-cyan-200",
          bg: "bg-cyan-50",
          shadow: "shadow-cyan-500/5",
        };
      case "blue":
        return {
          text: "text-blue-700",
          border: "border-blue-200",
          bg: "bg-blue-50",
          shadow: "shadow-blue-500/5",
        };
      case "orange":
        return {
          text: "text-orange-700",
          border: "border-orange-200",
          bg: "bg-orange-50",
          shadow: "shadow-orange-500/5",
        };
      case "violet":
        return {
          text: "text-violet-700",
          border: "border-violet-200",
          bg: "bg-violet-50",
          shadow: "shadow-violet-500/5",
        };
      default:
        return {
          text: "text-rose-700",
          border: "border-rose-200",
          bg: "bg-rose-50",
          shadow: "shadow-rose-500/5",
        };
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
      {/* Label and title */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <div>
          <h3 className="font-display font-bold text-sm text-slate-800 uppercase tracking-wide">
            Scenario Impact Summary
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
            Real-time average values across all 100 simulation grid cells.
          </p>
        </div>
        <div className="text-[10px] uppercase font-mono font-bold bg-slate-50 text-slate-550 px-2.5 py-1 rounded border border-slate-200">
          Sandbox Assessment Mode
        </div>
      </div>

      {/* Grid of cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {cards.map((card) => {
          const diff = card.simulated - card.baseline;
          const isPositiveOutcome = card.better === "high" ? diff > 0 : diff < 0;
          const isNegativeOutcome = card.better === "high" ? diff < 0 : diff > 0;
          const style = getThemeColors(card.theme);

          const IconComp = (Icons as any)[card.icon] || Icons.CircleDot;

          return (
            <div
              key={card.key}
              id={`kpi-card-${card.key}`}
              className={`bg-white border border-slate-200 rounded-lg p-3.5 transition-all text-left flex flex-col justify-between hover:border-slate-350 hover:bg-slate-50/50`}
            >
              <div>
                {/* Header with icon and name */}
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-[10px] font-bold text-slate-500 uppercase tracking-tight truncate max-w-[80%]"
                    title={card.label}
                  >
                    {card.label}
                  </span>
                  <div className={`p-1 rounded ${style.bg} ${style.text}`}>
                    <IconComp className="h-3.5 w-3.5 stroke-[2]" />
                  </div>
                </div>

                {/* Score and Change Tag */}
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="font-mono text-xl font-bold tracking-tight text-slate-950">
                    {card.simulated.toFixed(2)}
                  </span>

                  {diff !== 0 ? (
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${isPositiveOutcome
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : isNegativeOutcome
                            ? "bg-rose-50 text-rose-700 border-rose-100"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}
                    >
                      {diff > 0 ? `+${diff.toFixed(2)}` : diff.toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono text-slate-400 font-semibold uppercase">
                      base
                    </span>
                  )}
                </div>
              </div>

              {/* Sub-label baseline indicator */}
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[9px] font-mono text-slate-400">
                <span>Baseline:</span>
                <span>{card.baseline.toFixed(2)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
