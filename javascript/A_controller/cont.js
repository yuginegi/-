//------ 以下はコントローラ -------------------------------------

class contrclass{
  constructor(){
    this.arrSetting = 0; // 初期値
    this.btnSetting = [0,1,2,3]; // 初期値
    this.init();
    this.gamepad = null;
  }

  // もうこれを呼んでくれ
  getPushedKey(){
    let Pressed = -1;
    let mv = [0,0];
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
