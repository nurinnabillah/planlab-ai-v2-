import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { cells, interventions } = await req.json();

    const landUseSummary = cells.reduce((acc: any, cell: any) => {
      acc[cell.land_use] = (acc[cell.land_use] || 0) + 1;
      return acc;
    }, {});

    const avgScores = {
      traffic: Math.round(
        cells.reduce((s: number, c: any) => s + c.traffic_score, 0) / cells.length
      ),
      noise: Math.round(cells.reduce((s: number, c: any) => s + c.noise_score, 0) / cells.length),
      green: Math.round(
        cells.reduce((s: number, c: any) => s + c.green_space_index, 0) / cells.length
      ),
      heat: Math.round(
        cells.reduce((s: number, c: any) => s + c.heat_risk_score, 0) / cells.length
      ),
      walkability: Math.round(
        cells.reduce((s: number, c: any) => s + c.walkability_score, 0) / cells.length
      ),
      accessibility: Math.round(
        cells.reduce((s: number, c: any) => s + c.accessibility_score, 0) / cells.length
      ),
      transport: Math.round(
        cells.reduce((s: number, c: any) => s + c.public_transport_score, 0) / cells.length
      ),
    };

    const prompt = `
You are an urban planning AI assistant analyzing Seksyen 7, Shah Alam, Malaysia.

Current grid state (10x10 = 100 cells):
- Land use distribution: ${JSON.stringify(landUseSummary)}
- Active interventions placed: ${interventions.length > 0 ? interventions.join(", ") : "None"}

Average impact scores (0-100):
- Traffic congestion: ${avgScores.traffic}/100 (lower is better)
- Noise level: ${avgScores.noise}/100 (lower is better)
- Green space index: ${avgScores.green}/100 (higher is better)
- Heat risk: ${avgScores.heat}/100 (lower is better)
- Walkability: ${avgScores.walkability}/100 (higher is better)
- Accessibility: ${avgScores.accessibility}/100 (higher is better)
- Public transport: ${avgScores.transport}/100 (higher is better)

Generate exactly 3 specific urban planning recommendations for this area.
Make sure to include a mix of types based on the scores:
- Use "success" if a score is performing well
- Use "warning" if a score needs attention
- Use "alert" if a score is critically bad

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
