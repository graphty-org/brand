import os
from PIL import Image, ImageDraw
R=os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '')
c=[('3B',R+'3B-variations/png/3B-ink-lime-light-{}.png',R+'3B-variations/png/3B-mono-{}.png',R+'3B-variations/png/3B-mono-dark-{}.png')]
for m in ['R1','R2']: c.append((m,R+f'3B-variations/png/{m}-ink-lime-light-{{}}.png',R+f'3B-variations/png/{m}-mono-{{}}.png',R+f'3B-variations/png/{m}-mono-dark-{{}}.png'))
for g in range(1,8): c.append((f'G{g}',R+f'graph-marks/G{g}/png/mark-P1-{{}}.png',R+f'graph-marks/G{g}/png/mark-mono-{{}}.png',R+f'graph-marks/G{g}/png/mark-mono-white-{{}}.png'))
W=128+16+64+16+128+16+128+16+128+40
S=Image.new('RGB',(W,len(c)*150),'white');d=ImageDraw.Draw(S)
for i,(n,p,mo,md) in enumerate(c):
  y=i*150+10;x=40;d.text((2,y),n,fill='black')
  def paste(im,x,bg='white'):
    im=im.convert('RGBA');b=Image.new('RGBA',im.size,bg);b.alpha_composite(im);S.paste(b.convert('RGB'),(x,y))
  paste(Image.open(p.format(128)),x);x+=144
  paste(Image.open(p.format(64)),x);x+=80
  paste(Image.open(p.format(16)).resize((128,128),Image.NEAREST),x);x+=144
  paste(Image.open(mo.format(16)).resize((128,128),Image.NEAREST),x);x+=144
  paste(Image.open(md.format(16)).resize((128,128),Image.NEAREST),x,'#14141c')
S.save(R+'panel-bio/contact.png')
