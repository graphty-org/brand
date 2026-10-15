from PIL import Image, ImageDraw
import os, random, json
R=os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '')
c={'3B':R+'3B-variations/png/3B-','R1':R+'3B-variations/png/R1-','R2':R+'3B-variations/png/R2-'}
for g in ['G1','G2','G3','G4','G5','G6','G7']: c[g]=R+'graph-marks/'+g+'/png/'
keys=list(c); random.seed(7); random.shuffle(keys)
lab={k:chr(65+i) for i,k in enumerate(keys)}
json.dump(lab,open(R+'panel-netsci/key.json','w'))
def p(k,var,s):
    if k in('3B','R1','R2'): return c[k]+{'col':'ink-lime-light','dark':'ink-lime-dark','mono':'mono','monod':'mono-dark'}[var]+'-%d.png'%s
    return c[k]+{'col':'mark-P1','dark':'mark-P1-dark','mono':'mark-mono','monod':'mark-mono-white'}[var]+'-%d.png'%s
W=Image.new('RGB',(900,190*len(keys)),'white'); d=ImageDraw.Draw(W)
for i,k in enumerate(keys):
    y=i*190; d.text((5,y+5),lab[k],fill='black')
    x=30
    for var,bg in [('col','white'),('dark','#14141c'),('mono','white'),('monod','black')]:
        box=Image.new('RGB',(140,140),bg)
        try:
            im=Image.open(p(k,var,128)).convert('RGBA'); box.paste(im,(6,6),im)
        except Exception as e: print(k,var,e)
        W.paste(box,(x,y+10)); x+=145
    for var,bg in [('mono','white'),('monod','black')]:
        try:
            im=Image.open(p(k,var,16)).convert('RGBA'); b=Image.new('RGBA',im.size,bg); b.alpha_composite(im)
            W.paste(b.resize((128,128),Image.NEAREST),(x,y+10)); x+=135
        except Exception as e: print(k,var,e)
    for s,bg in[(16,'white'),(32,'white'),(64,'white')]:
        pass
W.save(R+'panel-netsci/sheet.png')
# actual-size strip
S=Image.new('RGB',(60*len(keys),110),'white'); d=ImageDraw.Draw(S)
for i,k in enumerate(keys):
    for j,(s,var) in enumerate([(16,'col'),(32,'col'),(64,'col')]):
        im=Image.open(p(k,var,s)).convert('RGBA'); S.paste(im,(i*60+2, [2,22,56][j] if s<64 else 40),im) if s<64 else None
    d.text((i*60+40,2),lab[k],fill='black')
S=S.resize((S.width*3,S.height*3),Image.NEAREST); S.save(R+'panel-netsci/actual.png')
