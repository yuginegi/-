
//--------------------------------------
//=== メインオブジェクト ===
var pconf;

//=== 実装サイズを 1024*768 にする
var gSize = 256;
var gDDD =  1; // [SCALE] Normal is 1 ; 0.5 for DEBUG(512/384) Disp
var gXXX = 4 * gSize;
var gYYY = 3 * gSize;
var gVVV = gDDD;
var gMVX = 0;
var gMVY = 0;
// For Mouse Event 
function xyconvert(x1,y1){
  return [((x1-gMVX)/gVVV),((y1-gMVY)/gVVV)];
}

function calcresizeWindow(){
  let pw = window.innerWidth;
  let ph = window.innerHeight;
  if(pw/ph > 4/3){ // 横長
    gVVV = ph/gYYY;
  }else{ // 縦長
    gVVV = pw/gXXX;
  }
  if(gVVV > gDDD){gVVV = gDDD;}
  //console.log("gVVV = "+gVVV);
  pconf.cvs.setAttribute( "width" ,  pw );
  pconf.cvs.setAttribute( "height" , ph );
  gMVX = (pw - gVVV*gXXX)/2;
  gMVY = (ph - gVVV*gYYY)/2;
}

function resizeWindow(event){
  calcresizeWindow();
  // do in mainloop
  pconf.resized = 1;
}

function window_load(ppp) {
  ppp.ctx.width  = gXXX;
  ppp.ctx.height = gYYY;
  calcresizeWindow();
}

function resizeFunc(cvs,ctx){
  let ww = cvs.width;
  let hh = cvs.height;
  let mvx = (ww - gVVV*gXXX)/2;
  let mvy = (hh - gVVV*gYYY)/2;
  // setTransform(伸縮x, 傾斜y, 傾斜x, 伸縮y, 移動x, 移動y)
  ctx.setTransform(gVVV, 0, 0, gVVV, mvx, mvy);
}

//=== MainFlow =======
window.onload = function(){

  // 起動時：リソースロード
  //resLoad();
  pconf = new rootObj();
  //読み込み時：サイズの設定
  window_load(pconf);
  // Controll Related
  //setControlListener();
  pconf.mmsetControlListener();

  //=== メイン ===
  mainfunc(pconf);
  console.log("window.onload invoke");
}

function mainfunc(ppp){
  console.log("mainfunc invoke");
  setInterval(mainloopfunc, ppp.gwt, ppp);
}

function mainloopfunc(ppp){
  ppp.mainloopfunc();
}

//==============================================================================
class rootObj {
  constructor(){
    this.obj = [];
    //=== Loop Time === 
    let gfps = 60;
    let gwt = 1000/gfps;
    this.gwt = gwt;
    //=== Save Feature ===

    //=== Init ===
    this.initLoad();
  }
  initLoad(){
    this.cur = 0;
    this.cvs = document.getElementById( "cv1" );
    this.ctx = this.cvs.getContext("2d");
    // Scene
    this.obj[0] = new sample0(0);

    //=== 初回はリサイズ ===
    this.resized = 1;
  }

  mainloopfunc(){
    if(this.resized != 0){
      resizeFunc(this.cvs, this.ctx);
      this.resized = 0;
    }
    let curobj = this.obj[this.cur];
    if(!isDefined(curobj)){
      console.log("[FATAL] Not Enter this code line");
      return;
    }
    // 描画
    curobj.mainloop(this.ctx);
    // State Change
    this.statusChangeExec(this.stchreq);
  }

  // st変更リクエスト 受付 
  statusChangeRequest(nnn){
    this.stchreq = nnn;
  }
  // st変更リクエスト 処理 
  statusChangeExec(req){
    this.stchreq = 0; // Reset
    if(req && (req!=this.cur)){
      console.log("st change Req is "+ req +" from "+this.cur);
      let newcurobj = this.obj[req];
      if(!isDefined(newcurobj)){
        console.log("[ChExec] Not implement :"+req);
        return;
      }
      if(isDefined(newcurobj.init)){
        newcurobj.init();
      }
      this.cur = req; // st変更 
    }
  }

