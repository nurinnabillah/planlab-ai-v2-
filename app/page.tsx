"use client"

import React, { useState, useMemo, useEffect } from "react";
import baselineData from "../src/data/seksyen7_grid_baseline.json";
import { GridCell, Intervention, INTERVENTIONS } from "../types";
import Header from "../src/components/Header";
import InterventionToolbar from "../src/components/InterventionToolbar";
import PlanLabMap from "../src/components/PlanLabMap";
import CellDetailsPanel from "../src/components/CellDetailsPanel";
import ScoreSummary from "../src/components/ScoreSummary";
import { Sparkles, Info, HelpCircle, GraduationCap, ArrowUpRight, TrendingUp } from "lucide-react";

export default function App() {
  // Load baseline JSON dataset on startup
  const [cells, setCells] = useState<GridCell[]>(() => {
    return (baselineData as GridCell[]).map((cell) => ({ ...cell }));
  });

  const [selectedCellId, setSelectedCellId] = useState<string | null>(null);
  const [selectedInterventionId, setSelectedInterventionId] = useState<string | null>(null);
  const [hoveredIntervention, setHoveredIntervention] = useState<Intervention | null>(null);

  // Find the selected cell from state
  const selectedCell = useMemo(() => {
    if (!selectedCellId) return null;
    return cells.find((c) => c.grid_id === selectedCellId) || null;
  }, [cells, selectedCellId]);

  // Find selected active intervention brush
  const activeIntervention = useMemo(() => {
    if (!selectedInterventionId) return null;
    return INTERVENTIONS.find((i) => i.id === selectedInterventionId) || null;
  }, [selectedInterventionId]);

  // Handle cell click (Applying paint brush or inspecting)
  const handleSelectCell = (clickedCell: GridCell) => {
    if (selectedInterventionId) {
      setCells((prev) =>
        prev.map((c) => {
          if (c.grid_id === clickedCell.grid_id) {
            // If already has this intervention, toggle it off, otherwise apply
            const newInterventionId =
              c.interventionId === selectedInterventionId ? undefined : selectedInterventionId;
            return {
              ...c,
              interventionId: newInterventionId,
            };
          }
          return c;
        })
      );
      // Set as currently active highlighted cell
      setSelectedCellId(clickedCell.grid_id);
    } else {
      // Just inspect
      setSelectedCellId(clickedCell.grid_id);
    }
  };

  // Handle deleting an intervention on a cell
  const handleClearIntervention = (gridId: string) => {
    setCells((prev) =>
      prev.map((c) => {
        if (c.grid_id === gridId) {
          const copy = { ...c };
          delete copy.interventionId;
          return copy;
        }
        return c;
      })
    );
  };

  // Reset simulator back to unaltered state
  const handleReset = () => {
    setCells((baselineData as GridCell[]).map((cell) => ({ ...cell })));
    setSelectedCellId(null);
    setSelectedInterventionId(null);
  };

  // Apply Quick presets for demonstration value
  const handleApplyPreset = (presetName: string) => {
    // Start clean first
    const cleanCells = (baselineData as GridCell[]).map((cell) => ({ ...cell }));

    if (presetName === "green_city") {
      // Apply street trees to all secondary roads & highways
      setCells(
        cleanCells.map((c) => {
          if (c.land_use === "Road") {
            return { ...c, interventionId: "street_trees" };
          }
          // Intersperse Pocket Parks
          if (
            (c.grid_id === "A2" ||
              c.grid_id === "B8" ||
              c.grid_id === "F3" ||
              c.grid_id === "J4" ||
              c.grid_id === "H6") &&
            c.land_use === "Green"
          ) {
            return { ...c, interventionId: "pocket_park" };
          }
          return c;
        })
      );
    } else if (presetName === "transit_oriented") {
      setCells(
        cleanCells.map((c) => {
          // Place Transit stations near Road lines
          if (
            c.grid_id === "A7" ||
            c.grid_id === "C9" ||
            c.grid_id === "H1" ||
            c.grid_id === "H3" ||
            c.grid_id === "I5"
          ) {
            return { ...c, interventionId: "bus_stop" };
          }
          // Connect surrounding zones with Walkways
          if (
            c.grid_id === "A10" ||
            c.grid_id === "B3" ||
            c.grid_id === "D4" ||
            c.grid_id === "F8" ||
            c.grid_id === "I6"
          ) {
            return { ...c, interventionId: "pedestrian_walkway" };
          }
          if (c.grid_id === "H2" || c.grid_id === "J6") {
            return { ...c, interventionId: "covered_walkway" };
          }
          // Densify housing adjacent to transit
          if (
            c.grid_id === "B10" ||
            c.grid_id === "C10" ||
            c.grid_id === "G8" ||
            c.grid_id === "G9"
          ) {
            return { ...c, interventionId: "convert_mixed_use" };
          }
          return c;
        })
      );
    }

    // Highlight a key center cell that altered
    setSelectedCellId("A7");
  };

  // Check if grid has any active modifications
  const hasModifications = useMemo(() => {
    return cells.some((c) => !!c.interventionId);
  }, [cells]);

  const activeInterventionsCount = useMemo(() => {
    return cells.filter((c) => !!c.interventionId).length;
  }, [cells]);

  // Compute overall KPI stats for the local AI Sandbox advisor
  const averages = useMemo(() => {
    let totGreen = 0,
      totWalk = 0,
      totHeat = 0,
      totNoise = 0,
      totTrans = 0,
      totAccess = 0;
    cells.forEach((cell) => {
      let g = cell.green_space_index;
      let w = cell.walkability_score;
      let h = cell.heat_risk_score;
      let n = cell.noise_score;
      let t = cell.public_transport_score;
      let a = cell.accessibility_score;

      if (cell.interventionId) {
        const intv = INTERVENTIONS.find((i) => i.id === cell.interventionId);
        if (intv?.impact) {
          g = Math.max(0, Math.min(100, g + (intv.impact.green_space_index || 0)));
          w = Math.max(0, Math.min(100, w + (intv.impact.walkability_score || 0)));
          h = Math.max(0, Math.min(100, h + (intv.impact.heat_risk_score || 0)));
          n = Math.max(0, Math.min(100, n + (intv.impact.noise_score || 0)));
          t = Math.max(0, Math.min(100, t + (intv.impact.public_transport_score || 0)));
          a = Math.max(0, Math.min(100, a + (intv.impact.accessibility_score || 0)));
        }
      }
      totGreen += g;
      totWalk += w;
      totHeat += h;
      totNoise += n;
      totTrans += t;
      totAccess += a;
    });

    return {
      green: totGreen / 100,
      walk: totWalk / 100,
      heat: totHeat / 100,
      noise: totNoise / 100,
      transit: totTrans / 100,
      access: totAccess / 100,
    };
  }, [cells]);

  // Generate dynamic rule-based AI Planner advices based on grid scores
  const [aiPlanningAdvices, setAiPlanningAdvices] = useState<any[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const fetchAdvice = async () => {
      setAiLoading(true);
      try {
        const activeInterventionNames = cells
          .filter((c: any) => c.interventionId)
          .map((c: any) => c.interventionId);

        const res = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cells,
            interventions: activeInterventionNames,
          }),
        });

        const data = await res.json();
        if (data.suggestions) setAiPlanningAdvices(data.suggestions);
      } catch (err) {
        console.error('Gemini fetch error:', err);
      } finally {
        setAiLoading(false);
      }
    };

    fetchAdvice();
  }, [cells]); // re-runs every time grid changes

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-800 font-sans flex flex-col justify-between w-full">
      {/* Header Panel */}
      <Header
        onReset={handleReset}
        onApplyPreset={handleApplyPreset}
        hasModifications={hasModifications}
        activeInterventionsCount={activeInterventionsCount}
      />

      {/* Main Sandbox Interactive Area */}
      <main className="flex-1 px-4 py-6 w-full flex flex-col lg:flex-row gap-5 items-stretch overflow-hidden">
        {/* LEFT COMPONENT: Intervention tools sidebar */}
        <div
          className={`transition-all duration-300 ease-in-out shrink-0 flex flex-col h-[600px] lg:h-auto ${isSidebarExpanded ? "lg:w-[320px]" : "lg:w-[64px]"} w-full`}
        >
          <InterventionToolbar
            selectedId={selectedInterventionId}
            onSelect={setSelectedInterventionId}
            hoveredIntervention={hoveredIntervention}
            setHoveredIntervention={setHoveredIntervention}
            isExpanded={isSidebarExpanded}
            onToggleExpand={() => setIsSidebarExpanded(!isSidebarExpanded)}
          />
        </div>

        {/* CENTER COMPONENT: Visual Map Overlay Grid */}
        <div className="flex-1 flex flex-col space-y-4 min-w-0">
          <PlanLabMap
            cells={cells}
            selectedCell={selectedCell}
            onSelectCell={handleSelectCell}
            activeIntervention={activeIntervention}
            isSidebarExpanded={isSidebarExpanded}
          />

          {/* Interactive GIS Scenario Advisor Panel */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-blue-500" />
                <h4 className="font-display font-bold text-xs tracking-wide uppercase text-slate-800">
                  PlanLab AI Local Simulation Advisory
                </h4>
              </div>
              {aiLoading && (
                <span className="text-[10px] text-blue-400 animate-pulse font-medium">
                  ✨ Generating...
                </span>
              )}
            </div>

            {aiLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-3 rounded-lg border bg-slate-50 border-slate-200 animate-pulse h-20" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {aiPlanningAdvices.map((advice, idx) => {
                  // support both old (status/text) and new (type/description) formats
                  const status = advice.type || advice.status;
                  const body = advice.description || advice.text;
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border text-xs flex gap-2.5 ${
                        status === "alert" || status === "critical"
                          ? "bg-rose-50 border-rose-200 text-rose-850"
                          : status === "warning"
                          ? "bg-amber-50 border-amber-200 text-amber-850"
                          : "bg-emerald-50 border-emerald-200 text-emerald-850"
                      }`}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {(status === "alert" || status === "critical") && <Info className="h-4 w-4 text-rose-600" />}
                        {status === "warning" && <HelpCircle className="h-4 w-4 text-amber-600" />}
                        {status === "success" && <Sparkles className="h-4 w-4 text-emerald-600" />}
                      </div>
                      <div>
                        <h5 className="font-bold mb-0.5 text-slate-900">{advice.title}</h5>
                        <p className="text-[11px] text-slate-600 leading-normal">{body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COMPONENT: Cell Specs & Score Comparisons */}
        <div className="lg:w-[320px] shrink-0 h-full flex flex-col min-h-[500px] lg:min-h-0 w-full">
          <CellDetailsPanel cell={selectedCell} onClearIntervention={handleClearIntervention} />
        </div>
      </main>

      {/* BOTTOM COMPONENT: Score Summary Average cards */}
      <footer className="w-full px-4 pb-6 mx-auto shrink-0">
        <ScoreSummary cells={cells} />

        {/* Footnote status metadata */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 bg-white border border-slate-200 px-4 py-3 rounded-xl shadow-sm">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-medium text-slate-600">
              PlanLab AI Student Prototype Sandbox • Seksyen 7, Shah Alam Pilot Grid
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1.5 sm:mt-0 font-mono text-slate-400 text-[10px]">
            <span>Grid Origin: A1 (Top-Left) to J10 (Bottom-Right)</span>
            <span>•</span>
            <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-bold border border-blue-100">
              Unconnected Sandbox Mode
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
