import random, json, os
H = os.path.dirname(os.path.abspath(__file__))
R = os.path.join(H, "..", "..")
src = {
 "R1": ("../../ear/png/R1-p1-128.png", "../../ear/png/R1-mono-64.png", "../../ear/png/R1-mono-16.png"),
 "E1": ("../../ear/png/E1-p1-128.png", "../../ear/png/E1-mono-64.png", "../../ear/png/E1-mono-16.png"),
 "E3": ("../../ear/png/E3-p1-128.png", "../../ear/png/E3-mono-64.png", "../../ear/png/E3-mono-16.png"),
 "E4": ("../../ear/png/E4-p1-128.png", "../../ear/png/E4-mono-64.png", "../../ear/png/E4-mono-16.png"),
 "G1": ("../../../graph-marks/G1/png/mark-P1-128.png", "../../../graph-marks/G1/png/mark-mono-64.png", "../../../graph-marks/G1/png/mark-mono-16.png"),
 "G2": ("../../../graph-marks/G2/png/mark-P1-128.png", "../../../graph-marks/G2/png/mark-mono-64.png", "../../../graph-marks/G2/png/mark-mono-16.png"),
 "G7": ("../../../graph-marks/G7/png/mark-P1-128.png", "../../../graph-marks/G7/png/mark-mono-64.png", "../../../graph-marks/G7/png/mark-mono-16.png"),
}
random.seed(41)
codes = random.sample(["q","w","k","m","t","z","h"], len(src))
key = {}
os.makedirs(os.path.join(H, "html"), exist_ok=True)
for (k, (a, b, c)), code in zip(src.items(), codes):
    key[code] = k
    open(os.path.join(H, "html", code + ".html"), "w").write(
      f'<body style="margin:0;background:#fff;display:flex;gap:24px;align-items:center;padding:16px;width:520px">'
      f'<img src="{a}" width=128><img src="{b}" width=64><img src="{c}" style="width:128px;height:128px;image-rendering:pixelated"></body>')
json.dump(key, open(os.path.join(H, "key.json"), "w"))
print(key)
