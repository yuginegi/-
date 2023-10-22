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

class statusClass{
  constructor(){
    this.atxt = ["VIT","INT","MGC", "TEC","STR","CHA", "APP","WIL","MND"];
    this.aval = [76,42,42,44,61,45,71,10,0];
  }
  get(i){
    return [this.atxt[i],this.aval[i]];
  }
}

class commandClass{
  constructor(){
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
    return [this.atxt[i],this.aexp[i],];
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
    this.status = new statusClass();
    this.command = new commandClass();
    let xs = 50+(gXXX-698)/2;
    this.obj[0] = new sample1(11,[xs,10,698,218]);
    this.obj[0].setstatus(this.status);
    this.obj[1] = new sample2(12,[40,80,135,395]);
    this.obj[1].setcommand(this.command);
    this.obj[2] = new window2(5,[100,gYYY-255,800,250]);
    for(let i=0;i<2;i++){
      this.obj[i].setonhover(this.obj[2]);
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
      let [w,h,m] = [230,70,2]
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
    this.textreset();
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
    ctx.fillStyle = this.cl[ci];
    ctx.fillRect(x,y,w,h);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "48px 'ＭＳ ゴシック'";
    ctx.textBaseline = "top";
    let [txt,val]=this.status.get(this.stidx);
    ctx.textAlign = "left";
    ctx.fillText(txt, x+30,y+10);
    ctx.textAlign = "right";
    ctx.fillText(val, x+w-20,y+10);
  }
}