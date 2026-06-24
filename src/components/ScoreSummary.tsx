"use client";

import React from "react";
import { GridCell, INTERVENTIONS } from "../../types";
import * as Icons from "lucide-react";

interface ScoreSummaryProps {
  cells: GridCell[];
}

export default function ScoreSummary({ cells }: ScoreSummaryProps) {
  const count = cells.length || 1;

  const calculateAverages = (items: GridCell[], applyInterventions: boolean) => {
    let totalGreen = 0,
      totalWalk = 0,
      totalAccess = 0,
      totalTransit = 0;
    let totalHeat = 0,
      totalNoise = 0,
      totalTraffic = 0;

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

  // Get status label and color based on score and direction
  const getStatus = (score: number, better: "high" | "low") => {
    const effectiveScore = better === "low" ? 100 - score : score;
    if (effectiveScore >= 70)
      return {
        label: "Good",
        dot: "bg-emerald-500",
        text: "text-emerald-700",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
      };
    if (effectiveScore >= 40)
      return {
        label: "Warning",
        dot: "bg-amber-500",
        text: "text-amber-700",
        bg: "bg-amber-50",
        border: "border-amber-200",
      };
    return {
      label: "Alert",
      dot: "bg-rose-500",
      text: "text-rose-700",
      bg: "bg-rose-50",
      border: "border-rose-200",
    };
  };

  const cards = [
    {
      key: "green_space_index",
      label: "Green Space Index",
      baseline: baselines.green_space_index,
      simulated: simulateds.green_space_index,
      better: "high" as const,
      icon: "Trees",
      description: "Higher is better",
      theme: "emerald",
    },
    {
      key: "walkability_score",
      label: "Walkability Index",
      baseline: baselines.walkability_score,
      simulated: simulateds.walkability_score,
      better: "high" as const,
      icon: "Footprints",
      description: "Higher is better",
      theme: "teal",
    },
    {
      key: "accessibility_score",
      label: "Public Accessibility",
      baseline: baselines.accessibility_score,
      simulated: simulateds.accessibility_score,
      better: "high" as const,
      icon: "Signpost",
      description: "Higher is better",
      theme: "cyan",
    },
    {
      key: "public_transport_score",
      label: "Transit Efficiency",
      baseline: baselines.public_transport_score,
      simulated: simulateds.public_transport_score,
      better: "high" as const,
      icon: "Bus",
      description: "Higher is better",
      theme: "blue",
    },
    {
      key: "heat_risk_score",
      label: "Heat Risk Score",
      baseline: baselines.heat_risk_score,
      simulated: simulateds.heat_risk_score,
      better: "low" as const,
      icon: "ThermometerSun",
      description: "Lower is better",
      theme: "orange",
    },
    {
      key: "noise_score",
      label: "Noise Score",
      baseline: baselines.noise_score,
      simulated: simulateds.noise_score,
      better: "low" as const,
      icon: "VolumeX",
      description: "Lower is better",
      theme: "violet",
    },
    {
      key: "traffic_score",
      label: "Traffic Score",
      baseline: baselines.traffic_score,
      simulated: simulateds.traffic_score,
      better: "low" as const,
      icon: "Car",
      description: "Lower is better",
      theme: "rose",
    },
  ];

  const getThemeColors = (theme: string) => {
    switch (theme) {
      case "emerald":
        return { text: "text-emerald-700", bg: "bg-emerald-50" };
      case "teal":
        return { text: "text-teal-700", bg: "bg-teal-50" };
      case "cyan":
        return { text: "text-cyan-700", bg: "bg-cyan-50" };
      case "blue":
        return { text: "text-blue-700", bg: "bg-blue-50" };
      case "orange":
        return { text: "text-orange-700", bg: "bg-orange-50" };
      case "violet":
        return { text: "text-violet-700", bg: "bg-violet-50" };
      default:
        return { text: "text-rose-700", bg: "bg-rose-50" };
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <div>
          <h3 className="font-display font-bold text-sm text-slate-800 uppercase tracking-wide">
            Scenario Impact Summary
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
            Average livability scores across all 100 grid cells in Seksyen 7 pilot area.
            <span className="ml-1 text-slate-400">
              🟢 Good (70+) &nbsp; 🟡 Warning (40–70) &nbsp; 🔴 Alert (&lt;40)
            </span>
          </p>
        </div>
        <div className="text-[10px] uppercase font-mono font-bold bg-slate-50 text-slate-500 px-2.5 py-1 rounded border border-slate-200">
          Sandbox Assessment Mode
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {cards.map((card) => {
          const diff = card.simulated - card.baseline;
          const isPositiveOutcome = card.better === "high" ? diff > 0 : diff < 0;
          const isNegativeOutcome = card.better === "high" ? diff < 0 : diff > 0;
          const style = getThemeColors(card.theme);
          const status = getStatus(card.simulated, card.better);
          const IconComp = (Icons as any)[card.icon] || Icons.CircleDot;

          return (
            <div
              key={card.key}
              className="bg-white border border-slate-200 rounded-lg p-3.5 transition-all flex flex-col justify-between hover:border-slate-300 hover:bg-slate-50/50"
            >
              <div>
                {/* Header */}
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

                {/* Score and delta */}
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="font-mono text-xl font-bold tracking-tight text-slate-950">
                    {card.simulated.toFixed(2)}
                  </span>
                  {diff !== 0 ? (
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                        isPositiveOutcome
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

                {/* Status badge */}
                <div
                  className={`mt-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${status.bg} ${status.text} ${status.border} border`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                  {status.label}
                </div>

                {/* Direction hint */}
                <p className="text-[9px] text-slate-400 mt-1">{card.description}</p>
              </div>

              {/* Baseline */}
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
