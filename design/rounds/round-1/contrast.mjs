const L = h => { const c = [1,3,5].map(i => parseInt(h.slice(i,i+2),16)/255).map(v => v<=0.03928? v/12.92 : ((v+0.055)/1.055)**2.4); return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2]; };
const cr = (a,b) => { const x=L(a), y=L(b); return ((Math.max(x,y)+0.05)/(Math.min(x,y)+0.05)).toFixed(2); };
const fg = {"brand-6 #0d99ff":"#0d99ff","brand-7 #007be5":"#007be5","AA brand #0768cf":"#0768cf","dark brand-8 #0c8ce9":"#0c8ce9","dark AA #0a6dc2":"#0a6dc2","dark text-brand #7cc4f8":"#7cc4f8","node default #6366f1":"#6366f1","VP brand light #3451b2":"#3451b2","VP brand dark #a8b1ff":"#a8b1ff","palette blue #5b8ff9":"#5b8ff9","palette red #ff6b6b":"#ff6b6b","palette green #61d095":"#61d095","palette amber #f7b731":"#f7b731","palette purple #9b59b6":"#9b59b6","select gold #ffd700":"#ffd700","vr blue #1c64d8":"#1c64d8"};
const bg = {white:"#ffffff",whitesmoke:"#f5f5f5",gh_light:"#ffffff",panel_dark:"#2c2c2c",menu:"#1e1e1e",vp_dark:"#1b1b1f",gh_dark:"#0d1117"};
console.log(["color", ...Object.keys(bg)].join(" | "));
for (const [n,c] of Object.entries(fg)) console.log([n, ...Object.values(bg).map(b=>cr(c,b))].join(" | "));
