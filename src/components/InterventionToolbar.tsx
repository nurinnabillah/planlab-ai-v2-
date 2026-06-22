"use client"

import React from "react";
import * as Icons from "lucide-react";
import { Intervention, INTERVENTIONS } from "../../types";

interface InterventionToolbarProps {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  hoveredIntervention: Intervention | null;
  setHoveredIntervention: (item: Intervention | null) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

// Icon Helper
const loadIcon = (name: string): React.ReactNode => {
  const IconComponent = (Icons as any)[name] || Icons.HelpCircle;
  return <IconComponent className="h-4 w-4" />;
};

export default function InterventionToolbar({
  selectedId,
  onSelect,
  hoveredIntervention,
  setHoveredIntervention,
  isExpanded = true,
  onToggleExpand,
}: InterventionToolbarProps) {
  // Group by category
  const categories = {
    Green: INTERVENTIONS.filter((i) => i.category === "Green"),
    Mobility: INTERVENTIONS.filter((i) => i.category === "Mobility"),
    Density: INTERVENTIONS.filter((i) => i.category === "Density"),
    Infrastructure: INTERVENTIONS.filter((i) => i.category === "Infrastructure"),
  };

  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case "Green":
        return {
          label: "Eco-Restoration",
          badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
        };
      case "Mobility":
        return { label: "Smart Transit", badge: "bg-blue-50 text-blue-700 border-blue-200" };
      case "Density":
        return { label: "Zoning & Density", badge: "bg-amber-50 text-amber-700 border-amber-200" };
      default:
        return { label: "Grey Overrides", badge: "bg-slate-100 text-slate-700 border-slate-200" };
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* Title */}
      <div
        className={`border-b border-slate-200 bg-slate-50 flex flex-col gap-2 ${isExpanded ? "p-4" : "p-2 items-center"}`}
      >
        <div
          className={`flex w-full items-center ${isExpanded ? "justify-between" : "justify-center"}`}
        >
          {isExpanded && (
            <span className="font-display font-bold text-sm tracking-wide text-slate-800 uppercase">
              Intervention Toolkit
            </span>
          )}
          <button
            onClick={onToggleExpand}
            className={`flex ${isExpanded ? "items-center gap-1.5 px-2 py-1" : "flex-col items-center gap-1 py-2 w-full"} bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-colors shadow-sm`}
            title={isExpanded ? "Hide Toolkit" : "Expand Toolkit"}
          >
            {isExpanded ? (
              <>
                <Icons.PanelLeftClose className="h-4 w-4 shrink-0" />
                <span>Hide Toolkit</span>
              </>
            ) : (
              <>
                <Icons.PanelLeftOpen className="h-4 w-4 shrink-0" />
                <span className="text-[9px] uppercase tracking-wider">Tools</span>
              </>
            )}
          </button>
        </div>
        {isExpanded && (
          <p className="text-xs text-slate-500 leading-relaxed">
            Select an intervention below, then click any grid cell on the Seksyen 7 pilot area map
            to place and simulate instant changes.
          </p>
        )}
      </div>

