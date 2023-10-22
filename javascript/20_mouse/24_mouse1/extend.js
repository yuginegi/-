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
      if(cc.classtype == "ignore"){
        continue;
      }
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

//===================

class statusClass{
  constructor(){
    this.atxt = ["VIT","INT","MGC", "TEC","STR","CHA", "APP","WIL","MND"];
    this.aval = [76,42,42,44,61,45,71,10,0];
    this.stime = [0,0,0,0,0,0,0,0,0];
  }
  get(i){
    return [this.atxt[i],this.aval[i]];
  }
  up(i){ // [0,1,2,3,5,6,7]
    let tar = [1,2,3,4,0,5,6,0];
    this.aval[tar[i]]++;
    this.stime[tar[i]] = 20;
  }
  getsts(i){
    if(this.stime[i] > 0){
      this.stime[i]--;
      return 1;
    }
    return 0;
  }
}

class commandClass{
  constructor(parent){
    this.parent = parent;
    this.atxt = ["光","闇","器","練", "組","話","美","寝", "約","会","情","他"];
    this.aexp = [
      "光術を鍛える",
      "闇術を鍛える",
      "器用さを磨く",
      "訓練をする", 
      "組織活動",
      "会話をする",
      "身だしなみを整える",
      "寝る", 
      "約束をする",
      "会う",
      "情報",
      "システム"];
  }
  get(i){
    return [this.atxt[i],this.aexp[i]];
  }
  invoke(i){
    console.log("invoke:"+i);
    //　実行可能なコマンド
    if([0,1,2,3,5,6,7].indexOf(i) != -1){
      this.parent.action(i);
    }else{
      this.parent.notact();
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
    this.aflag = 0;
  }
  initialize(){
    this.status = new statusClass();
    this.command = new commandClass(this);
    let xs = 100+(gXXX-698)/2;
    this.obj[0] = new sample1(11,[xs,10,608,158]);
    this.obj[0].setstatus(this.status);
    this.obj[1] = new sample2(12,[40,80,135,395]);
    this.obj[1].setcommand(this.command);
    this.obj[2] = new window2(5,[100,gYYY-255,800,250]);
    this.obj[3] = new window3(5,[200,172,730,335]);
    this.obj[4] = new animat0(this.obj[3]);
    for(let i=0;i<2;i++){
      this.obj[i].setonhover(this.obj[2]);
    }
  }
  // ここでやるか悩むが、とりあえずここで
  action(i){
    // メイン画面（？）にアニメーション効果
    this.obj[4].action();
    //　ステータスがアップする
    this.status.up(i);
    // クリックは元に戻す
    this.click = [-1,-1];
  }
  notact(){
    this.obj[2].txt = "実行できません";
    this.obj[2].keep = 180;
  }
}

class animat0{
  constructor(obj3){
    this.classtype = "ignore";
    this.obj3 = obj3;
    this.animationtime = 0;
  }
  //hoverfunc(xx,yy){return 0;}
  //clickfunc(xx,yy){return 0;}
  action(){
    if(this.animationtime <= 0){
      this.animationtime = 30;
    }
  }
  draw(ctx){
    this.obj3.at = this.animationtime;
    if(this.animationtime > 0){
      this.animationtime--;
    }
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
    for(let i=0;i<9;i++){
      let [w,h,m] = [200,50,2]
      let [x,y] = [m+(w+m)*(i%3), m+(h+m)*Math.floor(i/3)];
      this.obj[i] = new windowP(100+i,[x0+x,y0+y,w,h]);
    }
  }
  setstatus(sts){
    for(let i=0;i<this.obj.length;i++){
      //this.obj[i].setTxtVal(sts.get(i));
      this.obj[i].setStatus(sts, i);
    }
  }
  setonhover(xx){
    for(let i=0;i<this.obj.length;i++){
      this.obj[i].setonhover(xx);
    }
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

class sample2 extends sampleBase{
  constructor(id, arg){
    super(id);
    this.arg = arg;
    this.initialize();
  }
  initialize(){
    let [x0,y0,w0,h0] = this.arg;
    for(let i=0;i<12;i++){
      let [w,m] = [60,5]
      let [x,y] = [m+(w+m)*(i%2), m+(w+m)*Math.floor(i/2)];
      this.obj[i] = new window0(200+i,[x0+x,y0+y,w,w]);
    }
  }
  setcommand(cmd){
    for(let i=0;i<this.obj.length;i++){
      this.obj[i].setCommand(cmd, i);
    }
  }
  setonhover(xx){
    for(let i=0;i<this.obj.length;i++){
      this.obj[i].setonhover(xx);
    }
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
    this.notify = null;
  }
  isin(xx,yy){
    let [x,y,w,h] = this.arg;
    return (x<xx&&xx<x+w&&y<yy&&yy<y+h);
  }
  setCommand(cmd,idx){
    this.command = cmd;
    this.stidx = idx;
  }
  setonhover(notify){
    this.notify = notify;
  }
  hoverfunc(xx,yy){
    this.hover = this.isin(xx,yy)? 1 : 0;
    if(this.hover && this.notify){
      let [txt,exp]=this.command.get(this.stidx);
      this.notify.txt = exp;
    }
    return 0;
  }
  clickfunc(xx,yy){
    this.click = this.isin(xx,yy)? 1 : 0;
    if(this.click){
      this.command.invoke(this.stidx);
    }
    return 0;
  }

  draw(ctx){
    let [x,y,w,h] = this.arg;
    let ci = (this.click)? 2:this.hover;
    ctx.fillStyle = this.cl[ci];
    ctx.fillRect(x,y,w,h);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "48px 'ＭＳ ゴシック'";
    ctx.textBaseline = "top";
    let [txt]=this.command.get(this.stidx);
    ctx.textAlign = "left";
    ctx.fillText(txt, x+5,y+5);
  }
}

class window2 extends window0 {
  constructor(id,arg) {
    super(id,arg);
    this.textreset();
    this.keep = 0;
  }
  hoverfunc(xx,yy){return 0;}
  clickfunc(xx,yy){return 0;}
  textreset(){
    this.txt = "What shall I do tomorrow ?";
  }
  settext(txt){
    this.txt = "Window "+ txt + " is hovered.";
  }
  draw(ctx){
    let [x,y,w,h] = this.arg;
    let ci = 0;
    ctx.fillStyle = this.cl[ci];
    ctx.fillRect(x,y,w,h);
    ctx.strokeStyle = "#FFFFFF";
    let mm=5;
    ctx.strokeRect(x+mm,y+mm,w-2*mm,h-2*mm);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "48px 'ＭＳ ゴシック'";
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.fillText(this.txt, x+10,y+10);
    if(this.keep > 0){this.keep--;}else{
      this.textreset();
    }
  }
}

class window3 extends window0 {
  constructor(id,arg) {
    super(id,arg);
    this.at = 0;
  }
  hoverfunc(xx,yy){return 0;}
  clickfunc(xx,yy){return 0;}

  draw(ctx){
    let [x,y,w,h] = this.arg;
    let ci = 0;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(x,y,w,h);
    if(this.at > 0){
      ctx.fillStyle = "#FF0000";
      let xx = x + w/2 +10*(30/2-this.at); 
      ctx.fillRect(xx,y+h/2,50,50);
    }
  }
}

class windowP extends window0 {
  constructor(id,arg) {
    super(id,arg);
  }
  setStatus(sts,idx){
    this.status = sts;
    this.stidx = idx;
  }
  hoverfunc(xx,yy){
    this.hover = this.isin(xx,yy)? 1 : 0;
    if(this.hover && this.notify){
      let [txt,val]=this.status.get(this.stidx);
      let ttt = txt+" Status, Value "+val;
      this.notify.txt = ttt;
    }
    return this.hover;
  }
  clickfunc(xx,yy){
    super.clickfunc(xx,yy);
    return this.click;
  }
  draw(ctx){
    let [x,y,w,h] = this.arg;
    let ci = 0;
    
    if(this.status.getsts(this.stidx)){
      ci = 1;
    }
    ctx.fillStyle = this.cl[ci];
    ctx.fillRect(x,y,w,h);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "36px 'ＭＳ ゴシック'";
    ctx.textBaseline = "top";
    let [txt,val]=this.status.get(this.stidx);
    ctx.textAlign = "left";
    ctx.fillText(txt, x+50,y+10);
    ctx.textAlign = "right";
    ctx.fillText(val, x+w-50,y+10);
    if(ci){
      ctx.fillText("↑", x+w-10,y+10);
    }
  }
}