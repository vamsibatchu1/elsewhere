# Audio Files Directory

This directory contains all audio files for the ambient worlds.

## Directory Structure

Organize audio files by world in subdirectories:

```
public/
  audio/
    subway/
      base-motion-hum.mp3
      track-rhythm.mp3
      tunnel-resonance.mp3
      ...
    cafe/
      coffee-machine.mp3
      cafe-murmur.mp3
      ...
    bar/
      bar-ambience.mp3
      glass-clinking.mp3
      ...
    office/
      keyboard-typing.mp3
      office-murmur.mp3
      ...
    airport/
      airport-ambience.mp3
      announcements.mp3
      ...
    hotel/
      lobby-ambience.mp3
      soft-conversations.mp3
      ...
```

## Naming Convention

**File names should match the layer `id` from `data/worlds.ts`:**

- Use **kebab-case** (lowercase with hyphens)
- Match exactly with the `id` field in the layer definition
- Use `.mp3` extension (or `.wav`, `.ogg` if you prefer, but update the URLs in `worlds.ts`)

### Examples:

| Layer ID | File Name |
|----------|-----------|
| `base-motion-hum` | `base-motion-hum.mp3` |
| `track-rhythm` | `track-rhythm.mp3` |
| `phone-conversations` | `phone-conversations.mp3` |
| `coffee-machine` | `coffee-machine.mp3` |

## Audio File Requirements

### For Continuous Layers:
- **Seamlessly loopable** - The start and end should blend smoothly
- **Length**: 30-120 seconds recommended (longer is fine, will loop)
- **Format**: MP3, WAV, or OGG
- **Quality**: 44.1kHz, 16-bit minimum
- **Volume**: Normalized to avoid clipping

### For Event-based Layers:
- **Complete sound** - Full event from start to finish
- **Length**: 2-10 seconds typically
- **Format**: MP3, WAV, or OGG
- **Quality**: 44.1kHz, 16-bit minimum
- **Volume**: Normalized to avoid clipping

## Tips

1. **Test looping**: Make sure continuous sounds loop seamlessly without clicks or pops
2. **Normalize volume**: Use audio editing software to normalize levels across all files
3. **Keep it subtle**: Remember these are ambient sounds - they should be present but not distracting
4. **No intelligible speech**: As per the app requirements, avoid recognizable words or phrases

## Adding New Worlds

When adding a new world:

1. Create a new directory: `public/audio/{world-id}/`
2. Add audio files matching the layer IDs
3. Update `data/worlds.ts` with the correct `audioUrl` paths

