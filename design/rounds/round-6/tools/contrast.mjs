// Contrast ratios (WCAG 2.x) of candidate accents on white and on #111111.
export const lum = (hex) => { const c = hex.match(/\w\w/g).map((h) => parseInt(h, 16) / 255).map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
export const cr = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return +((x + 0.05) / (y + 0.05)).toFixed(2); };
if (import.meta.url === `file://${process.argv[1]}`) {
  for (const h of process.argv.slice(2)) console.log(h, "white", cr(h, "#ffffff"), "#111", cr(h, "#111111"), "#12131a", cr(h, "#12131a"));
}
