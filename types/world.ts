/**
 * Individual sound layer configuration
 */
export interface SoundLayer {
  id: string;
  name: string;
  description?: string;
  iconName?: string; // Lucide icon name
  audioUrl: string;
  defaultVolume: number; // 0-1
  defaultEnabled: boolean;
  minVolume?: number;
  maxVolume?: number;
}

/**
 * World preset configuration
 */
export interface WorldPreset {
  id: string;
  name: string;
  description?: string;
  layerSettings: Record<string, {
    enabled: boolean;
    volume: number;
    intensity?: number; // 0-1, for future use
  }>;
}

/**
 * Complete world definition
 */
export interface World {
  id: string;
  name: string;
  shortName: string; // Single word for navigation
  iconName: string; // Lucide icon name
  description: string;
  category: string;
  section: 'realistic' | 'fictional'; // Section for sidebar grouping
  layers: SoundLayer[];
  presets: WorldPreset[];
  thumbnailUrl?: string;
}

/**
 * Runtime state for a sound layer
 */
export interface SoundLayerState {
  layer: SoundLayer;
  enabled: boolean;
  volume: number;
  intensity?: number;
}

/**
 * Runtime state for a world
 */
export interface WorldState {
  world: World;
  layerStates: Record<string, SoundLayerState>;
  activePresetId?: string;
}

