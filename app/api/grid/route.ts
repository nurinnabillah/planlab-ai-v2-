import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM grid_cells ORDER BY row, col");
    const cells = result.rows.map((row: any) => ({
      ...row,
      north_lat: Number(row.north_lat),
      south_lat: Number(row.south_lat),
      west_lng: Number(row.west_lng),
      east_lng: Number(row.east_lng),
      center_lat: Number(row.center_lat),
      center_lng: Number(row.center_lng),
      traffic_score: Number(row.traffic_score),
      noise_score: Number(row.noise_score),
      green_space_index: Number(row.green_space_index),
      heat_risk_score: Number(row.heat_risk_score),
      walkability_score: Number(row.walkability_score),
      accessibility_score: Number(row.accessibility_score),
      public_transport_score: Number(row.public_transport_score),
    }));
    return NextResponse.json({ cells });
  } catch (error) {
    console.error("DB error:", error);
    return NextResponse.json({ error: "Failed to fetch grid" }, { status: 500 });
  }
}
