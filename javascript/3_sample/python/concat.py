import cv2
import numpy as np
# python3.9 ene.py

ll = ["pp1.png","pp2.png","pp3.png","pp2.png"]

# 透明度も引き継ぐならー１
flag = -1
im = []

def hfunc(ll):
  im = []
  for ii in ll:
    print(ii)
    img1 = cv2.imread(ii,flag)
    im.append(img1)
  return cv2.hconcat(im)

def vfunc(ll):
  im = []
  for aa in ll:
    ii = hfunc(aa)
    im.append(ii)
  return cv2.vconcat(im)


im = hfunc(ll)
cv2.imwrite('../pict.png', im)

