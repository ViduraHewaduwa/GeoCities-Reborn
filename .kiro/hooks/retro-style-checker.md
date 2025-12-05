---
name: "Retro Style Checker"
description: "Verify CSS files maintain the GeoCities retro aesthetic"
trigger: "onFileSave"
filePattern: "frontend/src/**/*.css"
enabled: true
---

# Retro Style Checker

Ensure all CSS files maintain the authentic GeoCities retro aesthetic.

## Required Elements

### Color Palette
- ✅ Neon colors: #ff00ff (magenta), #00ffff (cyan), #ffff00 (yellow)
- ✅ Dark backgrounds: #1a1a2e, #16213e, #0f3460
- ✅ Bright accents: #ff0000 (red), #00ff00 (green)

### Typography
- ✅ Comic Sans MS for body text
- ✅ Impact or Arial Black for headers
- ✅ Courier New for code/monospace

### Effects
- ✅ Text shadows with multiple colors
- ✅ Box shadows (3D effect)
- ✅ Gradients (linear or radial)
- ✅ Animations (blink, pulse, rainbow, float)
- ✅ Borders (ridge, outset, solid with bright colors)

### Animations
Common retro animations:
- `@keyframes blink` - Blinking text
- `@keyframes pulse` - Pulsing elements
- `@keyframes rainbow` - Color cycling
- `@keyframes float` - Floating motion
- `@keyframes glow` - Glowing effect

## Instructions

When a CSS file is saved:
1. Check if it uses retro color palette
2. Verify font choices match the aesthetic
3. Look for animations and effects
4. Suggest improvements if it's too modern/minimal
5. Recommend adding retro flair if missing

Don't be too strict—just ensure the 90s vibe is present!
