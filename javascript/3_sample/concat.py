import cv2
import numpy as np
# python3.9 ene.py

ll = ["pp1.png","pp2.png","pp3.png","pp2.png"]

# “§–¾“x‚àˆø‚«Œp‚®‚È‚ç[‚P
flag = -1
im = []

def hfunc(ll):
  im = []
  for ii in ll:
    imgnm = ii+".png"
    print(imgnm)
    img1 = cv2.imread(imgnm,flag)
    img2 = img1[0:64, 0:64, :]
    im.append(img2)
    img3 = cv2.flip(img2, 1)
    im.append(img3)
  return cv2.hconcat(im)

def vfunc(ll):
  im = []
  for aa in ll:
    ii = hfunc(aa)
    im.append(ii)
  return cv2.vconcat(im)


im = hfunc(ll)
cv2.imwrite('pict.png', im)


