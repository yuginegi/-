function mapdraw(ctx, i, j){
  let v = map[j][i];
  if(v <= 0){return;}
  let [ix,iy] = [(v-1)%4, Math.floor((v-1)/4)];
  let [ax,ay] = [gMMM*ix,gMMM*iy];
  let [xx,yy] = [gMMM*i,gMMM*j];
  ctx.drawImage(gimg[0],ax,ay,gMMM,gMMM,xx,yy,gMMM,gMMM);
}

var map = []; // Y,X
function mapInit(){
  for(let j=0;j<gNYY;j++){
    map[j] = new Array(gNXX).fill(0);
  }
  yukaInit();
}
function mapreset(){
  for(let j=0;j<gNYY;j++){
  for(let i=0;i<gNXX;i++){
    map[j][i]=0;
  }}
}
function mapInit1(n){
  mapset4(3,0,0,16,1);
  for(let j=5;j<8;j++){
    mapset4(3,0,j*2,16,1);
  }
  mapset4(3,15,2,1,10);
  mapset(0,0,2,1,8);
  mapset(9,0,2,1,(Math.floor(tt/2))%9);
  mapset2(13,3,0,10,15,1); // 難しい
  yuka1();
}

function mapInit2(n){
  mapset4(3,0,0,16,6);
  mapset4(3,0,12,16,3);
  mapset4(3,14,10,2,2);
  mapset4(3,0,2,1,10);

  mapset2(13,3,2,12,12,1); // 難しい
  mapset2(13,3,14,10,2,1); // 難しい
  mapset(6,2,12,1,3);
  yuka2();
}

function mapInit3(n){
  mapset4(3,0,0,16,2); // 天井
  mapset4(3,0,14,16,1); // 床
  mapset4(3,0,2,1,12); // 左壁
  mapset4(3,14,2,2,12); // 右壁
  mapset(6,2,0,1,4);

  yukareset();
  ysm(1,6,2);
  ysm(1,6,3);
  ysm(1,6,4);

  let tm = Math.floor(tt/30)%6;
  if(tm == 1||tm ==2){ysm(1,5,7);}
  if(tm == 3||tm ==4){ysm(1,7,8);}
  if(tm == 3||tm ==2){ysm(1,6,11);}
  if(tm == 1||tm ==2){ysm(1,9,11);}

  ysm(1,12,12);
  ysm(1,12,9);
  ysm(1,12,6);
  
  yuka3();
}
function yuka3(){
  for(let i=0;i<gNXX;i++){
    ymap[14][i] = 1;
  }
}

//=========================================================
function ysm(v,j,i){
  if(map[j] && map[j][i] >=0){
    map[j][i]=v;
    ymap[j][i]=1;
  }
}
function sm(v,j,i){
  if(map[j] && map[j][i] >=0){map[j][i]=v;}
}
function mapset4(v,x,y,w,h){
  for(let j=y;j<(y+h);j+=2){
  for(let i=x;i<(x+w);i+=2){
    sm(v,j,i);
    sm(v+1,j,i+1);
    sm(v+4,j+1,i);
    sm(v+5,j+1,i+1);
  }}
}
function mapset(v,x,y,w,h){
  for(let j=y;j<(y+h);j++){
  for(let i=x;i<(x+w);i++){
    map[j][i] = v;
  }}
}
function mapset2(v,vv,x,y,w,h){
  for(let j=y;j<(y+h);j++){
  for(let i=x;i<(x+w);i++){
    map[j][i] = v+((i+j+tt)%vv);
  }}
}