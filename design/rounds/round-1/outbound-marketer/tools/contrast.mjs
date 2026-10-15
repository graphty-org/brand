const L = h => { const c = [1,3,5].map(i => parseInt(h.slice(i,i+2),16)/255).map(v => v<=0.03928? v/12.92 : ((v+0.055)/1.055)**2.4); return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2]; };
const cr = (a,b) => { const x=L(a), y=L(b); return ((Math.max(x,y)+0.05)/(Math.min(x,y)+0.05)).toFixed(2); };
const bg = {white:"#ffffff",ws:"#f5f5f5",panel:"#2c2c2c",ghdark:"#0d1117",vpdark:"#1b1b1f"};
for (const c of process.argv.slice(2)) console.log(c, Object.entries(bg).map(([k,b])=>k+"="+cr(c,b)).join(" "));
