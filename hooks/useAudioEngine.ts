import { useEffect, useRef, useState } from 'react';
import { getAudioEngine } from '@/lib/audio-engine';
import { SoundLayer, WorldState } from '@/types/world';

/**
 * Hook for managing audio engine lifecycle
 */
export function useAudioEngine() {
  const [isReady, setIsReady] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const engineRef = useRef<ReturnType<typeof getAudioEngine> | null>(null);

  useEffect(() => {
    engineRef.current = getAudioEngine();
    
    // Initialize on mount (will require user interaction to actually start)
    const init = async () => {
      setIsInitializing(true);
      try {
        await engineRef.current!.initialize();
        setIsReady(true);
      } catch (error) {
        console.error('Failed to initialize audio engine:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    init();

    return () => {
      // Cleanup handled by singleton, but we can reset state
      setIsReady(false);
    };
  }, []);

  const resume = async () => {
    if (engineRef.current) {
      await engineRef.current.resume();
    }
  };

  return {
    engine: engineRef.current,
    isReady,
    isInitializing,
    resume,
  };
}

