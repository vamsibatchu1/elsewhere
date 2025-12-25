import { useState, useCallback, useEffect } from 'react';
import { World, WorldState, SoundLayerState, WorldPreset } from '@/types/world';
import { getAudioEngine } from '@/lib/audio-engine';

/**
 * Hook for managing world state and audio playback
 */
export function useWorldState(initialWorld: World | null) {
  const [worldState, setWorldState] = useState<WorldState | null>(null);
  const engine = getAudioEngine();

  // Initialize world state
  useEffect(() => {
    if (!initialWorld) {
      setWorldState(null);
      engine.stopAll();
      return;
    }

    const layerStates: Record<string, SoundLayerState> = {};
    initialWorld.layers.forEach((layer) => {
      layerStates[layer.id] = {
        layer,
        enabled: false, // Always start disabled - user must select them
        volume: layer.defaultVolume,
      };
    });

    setWorldState({
      world: initialWorld,
      layerStates,
    });
  }, [initialWorld, engine]);

  // Sync audio playback with state
  useEffect(() => {
    if (!worldState || !engine.isReady()) {
      return;
    }

    const loadAndPlayLayers = async () => {
      // Load all audio files
      for (const layer of worldState.world.layers) {
        try {
          await engine.loadAudio(layer.id, layer.audioUrl);
        } catch (error) {
          console.error(`Failed to load audio for ${layer.name}:`, error);
        }
      }

      // Start/stop layers based on state
      for (const [layerId, layerState] of Object.entries(worldState.layerStates)) {
        if (layerState.enabled) {
          // Random offset to avoid synchronization
          const randomOffset = Math.random() * (layerState.layer.audioUrl ? 10 : 0);
          engine.startLayer(layerId, layerState.volume, randomOffset);
        } else {
          engine.stopLayer(layerId);
        }
      }
    };

    loadAndPlayLayers();

    return () => {
      // Cleanup handled by world change
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [worldState]);

  const toggleLayer = useCallback(async (layerId: string) => {
    if (!worldState) return;

    setWorldState((prev) => {
      if (!prev) return prev;

      const layerState = prev.layerStates[layerId];
      if (!layerState) return prev;

      const newEnabled = !layerState.enabled;

      // Update audio immediately
      if (newEnabled) {
        const layer = layerState.layer;
        
        // Ensure audio is loaded before starting
        const startAudio = async () => {
          try {
            // Check if audio is already loaded, if not load it
            if (!engine.hasAudioBuffer(layerId)) {
              await engine.loadAudio(layerId, layer.audioUrl);
            }
            
            const randomOffset = Math.random() * 10;
            engine.startLayer(layerId, layerState.volume, randomOffset);
          } catch (error) {
            console.error(`Failed to load/start audio for ${layer.name}:`, error);
          }
        };
        
        startAudio();
      } else {
        engine.stopLayer(layerId);
      }

      return {
        ...prev,
        layerStates: {
          ...prev.layerStates,
          [layerId]: {
            ...layerState,
            enabled: newEnabled,
          },
        },
      };
    });
  }, [worldState, engine]);

  const setLayerVolume = useCallback((layerId: string, volume: number) => {
    if (!worldState) return;

    setWorldState((prev) => {
      if (!prev) return prev;

      const layerState = prev.layerStates[layerId];
      if (!layerState) return prev;

      // Update audio immediately
      engine.setVolume(layerId, volume);

      return {
        ...prev,
        layerStates: {
          ...prev.layerStates,
          [layerId]: {
            ...layerState,
            volume,
          },
        },
      };
    });
  }, [worldState, engine]);

  const applyPreset = useCallback((preset: WorldPreset) => {
    if (!worldState) return;

    setWorldState((prev) => {
      if (!prev) return prev;

      const newLayerStates = { ...prev.layerStates };

      // Apply preset settings
      for (const [layerId, settings] of Object.entries(preset.layerSettings)) {
        if (newLayerStates[layerId]) {
          const layerState = newLayerStates[layerId];
          const layer = layerState.layer;

          // Stop layer first
          engine.stopLayer(layerId);

          // Update state
          newLayerStates[layerId] = {
            ...layerState,
            enabled: settings.enabled,
            volume: settings.volume,
            intensity: settings.intensity,
          };

          // Start if enabled
          if (settings.enabled) {
            const randomOffset = Math.random() * 10;
            engine.startLayer(layerId, settings.volume, randomOffset);
          }
        }
      }

      return {
        ...prev,
        layerStates: newLayerStates,
        activePresetId: preset.id,
      };
    });
  }, [worldState, engine]);

  return {
    worldState,
    toggleLayer,
    setLayerVolume,
    applyPreset,
  };
}

