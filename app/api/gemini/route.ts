import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { cells, interventions } = await req.json();

    // Apply intervention impacts before calculating averages
    const adjustedCells = cells.map((cell: any) => {
      if (!cell.interventionId) return cell;

      const impactMap: { [key: string]: { [key: string]: number } } = {
        pocket_park: {
          green_space_index: 20,
          heat_risk_score: -15,
          walkability_score: 8,
          noise_score: -5,
        },
        street_trees: {
          green_space_index: 12,
          heat_risk_score: -10,
          walkability_score: 10,
          noise_score: -4,
        },
        bus_stop: {
          public_transport_score: 25,
          accessibility_score: 15,
          walkability_score: 5,
          traffic_score: -8,
        },
        pedestrian_walkway: { walkability_score: 20, accessibility_score: 10, traffic_score: -5 },
        covered_walkway: { walkability_score: 25, accessibility_score: 12, heat_risk_score: -8 },
        convert_mixed_use: {
          accessibility_score: 20,
          walkability_score: 12,
          traffic_score: 8,
          noise_score: 5,
        },
        densify_housing: {
          accessibility_score: 10,
          traffic_score: 15,
          noise_score: 10,
          green_space_index: -5,
        },
        widen_road: {
          traffic_score: 15,
          noise_score: 12,
          walkability_score: -10,
          green_space_index: -10,
        },
        traffic_calming: {
          traffic_score: -15,
          noise_score: -10,
          walkability_score: 15,
          accessibility_score: 5,
        },
        remove_green_area: {
          green_space_index: -25,
          heat_risk_score: 20,
          walkability_score: -10,
          noise_score: 8,
        },
      };

      const impacts = impactMap[cell.interventionId] || {};

      return {
        ...cell,
        traffic_score: Math.max(
          0,
          Math.min(100, cell.traffic_score + (impacts.traffic_score || 0))
        ),
        noise_score: Math.max(0, Math.min(100, cell.noise_score + (impacts.noise_score || 0))),
        green_space_index: Math.max(
          0,
          Math.min(100, cell.green_space_index + (impacts.green_space_index || 0))
        ),
        heat_risk_score: Math.max(
          0,
          Math.min(100, cell.heat_risk_score + (impacts.heat_risk_score || 0))
        ),
        walkability_score: Math.max(
          0,
          Math.min(100, cell.walkability_score + (impacts.walkability_score || 0))
        ),
        accessibility_score: Math.max(
          0,
          Math.min(100, cell.accessibility_score + (impacts.accessibility_score || 0))
        ),
        public_transport_score: Math.max(
          0,
          Math.min(100, cell.public_transport_score + (impacts.public_transport_score || 0))
        ),
      };
    });

    // Land use summary
    const landUseSummary = cells.reduce((acc: any, cell: any) => {
      acc[cell.land_use] = (acc[cell.land_use] || 0) + 1;
      return acc;
    }, {});

    // Average scores with intervention impacts applied
    const avgScores = {
      traffic: Math.round(
        adjustedCells.reduce((s: number, c: any) => s + c.traffic_score, 0) / adjustedCells.length
      ),
      noise: Math.round(
        adjustedCells.reduce((s: number, c: any) => s + c.noise_score, 0) / adjustedCells.length
      ),
      green: Math.round(
        adjustedCells.reduce((s: number, c: any) => s + c.green_space_index, 0) /
          adjustedCells.length
      ),
      heat: Math.round(
        adjustedCells.reduce((s: number, c: any) => s + c.heat_risk_score, 0) / adjustedCells.length
      ),
      walkability: Math.round(
        adjustedCells.reduce((s: number, c: any) => s + c.walkability_score, 0) /
          adjustedCells.length
      ),
      accessibility: Math.round(
        adjustedCells.reduce((s: number, c: any) => s + c.accessibility_score, 0) /
          adjustedCells.length
      ),
      transport: Math.round(
        adjustedCells.reduce((s: number, c: any) => s + c.public_transport_score, 0) /
          adjustedCells.length
      ),
    };

    const interventionNameMap: { [key: string]: string } = {
      pocket_park: "Pocket Park",
      street_trees: "Street Trees / Green Buffer",
      bus_stop: "Bus Stop / Transit Shelter",
      pedestrian_walkway: "Pedestrian Walkway",
      covered_walkway: "Covered Walkway",
      convert_mixed_use: "Convert to Mixed-use",
      densify_housing: "Densify Housing",
      widen_road: "Widen Road / Add Lane",
      traffic_calming: "Traffic Calming",
      remove_green_area: "Remove Green Area",
    };

    const interventionDetails = cells
      .filter((c: any) => c.interventionId)
      .map(
        (c: any) =>
          `Cell ${c.grid_id} (${c.land_use}): ${interventionNameMap[c.interventionId] || c.interventionId}`
      )
      .join(", ");

    const prompt = `
You are an urban planning AI assistant analyzing Seksyen 7, Shah Alam, Malaysia.

Current grid state (10x10 = 100 cells):
- Land use distribution: ${JSON.stringify(landUseSummary)}
- Active interventions placed: ${interventionDetails || "None"}

Average impact scores after interventions (0-100):
- Traffic congestion: ${avgScores.traffic}/100 (lower is better)
- Noise level: ${avgScores.noise}/100 (lower is better)
- Green space index: ${avgScores.green}/100 (higher is better)
- Heat risk: ${avgScores.heat}/100 (lower is better)
- Walkability: ${avgScores.walkability}/100 (higher is better)
- Accessibility: ${avgScores.accessibility}/100 (higher is better)
- Public transport: ${avgScores.transport}/100 (higher is better)

Generate exactly 3 specific urban planning recommendations for this area.
Make sure to:
- Reference the specific interventions the user placed (e.g. bus stops, pocket parks)
- Comment on what is working well and what still needs improvement
- Use "success" if a score is performing well (above 70)
- Use "warning" if a score needs attention (40-70)
- Use "alert" if a score is critically bad (below 40)

Each description should be 2-3 sentences maximum — specific, actionable, and mention Seksyen 7.

Respond ONLY with a valid JSON array, no markdown, no code blocks:
[
  {
    "type": "success" | "warning" | "alert",
    "title": "short title max 5 words",
    "description": "2-3 sentence specific recommendation"
  }
]
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const clean = text.replace(/```json|```/g, "").trim();
    const suggestions = JSON.parse(clean);

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Gemini error:", error);
    return NextResponse.json({ error: "Failed to generate suggestions" }, { status: 500 });
  }
}
