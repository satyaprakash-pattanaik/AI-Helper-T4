export function detectTheme(): "light" | "dark" {
  // Check for explicit dark mode class first
  if (document.documentElement.classList.contains('dark') || 
      document.body.classList.contains('dark')) {
    return "dark";
  }

  // Check prefers-color-scheme
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return "dark";
  }

  // Fallback to background color detection
  const brightness = window.getComputedStyle(document.body).backgroundColor;
  if(!brightness) return "light";
  
  const rgb = brightness.match(/\d+/g);
  if(!rgb || rgb.length < 3) return "light";
  
  const [r, g, b] = rgb.map(Number);
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  
  return lum > 128 ? "light" : "dark";
}