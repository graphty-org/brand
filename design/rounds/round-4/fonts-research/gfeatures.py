# For each downloaded font, list the GSUB features that substitute the "g" glyph,
# and the font's license (name ID 13/14). Run with python3.10 (fontTools installed there).
import glob, json, os, re
from fontTools.ttLib import TTFont
out = {}
for path in sorted(glob.glob(os.path.join(os.path.dirname(__file__) or ".", "full", "*.ttf"))):
    fam, w = re.match(r".*/(.*)()\.ttf$", path).groups()
    if fam in out: continue
    f = TTFont(path)
    g = f.getBestCmap().get(ord("g"))
    lic = (f["name"].getDebugName(13) or "")[:60]
    feats = []
    if "GSUB" in f and f["GSUB"].table.FeatureList:
        gs = f["GSUB"].table
        for fr in gs.FeatureList.FeatureRecord:
            tag = fr.FeatureTag
            if not re.match(r"ss\d\d|cv\d\d|salt|aalt", tag) or tag == "aalt": continue
            for li in fr.Feature.LookupListIndex:
                lk = gs.LookupList.Lookup[li]
                for st in lk.SubTable:
                    st = getattr(st, "ExtSubTable", st)
                    m = getattr(st, "mapping", None) or getattr(st, "alternates", None)
                    if m and g in m:
                        name = ""
                        p = fr.Feature.FeatureParams
                        if p is not None and getattr(p, "UINameID", None):
                            name = f["name"].getDebugName(p.UINameID) or ""
                        feats.append(f"{tag}:{m[g]}" + (f" ({name})" if name else ""))
    out[fam] = {"g": g, "alts": sorted(set(feats)), "license": lic}
json.dump(out, open("g-features.json", "w"), indent=1)
for k, v in out.items():
    print(f"{k:28} {v['license'][:30]:30} {' | '.join(v['alts'])}")
