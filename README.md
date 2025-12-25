# Elsewhere

A web application that simulates realistic ambient "worlds" to help people who work from home feel like they are in real public or semi-public environments.

## Overview

This application creates a sense of human presence and environmental context using layered, loopable ambient sounds that can be mixed, toggled, and evolved over time. It's designed for deep work, creative work, and ambient presence without cognitive interruption.

## Features

- **Multiple Worlds**: Select from different environments (Subway, Café, Bar, Office, Airport, etc.)
- **Layered Audio**: Each world contains multiple independent sound layers
- **Mixer Controls**: Toggle layers on/off, adjust volume, and control intensity
- **Presets**: Pre-configured mixes for each world (e.g., "Rush Hour", "Late Night", "Quiet")
- **Event-based Sounds**: Some layers trigger probabilistically over time
- **Random Offsets**: Layers start at random offsets to avoid obvious looping

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn UI** - UI components
- **Web Audio API** - Audio mixing and control
- **Radix UI** - Accessible component primitives

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── src/
│   ├── components/        # React components
│   │   └── ui/           # Shadcn UI components
│   ├── data/             # World definitions and data
│   ├── hooks/            # React hooks
│   ├── lib/              # Utilities and core logic
│   │   ├── audio-engine.ts  # Web Audio API wrapper
│   │   └── utils.ts      # Utility functions
│   └── types/            # TypeScript type definitions
└── public/               # Static assets (audio files go here)
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Audio Files

Audio files should be placed in the `public/audio/` directory, organized by world.

**See [public/audio/README.md](public/audio/README.md) for detailed instructions on:**
- Directory structure
- Naming conventions (must match layer IDs)
- Audio file requirements
- Tips for creating seamless loops

### Quick Reference

```
public/
  audio/
    subway/
      base-motion-hum.mp3      # Matches layer id: "base-motion-hum"
      track-rhythm.mp3          # Matches layer id: "track-rhythm"
      ...
    cafe/
      coffee-machine.mp3        # Matches layer id: "coffee-machine"
      ...
```

**Naming Rule**: File names must exactly match the `id` field from the layer definition in `data/worlds.ts`, using kebab-case (lowercase with hyphens).

## Architecture

### Audio Engine (`src/lib/audio-engine.ts`)

The `AudioEngine` class manages all audio playback:
- Loads and caches audio buffers
- Manages continuous loops with random offsets
- Handles event-based sounds with probabilistic scheduling
- Provides volume control and layer management

### World State (`src/hooks/useWorldState.ts`)

The `useWorldState` hook manages:
- World selection and initialization
- Layer state (enabled/disabled, volume)
- Preset application
- Audio engine synchronization

### Data Models (`src/types/world.ts`)

TypeScript interfaces define:
- `World` - Complete world definition with layers and presets
- `SoundLayer` - Individual sound layer configuration
- `WorldPreset` - Pre-configured layer settings
- `WorldState` - Runtime state management

## Adding New Worlds

1. Create audio files and place them in `public/audio/{world-id}/`
2. Add world definition to `src/data/worlds.ts`:

```typescript
{
  id: 'cafe',
  name: 'Café',
  description: '...',
  category: 'Social',
  layers: [...],
  presets: [...]
}
```

## Design Principles

- **Calm > clever** - Simple, unobtrusive interface
- **Realistic > dramatic** - Authentic ambient sounds
- **Subtle > loud** - Conservative default volumes
- **Presence > information** - Focus on feeling, not data

## License

MIT

