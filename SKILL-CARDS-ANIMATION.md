# Skill Cards Interactive Animation - Documentation

## Overview
Skill cards sekarang memiliki animasi interaktif yang mengikuti pergerakan cursor dengan berbagai efek visual yang menarik.

## Features Added

### 1. 3D Hover Effect
- Cards mengikuti pergerakan mouse dengan efek rotasi 3D
- Menggunakan `transform: rotateX() rotateY()` untuk efek depth
- Smooth transition dengan cubic-bezier easing

### 2. Ripple Animation
- Efek gelombang yang muncul saat mouse enter
- Posisi ripple mengikuti posisi cursor
- Animasi scale dari 0 ke 4 dengan fade out

### 3. Glow Effect
- Box shadow dengan warna teal saat hover
- Intensity yang dapat disesuaikan
- Smooth fade in/out

### 4. Floating Animation
- Animasi melayang yang berbeda untuk card ganjil dan genap
- Menggunakan `animation: float` dengan direction normal/reverse
- Animasi berhenti saat hover untuk fokus pada interaksi

### 5. PNG Icon System
- Mendukung custom PNG icons (64x64 recommended)
- Automatic fallback ke Lucide icons
- Error handling dengan `onerror` attribute

## File Structure
```
assets/
├── icons/
│   ├── microcontroller.png
│   ├── programming.png
│   ├── pcb-design.png
│   ├── simulation.png
│   ├── power-systems.png
│   ├── machine-learning.png
│   ├── iot.png
│   ├── problem-solving.png
│   ├── placeholder-styles.css
│   └── README.md
├── test-skills.html (untuk testing)
└── skill-card-template.html (template)
```

## CSS Classes Added
- `.skill-card` - Enhanced with 3D perspective
- `.skill-icon` - Improved centering and transitions
- `.ripple-effect` - Ripple animation styles
- `.skill-icon-placeholder` - Fallback icon styles

## JavaScript Functions
- `mouseenter` - Creates ripple effect and glow
- `mouseleave` - Resets transforms and effects
- `mousemove` - 3D rotation following cursor

## Performance Optimizations
- `backface-visibility: hidden` untuk smooth animations
- `transform-style: preserve-3d` untuk 3D effects
- Hardware acceleration dengan `transform: translateZ(0)`
- Efficient event handling dengan proper cleanup

## Browser Support
- Modern browsers dengan CSS3 transform support
- Fallback untuk older browsers
- Mobile responsive dengan adjusted effects

## Customization
1. **Animation Speed**: Modify transition duration in CSS
2. **Rotation Intensity**: Adjust division factor in mousemove event
3. **Ripple Color**: Change rgba values in ripple-effect styles
4. **Glow Color**: Modify box-shadow color in hover states

## Testing
Use `test-skills.html` untuk test animasi tanpa dependencies lain.

## Mobile Considerations
- Reduced transform intensity untuk touch devices
- Simplified animations untuk better performance
- Responsive icon sizing