      {/* Mode Selector */}
      <div
        className={`p-2.5 border-b border-slate-200 bg-white flex gap-1 ${!isExpanded ? "justify-center" : ""}`}
      >
        <button
          id="btn-mode-inspect"
          onClick={() => onSelect(null)}
          title="Inspect & Select Cell"
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold cursor-pointer transition-all ${isExpanded ? "flex-1" : "w-full"} ${selectedId === null
              ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
            }`}
        >
          <Icons.Info className="h-3.5 w-3.5 shrink-0" />
          {isExpanded && <span>Inspect & Select Cell</span>}
        </button>
      </div>

      {/* Intervention Scrollarea */}
      <div
        className={`flex-1 overflow-y-auto space-y-5 custom-scroll bg-white ${isExpanded ? "p-4" : "p-2"}`}
      >
        {Object.entries(categories).map(([catKey, items]) => {
          const theme = getCategoryTheme(catKey);
          return (
            <div
              key={catKey}
              className={`space-y-2 ${!isExpanded ? "flex flex-col items-center" : ""}`}
            >
              {isExpanded && (
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                    {theme.label}
                  </span>
                  <span
                    className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border ${theme.badge}`}
                  >
                    {items.length} options
                  </span>
                </div>
              )}

              <div className={`grid gap-1.5 w-full ${isExpanded ? "grid-cols-1" : "grid-cols-1"}`}>
                {items.map((item) => {
                  const isActive = selectedId === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`btn-intervention-${item.id}`}
                      onClick={() => onSelect(item.id)}
                      onMouseEnter={() => setHoveredIntervention(item)}
                      onMouseLeave={() => setHoveredIntervention(null)}
                      title={!isExpanded ? item.name : undefined}
                      className={`group w-full text-left rounded-lg border text-xs transition-all relative overflow-hidden cursor-pointer flex items-start gap-3 ${isExpanded ? "p-3" : "p-2 justify-center"
                        } ${isActive
                          ? `${item.color} ${item.borderColor} ring-1 ring-offset-2 ring-offset-white ring-blue-500 shadow-sm`
                          : "bg-white border-slate-200 text-slate-700 hover:border-slate-350 hover:bg-slate-50"
                        }`}
                    >
                      {/* Active indicator dot */}
                      {isActive && (
                        <span className="absolute top-1 right-1 flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                      )}

                      {/* Icon */}
                      <div
                        className={`p-1.5 rounded-md transition-colors shrink-0 ${isActive
                            ? "bg-white/40"
                            : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-800"
                          }`}
                      >
                        {loadIcon(item.icon)}
                      </div>

                      {/* Info block */}
                      {isExpanded && (
                        <div className="flex-1 min-w-0">
                          <span className="font-semibold block truncate text-slate-800">
                            {item.name}
                          </span>

                          {/* Compact delta indicators */}
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {Object.entries(item.impact)
                              .slice(0, 3)
                              .map(([key, value]) => {
                                const valNum = value as number;
                                const isPositiveImpact =
                                  key === "noise_score" ||
                                    key === "heat_risk_score" ||
                                    key === "traffic_score"
                                    ? valNum < 0 // lower is better for risk scores
                                    : valNum > 0; // higher is better for index scores

                                return (
                                  <span
                                    key={key}
                                    className={`text-[9px] font-mono font-bold px-1 rounded-sm border ${isPositiveImpact
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                        : "bg-rose-50 text-rose-700 border-rose-100"
                                      }`}
                                  >
                                    {key
                                      .replace("_score", "")
                                      .replace("_index", "")
                                      .replace("green_space", "green")}
                                    : {valNum > 0 ? `+${valNum}` : valNum}
                                  </span>
                                );
                              })}
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tooltip Hover Overlay Info Banner */}
      {isExpanded && (
        <div className="p-3 border-t border-slate-200 bg-slate-50 min-h-[92px] flex flex-col justify-center">
          {hoveredIntervention ? (
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] uppercase font-bold font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                  {hoveredIntervention.category}
                </span>
                <span className="font-bold text-xs text-slate-800">{hoveredIntervention.name}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal line-clamp-2">
                {hoveredIntervention.description}
              </p>
            </div>
          ) : selectedId ? (
            <div>
              <p className="text-[10px] text-blue-600 font-mono font-bold animate-pulse mb-1 flex items-center gap-1">
                <Icons.Paintbrush className="h-3 w-3" />
                Tool Selected
              </p>
              <p className="text-[11px] text-slate-500">
                Click any grid cell to paint{" "}
                <span className="text-slate-800 font-semibold">
                  {INTERVENTIONS.find((i) => i.id === selectedId)?.name}
                </span>{" "}
                and simulate immediate score deltas.
              </p>
            </div>
          ) : (
            <div className="text-center text-slate-400 text-xs py-1.5">
              <p className="font-semibold text-slate-500">Edit mode</p>
              <p className="text-[10px] mt-0.5 text-slate-400">
                Click any cell to inspect its baseline attributes
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
