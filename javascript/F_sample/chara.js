function thunderExec(ctx,yd){
  if(bossDwait > 0){bossDwait--;}
  if(mthunder > 0){
    let [xx,yy,dd] = mtpos;
    ctx.fillStyle = "#FFFF00";
    let ww = 15*(20-mthunder);
    let hh = 60;
    xx = (dd == 1)? xx : xx-ww;
    yy = yy-hh/2;
    // 表示
    ctx.fillRect(xx,yy,ww,hh);
    //雷ヒット
    if(bossDwait <= 0){
      yd.thunderhit(xx,yy,ww,hh);
    }
  }
}

function drawHPBAR(ctx){
  let t = Math.floor(tt/10);
  drawGAGE(ctx,48,48,4*charHP,"#CCCC00");
  drawGAGE(ctx,32,48,TPower,"#00CCCC");
  // Enemy
  drawGAGE(ctx,80,48,4*bossHP,"#CC0000");
  return;
}
function drawGAGE(ctx,xx,yy,hp,cl){
  ctx.fillStyle = "#000000";
  ctx.fillRect(xx,yy,16,16*7);
  ctx.fillStyle = cl;
  for(let j=0;j<hp;j++){
      let y = yy+16*7-4-4*j;
      ctx.fillRect(xx+2,y,16-4,2);
  }
}

var bossHP = 7;
var bossDwait = 0;
/****************************************************
 * 前景
 * *************************************************/
// 前景の位置
var dsz = 64; // 描画するサイズ
// 上昇時重力無ければ、15,1.5 当たりがいい感じな・・
var [jjj,ggg] = [-20,+3];//[-25,+5]; // ジャンプ力、重力
var [ox,oy] = [64,64]; // グローバル ＆ 初期値
var jumpsts = 0; // 0:ジャンプしてない、＋：ジャンプしている
var my = 0; // Y方向への影響
var mx = 0; // x方向への影響
var jwait = 0;
var jwaitbase = 5;
var dmgwait = 0;
var charHP = 7; // HP=28
var charSP = 6;
var TPower = 28;
var md = 0; // 向き
var mthunder = 0;
var mtpos = [0,0,0];
function charmove(con){
  // コントローラからキーもらう(pはボタン(0-3に限定)、mは方向キー)
  let [p,m] = con.getPushedKey();
  if(jumpsts==0 && jwait > 0){jwait--;}
  //ジャンプ処理
  else if(jumpsts==0 && p==0){ // ジャンプする
    //console.log("Jump: 0 -> 2");
    jumpsts = 2; // 2に定義しておく
    my = jjj;//-Math.abs(1*m[0]); // とりあえずジャンプ力
    jwait = jwaitbase; // 連続ジャンプは待って
  }

  if(mthunder > 0){mthunder--;}
  if(mthunder<=0 && p==1){
    console.log("Thunder!");
    mthunder = 15;
    TPower--;
    let mtd = (m[0]!=0)? m[0] : md;
    mtpos = [ox+dsz/2,oy,mtd];
  }

  if(jumpsts==2){
    //console.log("Jumping");
    if(p!=0 || my > 0){ // ボタンを離したら、もしくは下降したら
      jumpsts = 1; // 落下
      if(my < 0){my = 0;}
    }
  }
  // 移動
  let sp=charSP; // 横移動のスピード
  if(jumpsts==0){mx = sp*m[0];}
  else{
    mx += (sp/3)*m[0]; // charSPよりは弱く、ブレーキは効く
    if(mx < -charSP){mx=-charSP;}
    if(mx > +charSP){mx=+charSP;}
  }
  //向き
  md = (m[0]!=0)? m[0] : md;
  // X方向
  ox = ox + mx;
  //端に行けないようにする
  let ss = 32;
  if(ox < ss){ox=ss;}
  if(ox > gXXX-ss-dsz){ox=gXXX-ss-dsz;}
  // Y方向
  oy = mapdown(ox,oy,my); // myの更新、この関数に任せる
}

// 前景
function chardraw(ctx,n){
  let psz = 200; // 画像のサイズが200x200
  let ix = (n==3)? 1:n;
  let iy = (jumpsts!=0)?2:0;
  /* if(dmgwait%4 > 1){
    // 表示しない
  }else{
    ctx.drawImage(gImg, psz*ix,psz*iy,psz,psz, ox,oy,dsz,dsz);
  }*/
  if(dmgwait%4 > 1){
    return; // early return
  }
  if(md == -1){
    /* ！！この方法はおススメしません。逆向きの画像を用意しておく方が賢い */
    ctx.save(); // Saveする
    ctx.scale(-1, 1); // 左右反転にする（１）
    ctx.translate(-gXXX,0); // 左右反転にする（２）
    ctx.drawImage(gImg,
    psz*ix,psz*iy,psz,psz, /* 元の絵 の どこを参照する */
    gXXX-ox,oy,-dsz,dsz); /* 左右反転にする（３） */
    ctx.restore(); // Saveにもどる：translateを無かったことにする
  }else{
    ctx.drawImage(gImg,
    psz*ix,psz*iy,psz,psz, /* 元の絵 の どこを参照する */
    ox,oy,dsz,dsz); /* Canvasのどこに描くか */
  }
}
