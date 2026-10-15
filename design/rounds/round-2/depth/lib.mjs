// Geometry and drawing for the depth marks. A mark is { nodes: [{x,y,r,t}], edges: [[a,b]], near }
// in a 64 x 64 box; t is depth (0 nearest, 1 farthest) and drives size, edge taper and tone.
let uid = 0;
const f2 = (n) => Math.round(n * 100) / 100;

// Fit nodes (with their radii) into the 64 box, padding p, then round everything.
function fit(nodes, p = 3) {
    const x0 = Math.min(...nodes.map((n) => n.x - n.r)), x1 = Math.max(...nodes.map((n) => n.x + n.r));
    const y0 = Math.min(...nodes.map((n) => n.y - n.r)), y1 = Math.max(...nodes.map((n) => n.y + n.r));
    const s = (64 - 2 * p) / Math.max(x1 - x0, y1 - y0);
    const ox = (64 - (x1 - x0) * s) / 2 - x0 * s, oy = (64 - (y1 - y0) * s) / 2 - y0 * s;
    return nodes.map((n) => ({ ...n, x: f2(n.x * s + ox), y: f2(n.y * s + oy), r: f2(n.r * s) }));
}

// A real perspective projection of a regular tetrahedron (K4 in 3D).
export function tetra({ yaw = -35, pitch = -15, dist = 3.2, R = 0.42, roll = 0 } = {}) {
    const c = Math.cos((roll * Math.PI) / 180), sn = Math.sin((roll * Math.PI) / 180);
    const V = [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]];
    const a = (yaw * Math.PI) / 180, b = (pitch * Math.PI) / 180;
    const P = V.map(([x, y, z]) => {
        const x1 = x * Math.cos(a) + z * Math.sin(a), z1 = -x * Math.sin(a) + z * Math.cos(a);
        const y2 = y * Math.cos(b) - z1 * Math.sin(b), z2 = y * Math.sin(b) + z1 * Math.cos(b);
        const d = dist + z2;
        const px = (x1 * 2) / d, py = (-y2 * 2) / d;
        return { x: px * c - py * sn, y: px * sn + py * c, r: (R * 2) / d, d };
    });
    const dmin = Math.min(...P.map((p) => p.d)), dmax = Math.max(...P.map((p) => p.d));
    const nodes = fit(P.map((p) => ({ ...p, t: (p.d - dmin) / (dmax - dmin) })));
    const near = nodes.indexOf(nodes.reduce((m, n) => (n.t < m.t ? n : m)));
    return { nodes, edges: [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]], near };
}

const mix = (c1, c2, t) => {
    const h = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
    const [a, b] = [h(c1), h(c2)];
    return "#" + a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, "0")).join("");
};

export const PAL = {
    light: { front: "#3355e0", back: "#8fa2ee", accent: "#f0a500", ink: "#1a1f36", bg: "#ffffff" },
    dark: { front: "#8aa4ff", back: "#46559a", accent: "#ffc21a", ink: "#eef0fb", bg: "#0d1117" },
    mono: { front: "#1a1f36", back: "#1a1f36", accent: "#1a1f36", ink: "#1a1f36", bg: "#ffffff" },
};

// Tapered edge: a quad whose half-width follows the node sizes at its two ends.
function edge(p, q, k = 0.34, min = 1.9) {
    const dx = q.x - p.x, dy = q.y - p.y, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
    const w1 = Math.max(min, p.r * k), w2 = Math.max(min, q.r * k);
    return [[p.x + nx * w1, p.y + ny * w1], [q.x + nx * w2, q.y + ny * w2], [q.x - nx * w2, q.y - ny * w2], [p.x - nx * w1, p.y - ny * w1]]
        .map(([x, y]) => `${f2(x)},${f2(y)}`).join(" ");
}

// Draw a mark as SVG elements. opts: pal; hi (edge keys "a-b") and hiNodes (indexes) drawn in the
// accent; allAccent (every edge in the accent); nearAccent (default true); gap (ring cut around the
// near node, default 2.6); under (svg drawn first, also cut by the gap).
export function drawMark(m, o = {}) {
    const pal = o.pal || PAL.light;
    const hi = new Set(o.hi || []);
    const hn = new Set(o.hiNodes || []);
    const N = m.nodes;
    const id = `g${++uid}`;
    const near = N[m.near];
    const gap = o.gap ?? 2.6;
    const tone = (t) => mix(pal.front, pal.back, Math.min(1, t * 1.15));
    const order = m.edges.map((e) => ({ e, t: (N[e[0]].t + N[e[1]].t) / 2 })).sort((a, b) => b.t - a.t);
    const edges = (front) => order.filter(({ e }) => e.includes(m.near) === front).map(({ e, t }) => {
        const on = o.allAccent || hi.has(`${e[0]}-${e[1]}`) || hi.has(`${e[1]}-${e[0]}`);
        return `<polygon points="${edge(N[e[0]], N[e[1]], on ? 0.4 : 0.34)}" fill="${on ? pal.accent : tone(t)}"/>`;
    }).join("");
    let body = (o.under || "") + edges(false);
    N.forEach((n, i) => { if (i !== m.near) body += `<circle cx="${n.x}" cy="${n.y}" r="${n.r}" fill="${hn.has(i) ? pal.accent : tone(n.t)}"/>`; });
    body += edges(true); // edges into the near node pass over the far nodes
    let out = gap
        ? `<defs><mask id="${id}" maskUnits="userSpaceOnUse" x="-40" y="-40" width="144" height="144"><rect x="-40" y="-40" width="144" height="144" fill="#fff"/><circle cx="${near.x}" cy="${near.y}" r="${f2(near.r + gap)}" fill="#000"/></mask></defs><g mask="url(#${id})">${body}</g>`
        : body;
    out += `<circle cx="${near.x}" cy="${near.y}" r="${near.r}" fill="${o.nearAccent === false ? tone(0) : pal.accent}"/>`;
    return out;
}

// Scale and move a mark (node coordinates and radii), so frames can sit around it.
export const place = (m, s, tx, ty) => ({ ...m, nodes: m.nodes.map((n) => ({ ...n, x: f2(n.x * s + tx), y: f2(n.y * s + ty), r: f2(n.r * s) })) });

// Mirror a mark left to right.
export const mirror = (m) => ({ ...m, nodes: m.nodes.map((n) => ({ ...n, x: f2(64 - n.x) })) });

// The depth-g: a ring of nodes lying on a tilted plane (an ellipse in perspective: far top small,
// near bottom larger) forms the bowl; the stem drops from its right side and swings toward the
// viewer, ending in the nearest, largest node, the tail of the g.
export function gmark({ k = 6, cx = 30, cy = 21, rx = 17, ry = 13 } = {}) {
    const nodes = [];
    for (let i = 0; i < k; i++) {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / k + Math.PI / k;
        const t = 0.5 - 0.5 * Math.sin(a) * 1; // top (sin -1) far
        nodes.push({ x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a), r: 3.0 + 1.8 * (1 - t), t: 0.35 + 0.65 * t });
    }
    const right = nodes.reduce((m, n, i) => (n.x > nodes[m].x ? i : m), 0);
    const R = nodes[right];
    nodes.push({ x: R.x + 1, y: 45, r: 5.6, t: 0.3 }, { x: 22, y: 53, r: 10, t: 0 });
    const edges = nodes.slice(0, k).map((_, i) => [i, (i + 1) % k]);
    edges.push([right, k], [k, k + 1]);
    return { nodes: fit(nodes, 2.5), edges, near: k + 1 };
}
