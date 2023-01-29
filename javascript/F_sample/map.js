
var map = []; // Y,X
function mapInit(){
  for(let j=0;j<gNYY;j++){
    map[j] = new Array(gNXX).fill(0);
  }
  // セット
  for(let j=2;j<2+8;j++){
    map[j][0] = 1;
  }
  for(let i=0;i<gXXX;i+=2){
    map[0][i] = 8;
    map[10][i] = 8;
    map[12][i] = 8;
    map[14][i] = 8;
  }
  for(let j=2;j<2+10;j+=2){
    map[j][gNXX-1] = 8;
  }
}
// 関数ポインタ（？）の使いどころ
function mapdraw(ctx, i, j){
  let v = map[j][i];
  let [xx,yy] = [gMMM*i,gMMM*j];
  //DBG//console.log("v="+v);
  if(v==0){return;}
  if(v==1){return mdraw1(ctx,xx,yy);}
  if(v==8){return mdraw8(ctx,xx,yy);}
  ctx.fillStyle = "#FF0000";
  ctx.fillRect(xx,yy,gMMM,gMMM);
}

// 32x32
function mdraw1(ctx,xx,yy){
  ctx.fillStyle = "#8888CC"; // 白め 
  ctx.fillRect(xx+4,yy,          8,gMMM);  
  ctx.fillRect(xx+(gMMM/2)+4,yy, 8,gMMM);
  ctx.fillStyle = "#444488"; // 青め
  ctx.fillRect(xx+8,yy,          4,gMMM);  
  ctx.fillRect(xx+(gMMM/2)+8,yy, 4,gMMM);
  // 黒
  ctx.fillStyle = "#000000";
  // 縦線
  ctx.fillRect(xx,yy,4,gMMM);
  ctx.fillRect(xx+(gMMM/2)-4,yy, 4,gMMM);
  ctx.fillRect(xx+(gMMM/2),yy, 4,gMMM);
  ctx.fillRect(xx+gMMM-4,yy,4,gMMM);
  // 横線
  ctx.fillRect(xx,yy+(gMMM/2)-4,gMMM,4);
  ctx.fillRect(xx,yy+gMMM-4,gMMM,4);
}

// 64x64
function mdraw8(ctx,xx,yy){
  let mm = gMMM*2;
  ctx.fillStyle = "#888888"; // 灰
  ctx.fillRect(xx,yy,mm,mm);
  ctx.fillStyle = "#000000"; // 黒
  ctx.fillRect(xx,yy,1,mm);
  ctx.fillRect(xx+mm-1,yy,1,mm);
  ctx.fillRect(xx,yy,mm,1);
  ctx.fillRect(xx,yy+mm-1,mm,1);
}

function ldraw(ctx){
  ctx.fillStyle = "#0000FF"; // DBG
  for(let j=0;j<gNYY;j++){
  for(let i=0;i<gNXX;i++){
    let [xx,yy] = [gMMM*i,gMMM*j];
    ctx.fillRect(xx+gMMM-1,yy,1,gMMM);
    ctx.fillRect(xx,yy+gMMM-1,gMMM,1);
  }}
}

/****************************************************
 * 背景とマス（map）
 * *************************************************/

var ymap = [];
function yukaInit(){
  for(let j=0;j<gNYY;j++){
    ymap[j] = new Array(gNXX).fill(0);
  }
 for(let i=0;i<gNXX;i++){
    ymap[10][i] = 1;
  }
}

function yukadraw(ctx){
  // 床
  ctx.fillStyle = "#000000";
  ctx.fillRect(32*0,32*10,32*15,32);
  ctx.fillStyle = "#CCCCCC";
  ctx.fillRect(32*0,32*10,32*15,6);
  ctx.fillRect(32*0,32*10+32-6,32*15,6);
  ctx.fillStyle = "#CCCC44";
  for(let i=32*0;i<32*15;i=i+6){
    ctx.fillRect(i+2,32*10+10,4,32-20);
  }
}

// ＜床が無ければ落ちる、床があれば留まる処理＞
// ！！ 入力がキャラの左上の点であることに注意
// 重力とかジャンプ系をこちらに持ってきた
function mapdown(xx,yy,ly){
  // 上昇時は落下の危険性なし。「early return」
  if(yy < 0 || ly < 0){
    my += ggg;
    my = (-jjj < my) ? -jjj : my; // 落下速度遅くなりすぎない
    return yy+ly;
  }
  // ０のとき、落下の危険性があるかを判定
  let csz = dsz; // キャラのサイズ
  let msz = gMMM;
  let x = Math.floor((xx+(csz/2))/msz); // 中心の点をX
  let s = Math.floor((yy+csz)/msz); // 足元のY座標：キャラの上部からサイズを足す
  let e = Math.floor((yy+csz+ly)/msz); // 落下予定のY座標：さらに落下距離足す
  // 床があるかどうか
  for(let i=s;i<=e;i++){
    if(ymap[i][x]!=0){
      if(jumpsts==1){jumpsts = 0;} // 飛んでないことにする
      my = 0; // 念のため０にする
      //DBG//console.log("md2");
      return i*msz-csz; // 床から計算したキャラの上の座標を渡す
    }
  }
  jumpsts = 1; // （落下しているので）ジャンプはできない
  my += ggg; // 重力
  my = (-jjj < my) ? -jjj : my; // 落下速度遅くなりすぎない
  return yy+ly;
}
