import { SoundLayer } from '@/types/world';

/**
 * Web Audio API wrapper for managing sound layers
 */
export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private gainNodes: Map<string, GainNode> = new Map();
  private audioBuffers: Map<string, AudioBuffer> = new Map();
  private sourceNodes: Map<string, AudioBufferSourceNode> = new Map();
  private isInitialized = false;

  /**
   * Initialize the audio context (must be called after user interaction)
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
      throw error;
    }
  }

  /**
   * Check if audio context is initialized
   */
  isReady(): boolean {
    return this.isInitialized && this.audioContext !== null;
  }

  /**
   * Resume audio context (required after user interaction)
   */
  async resume(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  /**
   * Check if audio buffer is loaded for a layer
   */
  hasAudioBuffer(layerId: string): boolean {
    return this.audioBuffers.has(layerId);
  }

  /**
   * Load an audio file and store the buffer
   */
  async loadAudio(layerId: string, audioUrl: string): Promise<void> {
    if (!this.audioContext) {
      throw new Error('Audio context not initialized');
    }

    // Don't reload if already loaded
    if (this.audioBuffers.has(layerId)) {
      return;
    }

    try {
      const response = await fetch(audioUrl);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.audioBuffers.set(layerId, audioBuffer);
    } catch (error) {
      console.error(`Failed to load audio for layer ${layerId}:`, error);
      throw error;
    }
  }

  /**
   * Start playing a continuous sound layer
   */
  startLayer(layerId: string, volume: number, startOffset: number = 0): void {
    if (!this.audioContext || !this.audioBuffers.has(layerId)) {
      return;
    }

    // Stop existing source if any
    this.stopLayer(layerId);

    const buffer = this.audioBuffers.get(layerId)!;
    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();

    source.buffer = buffer;
    source.loop = true;
    source.loopStart = 0;
    source.loopEnd = buffer.duration;

    // Set initial volume
    gainNode.gain.value = volume;

    // Connect: source -> gain -> destination
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Start at random offset to avoid synchronization
    const offset = startOffset % buffer.duration;
    source.start(0, offset);

    this.sourceNodes.set(layerId, source);
    this.gainNodes.set(layerId, gainNode);
  }

  /**
   * Stop playing a layer
   */
  stopLayer(layerId: string): void {
    const source = this.sourceNodes.get(layerId);
    if (source) {
      try {
        source.stop();
      } catch (e) {
        // Source may already be stopped
      }
      source.disconnect();
      this.sourceNodes.delete(layerId);
    }
  }

  /**
   * Update volume for a layer
   */
  setVolume(layerId: string, volume: number): void {
    const gainNode = this.gainNodes.get(layerId);
    if (gainNode && this.audioContext) {
      gainNode.gain.setTargetAtTime(
        volume,
        this.audioContext.currentTime,
        0.01 // Smooth transition
      );
    }
  }

  /**
   * Stop all layers and clean up
   */
  stopAll(): void {
    for (const layerId of this.sourceNodes.keys()) {
      this.stopLayer(layerId);
    }
    this.gainNodes.clear();
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    this.stopAll();
    this.audioBuffers.clear();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.isInitialized = false;
  }
}

// Singleton instance
let audioEngineInstance: AudioEngine | null = null;

export function getAudioEngine(): AudioEngine {
  if (!audioEngineInstance) {
    audioEngineInstance = new AudioEngine();
  }
  return audioEngineInstance;
}

