//------ 以下はコントローラ -------------------------------------

class contrclass{
  constructor(){
    this.arrSetting = 0; // 初期値
    this.btnSetting = [0,1,2,3]; // 初期値
    this.init();
    this.gamepad = null;
    // キーボード受付
    window.addEventListener("keydown", this.kdown.bind(this), { passive: false });
    window.addEventListener("keyup", this.kup.bind(this), { passive: false });
    this.kaxes = [0,0]
  }
  //--- キーボードここから ---
  kstate(oo,aa){
    if(aa==1){
      this.kaxes[0] = -1*oo;
    }else if(aa==2){
      this.kaxes[0] = +1*oo;
    }else if(aa==3){
      this.kaxes[1] = -1*oo;
    }else if(aa==0){
      this.kaxes[1] = +1*oo;
    }else if(aa==10){
      this.kpush = +1*oo;
    }else if(aa==11){
      this.kpush = +2*oo;
    }
  }
  kup(event){
    this.kcommon(event.key,0);
  }
  kdown(event){
    this.kcommon(event.key,1);
    switch(event.key) {
    case "Enter":
      if(startPintvl <= 0){
        startPushed = 1;
        startPintvl = 60;
      }
      break
    }
  }
  kcommon(key,v){
    switch(key) {
    case "z":
      this.kstate(v,10);
      break;
    case "x":
      this.kstate(v,11);
      break;
    case "ArrowDown":
      this.kstate(v,0);
      break;
    case "ArrowUp":
      this.kstate(v,3);
      break;
    case "ArrowLeft":
      this.kstate(v,1);
      break;
    case "ArrowRight":
      this.kstate(v,2);
      break;
    }
  }
  kfunc(aaa){
    if(aaa==1){return this.kaxes;}
    /* ！！ ０が押してないなので、意味がそろってない [TODO] */
    if(aaa==2){return this.kpush;} 
  }
  //--- キーボードここまで ---

  // もうこれを呼んでくれ
  getPushedKey(){
    let Pressed = -1;
    let mv = [0,0];
    // キーボードの左右とZXをもらう
    mv = this.kfunc(1);
    let p = this.kfunc(2); // zは1、xは2。押してないとき０
    Pressed = (p==1)? 0 : -1; // z ならジャンプとする
    // ゲームキーが来るなら上書き
    let arg = this.getcont();
    if(arg == null){
      //console.log("null break.");
    }else{
      let pp = -1;
      [pp, mv] = arg;
      if(pp != -1){
        Pressed = this.returnBtn(pp);
      }
    }
    return [Pressed, mv];
  }

  // キーコンフィグに従う
  returnBtn(n){
    if(n == -1){return -1;}
    for(let i=0;i<this.btnSetting.length;i++){
      if(this.btnSetting[i]==n){return i;}
    }
    return -1;
  }
  // 最初に見つかったものを
  getcont(){
    var gamepad_list = navigator.getGamepads();
    for(let i=0;i < gamepad_list.length;i++){
      var gamepad = gamepad_list[i];
      if(!gamepad) continue;
      return this.cont(gamepad); // 最初に見つかったもの
    }
    return null; // 操作されるまではNULLになる
  }

  cont(gamepad){
    //=== check =======
    var buttons = gamepad.buttons;
    var n = buttons.length;
    let Pressed = -1; // 初期化
    for(let i=0;i<n;i++){
      if(buttons[i].pressed){
        Pressed = i; // 何か押した (上書き)
      }
    }
    // 移動は共通かなと
    var axes = gamepad.axes;
    var m = axes.length;
    let mv = [];
    for(let j=0;j < m;j++)
    {
      if(axes[j] < -0.5 || 0.5 < axes[j]){
        mv[j] = (axes[j] < 0) ? -1 : +1; // 何か押した (上書き)
      }else{
        mv[j] = 0;
      }
    }
    return [Pressed, mv, n];
  }

  init(){
    console.log("cont:Init involke.");
  }
}

