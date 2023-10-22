
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
