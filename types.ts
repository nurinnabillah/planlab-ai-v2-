export interface GridCell {
  grid_id: string; // e.g., "A1"
  row: number; // 1-10
  col: number; // 1-10
  north_lat: number;
  south_lat: number;
  west_lng: number;
  east_lng: number;
  center_lat: number;
  center_lng: number;
  land_use: string; // e.g., "Residential", "Commercial", "Green", "Road", "Water", "Public Facility"
  secondary_land_use: string;
  traffic_score: number;
  noise_score: number;
  green_space_index: number;
  heat_risk_score: number;
  walkability_score: number;
  accessibility_score: number;
  public_transport_score: number;

  // Custom states added by user in physical simulation
  interventionId?: string; // ID of the applied intervention, if any
}

export interface Intervention {
  id: string;
  name: string;
  description: string;
  category: "Green" | "Mobility" | "Infrastructure" | "Density";
  color: string; // Tailwind tint
  borderColor: string;
  icon: string; // lucide icon name
  impact: {
    traffic_score?: number;
    noise_score?: number;
    green_space_index?: number;
    heat_risk_score?: number;
    walkability_score?: number;
    accessibility_score?: number;
    public_transport_score?: number;
  };
}

export const INTERVENTIONS: Intervention[] = [
  {
    id: "pocket_park",
    name: "Pocket Park",
    description:
      "Converts micro-spaces into green public parks supporting mental refuge and flora.",
    category: "Green",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    borderColor: "border-emerald-400",
    icon: "Trees",
    impact: {
      green_space_index: 20,
      heat_risk_score: -15,
      walkability_score: 8,
      noise_score: -5,
    },
  },
  {
    id: "street_trees",
    name: "Street Trees / Green Buffer",
    description:
      "Inserts roadside bioswales and canopy structures to shadow sidewalks and absorb rain.",
    category: "Green",
    color: "bg-teal-50 text-teal-700 border-teal-200",
    borderColor: "border-teal-400",
    icon: "Leaf",
    impact: {
      green_space_index: 12,
      heat_risk_score: -10,
      walkability_score: 10,
      noise_score: -4,
    },
  },
  {
    id: "bus_stop",
    name: "Bus Stop / Transit Shelter",
    description:
      "Establishes a smart shaded bus stop improving local connectivity and micro-mobility hub features.",
    category: "Mobility",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    borderColor: "border-blue-400",
    icon: "Bus",
    impact: {
      public_transport_score: 25,
      accessibility_score: 15,
      walkability_score: 5,
      traffic_score: -8,
    },
  },
  {
    id: "pedestrian_walkway",
    name: "Pedestrian Walkway",
    description:
      "Upgrades dirt or broken trails into dedicated, level visual pathways for safe walking.",
    category: "Mobility",
    color: "bg-cyan-50 text-cyan-700 border-cyan-200",
    borderColor: "border-cyan-400",
    icon: "Footprints",
    impact: {
      walkability_score: 20,
      accessibility_score: 10,
      traffic_score: -5,
    },
  },
  {
    id: "covered_walkway",
    name: "Covered Walkway",
    description:
      "Adds lightweight weather protection roofs to critical walkways, shielding pedestrians from rain and intense sun.",
    category: "Mobility",
    color: "bg-sky-50 text-sky-700 border-sky-200",
    borderColor: "border-sky-400",
    icon: "Umbrella",
    impact: {
      walkability_score: 25,
      accessibility_score: 12,
      heat_risk_score: -8,
    },
  },
  {
    id: "convert_mixed_use",
    name: "Convert to Mixed-use",
    description:
      "Promotes commercial-on-ground and residential-above zoning to reduce commute distances.",
    category: "Density",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    borderColor: "border-amber-400",
    icon: "Building",
    impact: {
      accessibility_score: 20,
      walkability_score: 12,
      traffic_score: 8,
      noise_score: 5,
    },
  },
  {
    id: "densify_housing",
    name: "Densify Housing",
    description:
      "Replaces empty low-rise zones with medium-density multi-family structures to support Shah Alam growth.",
    category: "Density",
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    borderColor: "border-indigo-400",
    icon: "Home",
    impact: {
      accessibility_score: 10,
      traffic_score: 15,
      noise_score: 10,
      green_space_index: -5,
    },
  },
  {
    id: "widen_road",
    name: "Widen Road / Add Lane",
    description:
      "Expands the asphalt path. Alleviates short-term backlog but induces long-term vehicle trips.",
    category: "Infrastructure",
    color: "bg-red-50 text-red-700 border-red-200",
    borderColor: "border-red-400",
    icon: "Spline",
    impact: {
      traffic_score: 15,
      noise_score: 12,
      walkability_score: -10,
      green_space_index: -10,
    },
  },
  {
    id: "traffic_calming",
    name: "Traffic Calming",
    description:
      "Adds raised crosswalks, speed humps, and neckdowns to lower vehicle velocities and improve urban safety.",
    category: "Infrastructure",
    color: "bg-violet-50 text-violet-700 border-violet-200",
    borderColor: "border-violet-400",
    icon: "ShieldAlert",
    impact: {
      traffic_score: -15,
      noise_score: -10,
      walkability_score: 15,
      accessibility_score: 5,
    },
  },
  {
    id: "remove_green_area",
    name: "Remove Green Area",
    description:
      "Clears pockets of wild growth, trees, or meadows to create space for gray development.",
    category: "Infrastructure",
    color: "bg-stone-50 text-stone-700 border-stone-200",
    borderColor: "border-stone-400",
    icon: "Trash2",
    impact: {
      green_space_index: -25,
      heat_risk_score: 20,
      walkability_score: -10,
      noise_score: 8,
    },
  },
];

export interface ScenarioHistory {
  id: string;
  name: string;
  description: string;
  timestamp: string;
  cellStates: { [gridId: string]: string }; // Map grid_id to interventionId
}