  //=== mmfunc =======
  mmsetControlListener(){
    // Resize 
    window.addEventListener('resize', resizeWindow);

    let setFunc = this.mmfunc;
    this.clickEnable = 1;// 一回でもタッチが動いたら、clickは無視する＜仕様＞
    this.eee = ["click","mousemove","mousedown","touchend","touchmove","touchstart"];
    for(let i=0;i<this.eee.length;i++){
      window.addEventListener(this.eee[i], setFunc, { passive: false });
    }
  }
  mmfunc(event){
    let ppp = pconf;
    // May this if function pointer, can't use "this".
    let ttt = ppp.getType(event.type, ppp.eee);
    if(ttt < 0 || ttt >= 6){return;}
    if(ttt < 3 && ppp.clickEnable == 0){return;}
    if(ttt >= 3){ppp.clickEnable = 0;}
    let curobj = ppp.obj[ppp.cur];
    if(!isDefined(curobj)){
      return;
    }
    let [xx,yy] = (ttt < 3) ? /* true=Mouse, false=Touch */ 
      xyconvert(event.offsetX,event.offsetY) : 
      xyconvert(event.changedTouches[0].clientX,event.changedTouches[0].clientY);
    // Function Invoke.
    if((ttt%3==0) && isDefined(curobj.mmclick)){curobj.mmclick(xx,yy);}
    else if((ttt%3==1) && isDefined(curobj.mmover)){curobj.mmover(xx,yy);}
    else if((ttt%3==2) && isDefined(curobj.mmstart)){curobj.mmstart(xx,yy);}
  }
  // This is generic function.
  getType(ein, arr){
    let ttt = -1;
    for(let i=0;i<arr.length;i++){
      if(arr[i] == ein){ttt = i;break;}
    }
    //console.log("getType: "+ttt+" : "+ein);
    return ttt;
  }
}

// This is generic function.
function isDefined(object){
  return ( typeof object === "undefined" ) ? false : true;
}

//==================================================================
// Base Class
//==================================================================

class sampleBase{
  constructor(id){
    this.id = id;
    this.classtype = "sample";
    this.obj = [];
    //init
    this.click = [-1,-1];
    this.mouse = [-1,-1];
  }
  mainloop(ctx){
    this.update();
    this.draw(ctx);
  }
  update(){
    let flag1 = 0;
    let flag2 = 0;
    for (let i=this.obj.length-1;i>=0;i--){
      let cc = this.obj[i];
      if(cc.classtype == "sample"){
        cc.click = this.click;
        cc.mouse = this.mouse;
        cc.update();
        continue;
      }
      if(flag1){
        cc.hoverfunc(-1,-1);
      }else{
        let hover = this.mouse;
        flag1 = cc.hoverfunc(hover[0],hover[1]);
      }
      if(flag2){
        cc.clickfunc(-1,-1);
      }else{
        let click = this.click;
        flag2 = cc.clickfunc(click[0],click[1]);
      }
    }
  }
  mmclick(xx,yy){
    this.click = [xx,yy];
  }
  mmover(xx,yy){
    this.mouse = [xx,yy];
  }
  draw(ctx){
    // 背景
    ctx.fillStyle = "#8888AA";
    ctx.fillRect(0,0,gXXX,gYYY);
    // 描画
    for(let cc of this.obj){
      cc.draw(ctx);
    }
  }
}

//==================================================================
// Window の 親子関係 を考える
//==================================================================
class sample0 extends sampleBase{
  constructor(id){
    super(id);
    this.initialize();
  }
  initialize(){
    this.obj[0] = new window0(0,[100,100,200,100]);
    this.obj[1] = new window0(0,[100,300,200,100]);
    this.obj[2] = new window1(0,[150,150,200,100]);
    this.obj[3] = new window0(0,[150,350,200,100]);
    this.obj[4] = new sample1(0,[500,100,400,400]);
  }
}

class sample1 extends sampleBase{
  constructor(id, arg){
    super(id);
    this.arg = arg;
    this.initialize();
  }
  initialize(){
    let [x0,y0,w0,h0] = this.arg;
    this.obj[0] = new window0(0,[x0+100,y0+50,200,100]);
    this.obj[1] = new window0(0,[x0+100,y0+250,200,100]);
  }
  draw(ctx){
    let [x0,y0,w0,h0] = this.arg;
    // 背景
    ctx.fillStyle = "#CCCCCC";
    ctx.fillRect(x0,y0,w0,h0);
    // 描画
    for(let cc of this.obj){
      cc.draw(ctx);
    }
  }
}

class window0{
  constructor(id,arg){
    this.id = id;
    this.arg = arg;
    this.cl = ["#000000", "#0000ff", "#ff0000"];
    this.hover = 0;
    this.click = 0;
  }
  isin(xx,yy){
    let [x,y,w,h] = this.arg;
    return (x<xx&&xx<x+w&&y<yy&&yy<y+h);
  }
  hoverfunc(xx,yy){
    this.hover = this.isin(xx,yy)? 1 : 0;
    return 0;
  }
  clickfunc(xx,yy){
    this.click = this.isin(xx,yy)? 1 : 0;
    return 0;
  }

  draw(ctx){
    let [x,y,w,h] = this.arg;
    let ci = (this.click)? 2:this.hover;
    ctx.fillStyle = this.cl[ci];
    ctx.fillRect(x,y,w,h);
    ctx.strokeStyle = "#FFFFFF";
    let mm=5;
    ctx.strokeRect(x+mm,y+mm,w-2*mm,h-2*mm);
  }
}

class window1 extends window0 {
  constructor(id,arg) {
    super(id,arg);
  }
  hoverfunc(xx,yy){
    super.hoverfunc(xx,yy);
    return this.hover;
  }
  clickfunc(xx,yy){
    super.clickfunc(xx,yy);
    return this.click;
  }
}
