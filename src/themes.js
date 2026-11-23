// Every design style the portfolio can switch into.
// sw = swatch [background, accent, ink], font = sample font for the picker,
// lerp = Lenis smoothness (lower = silkier), rv = scroll-reveal motion, hero = intro motion.
export const THEMES = [
  { id: 'professional', name: 'Professional', blurb: 'Dark, focused, one electric accent.', sw: ['#000000', '#4A63FF', '#EEF0FF'], font: "'Instrument Sans'", lerp: 0.1,
    rv: { from: { y: 26, opacity: 0 }, to: { y: 0, opacity: 1, duration: 0.9, ease: 'expo.out' } } },
  { id: 'minimal', name: 'Minimal', blurb: 'White space, black type, nothing extra.', sw: ['#FAFAF9', '#111111', '#111111'], font: "'Inter'", lerp: 0.08,
    rv: { from: { y: 14, opacity: 0 }, to: { y: 0, opacity: 1, duration: 1.2, ease: 'power2.out' } } },
  { id: 'corporate', name: 'Corporate', blurb: 'Navy, grids and trust. Built for B2B.', sw: ['#F5F7FB', '#0B5FFF', '#0B1F3A'], font: "'IBM Plex Sans'", lerp: 0.1,
    rv: { from: { x: -40, opacity: 0 }, to: { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out' } } },
  { id: 'luxury', name: 'Luxury', blurb: 'Serif type, gold, slow cinematic reveals.', sw: ['#0B0A08', '#C9A86A', '#F3EDE2'], font: "'Cormorant Garamond'", lerp: 0.05,
    rv: { from: { clipPath: 'inset(100% 0% 0% 0%)', y: 40, opacity: 0 }, to: { clipPath: 'inset(0% 0% 0% 0%)', y: 0, opacity: 1, duration: 1.6, ease: 'expo.out' } } },
  { id: 'bold', name: 'Bold', blurb: 'Huge type, hard shadows, loud colour.', sw: ['#FFFDF2', '#FF3B00', '#0A0A0A'], font: "'Archivo Black'", lerp: 0.17,
    rv: { from: { y: 90, rotation: -4, scale: 0.86, opacity: 0 }, to: { y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(2.2)' } } },
  { id: 'glass', name: 'Glassmorphism', blurb: 'Frosted glass over floating colour.', sw: ['#1B1035', '#B794FF', '#FFFFFF'], font: "'Plus Jakarta Sans'", lerp: 0.08,
    rv: { from: { y: 50, scale: 0.95, filter: 'blur(18px)', opacity: 0 }, to: { y: 0, scale: 1, filter: 'blur(0px)', opacity: 1, duration: 1.2, ease: 'power3.out' } } },
  { id: 'neumorph', name: 'Neumorphism', blurb: 'Soft clay surfaces you can press.', sw: ['#E4E9F0', '#5B6CFF', '#3A4256'], font: "'Nunito'", lerp: 0.09,
    rv: { from: { scale: 0.9, opacity: 0 }, to: { scale: 1, opacity: 1, duration: 1.1, ease: 'elastic.out(1,0.75)' } } },
  { id: 'retro', name: 'Retro Y2K', blurb: 'Neon sunset, pixels and scanlines.', sw: ['#1A0B2E', '#FF2BD6', '#00F0FF'], font: "'Press Start 2P'", lerp: 0.14,
    rv: { from: { x: -80, skewX: 20, opacity: 0 }, to: { x: 0, skewX: 0, opacity: 1, duration: 0.6, ease: 'steps(6)' } } },
  { id: 'cyber', name: 'Cyber', blurb: 'Terminal green, glitch and scrambled text.', sw: ['#05070A', '#00FF9C', '#D6FFE9'], font: "'Orbitron'", lerp: 0.13, scramble: true,
    rv: { from: { opacity: 0, x: -16 }, to: { opacity: 1, x: 0, duration: 0.5, ease: 'steps(5)' } } },
  { id: 'organic', name: 'Organic', blurb: 'Earthy tones, soft blobs, natural pace.', sw: ['#F3EFE4', '#C8642B', '#2E3B2A'], font: "'Fraunces'", lerp: 0.06,
    rv: { from: { y: 60, rotation: 2.5, opacity: 0 }, to: { y: 0, rotation: 0, opacity: 1, duration: 1.4, ease: 'power4.out' } } },
  { id: 'swiss', name: 'Swiss', blurb: 'Strict grid, red, big Helvetica-style type.', sw: ['#FFFFFF', '#E30613', '#000000'], font: "'Inter Tight'", lerp: 0.1,
    rv: { from: { clipPath: 'inset(0% 100% 0% 0%)' }, to: { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power4.inOut' } } },
  { id: 'playful', name: 'Playful', blurb: 'Chunky, bouncy, candy colours.', sw: ['#FFF6E9', '#FF5FA2', '#2B1B5A'], font: "'Fredoka'", lerp: 0.12,
    rv: { from: { y: 70, scale: 0.7, rotation: () => gsapRand(-9, 9), opacity: 0 }, to: { y: 0, scale: 1, rotation: 0, opacity: 1, duration: 1, ease: 'elastic.out(1,0.55)' } } },
  { id: 'vice', name: 'GTA 6 Vice', blurb: 'Miami sunset, neon pink and orange, art-panel cards.', sw: ['#2A0F3D', '#FF4FA0', '#FFB347'], font: "'Anton'", lerp: 0.11,
    rv: { from: { x: 120, skewX: -18, opacity: 0, filter: 'blur(10px)' }, to: { x: 0, skewX: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power4.out' } } }
];
function gsapRand(a, b) { return a + Math.random() * (b - a); }
export const THEME_IDS = THEMES.map(t => t.id);
export const LIGHT = ['minimal', 'corporate', 'bold', 'neumorph', 'organic', 'swiss', 'playful'];
