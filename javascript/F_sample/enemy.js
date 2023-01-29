/****************************************************
 * 仮想敵のクラス
 * *************************************************/
//https://kuwatan.jp/2392/yellow.html
class ydClass{
  constructor(ctx){
    this.ctx = ctx;
    // 状態の変数
    this.sts = 0;
    this.tm = 0;
    // 各状態で使う変数
    this.idx = 0;
    this.evt = 0;
    this.eye = null;
    // 管理するパーツ
    this.mp = [];
    let mv = [23,22,24,21,17,18,16,15,14,13,12,10,11,8,6,7,5,9,2];
    this.init(mv);
  }
  init(mv){
    for(let ii of mv){
      let yb = new yblock(this,ii);
      this.mp.push(yb);
    }
  }
  // ボツ 下からもらう案 → 使ってない
  notify(){}
  // コントロールする
  eventcontrol(tm){
    if(tm%10==0){ // 10F 毎に
      this.evt = 1;
    }
  }
  hit(xx,yy,sz){
    // early return
    if(dmgwait>0){
      dmgwait--;
      return;
    }
    // 管理しているものがそれぞれヒットしているかどうか
    for(let yb of this.mp){
      yb.hit(xx,yy,sz);
    }
  }
  thunderhit(xx,yy,ww,hh){
    if(this.eye){
      let [ex,ey,ez] = this.eye.getPos();
      if(utilRangeDup(xx,xx+ww,ex,ex+ez) && utilRangeDup(yy,yy+hh,ey,ey+ez)){
        console.log("BOSS DAMAGE!");
        bossHP--;
        bossDwait = 30;
      }
    }
  }
  // 状態遷移のような
  move(){
    this.tm++;
    if(this.sts == 0){ // 動き出しの待ち時間
      if(this.tm > 5*30){
        this.sts = 1;
        this.tm = 0;
        this.idx = 0;
      }
    }else if(this.sts == 1){ // パーツが動く
      this.eventcontrol(this.tm);
      if(this.evt!=0){
        if(this.idx < this.mp.length){
          let yb = this.mp[this.idx];
          yb.trigger();
          this.evt = 0; // イベントリセット
          this.idx++; // ここでインクリメント
        }else{
          // 打ち切ったら 状態2に寄る
          this.sts = 2;
          this.tm = 0;
          this.eye = null;
        }
      }
    }else if(this.sts == 2){ // 目を出す
      if(90 < this.tm){
        this.sts = 0;
        this.tm = 5*30 - 1*30; // すぐ再開したほうがいいから 
        this.eye = null;
      }else if(30 == this.tm){
        // (0)23,22,24,21,17, (5)18,16,15,14,13,
        // (10)12,10,11,8,6, (15)7,5,9,2
        // 12=>11,11=>10,14=>6,16=>5
        let elist = [12,11,14,16];
        let r = Math.floor( Math.random() * 4);
        let ee = elist[r];
        this.eye = this.mp[ee]; // 目
      }
    }
    // 管理しているブロック、動けるなら動いてもらう
    for(let yb of this.mp){
      yb.move();
    }
  }
  draw(){
    // 管理しているブロック、描画してもらう
    for(let yb of this.mp){
      yb.draw(this.ctx,0); // 止まっているものを先に
    }
    for(let yb of this.mp){
      yb.draw(this.ctx,1); // 動いているものを後に
    }
    // Null じゃなければ 目を出す
    if(this.eye != null){
      this.eye.eyedraw(this.ctx); // 目
    }
  }
}
/****************************************************
 * 仮想敵のクラスの各パーツ
 * *************************************************/
class yblock{
  constructor(yc,ii){
    this.yc = yc; // 親
    this.ii = ii;
    let ix = Math.floor(ii/5);
    let iy = (ii%5);
    this.ix = ix;
    this.iy = iy;
    this.spbase = 18;

    this.dr = 0; // １：右、０：左
    let sz = gMMM;
    let xx = (gXXX-6*sz)+(ix*sz);
    let yy = (sz*5)+iy*sz;
    xx = xx -gXXX;

    this.pos = [xx,yy,sz];
    this.sp = this.spbase;
    this.txinvalid = -1000;
    this.tx = this.txinvalid;
    this.wtimebase = 12;
    this.wtime = 0;
  }
  // 上から動けと言われたら、txが計算で設定される
  trigger(){
    //console.log("ii="+this.ii);
    let ix = this.ix;
    let sz = this.pos[2];
    this.wtime = this.wtimebase;
    if(this.dr == 1){
      this.dr = 0;
      this.tx = (5*sz)-(ix*sz);
      this.sp = -1*this.spbase;
    }else{
      this.dr = 1;
      this.tx = (gXXX-6*sz)+(ix*sz);
      this.sp = +1*this.spbase;
    }
  }
  getPos(){
    return this.pos;
  }
  // 衝突判定
  hit(ox,oy,oz){
    if(dmgwait>0){return;}
    let [fx,fy,sz] = this.pos;
    let mg = 12;
    // (ox+0.4*oz < fx+mg && fx-mg < ox+0.6*oz) && (oy < fy+mg && fy-mg < oy+0.6*oz))
    if(utilRangeDup(ox+0.4*oz,ox+0.6*oz,fx-mg,fx+mg)
    && utilRangeDup(oy,oy+0.6*oz,fy-mg,fy+mg)){
      console.log("damage!!");
      charHP--;
      dmgwait = 2*30; // 数秒は無敵
    }
  }
  // 動き
  move(){
    if(this.wtime > 0){
      this.wtime--; // 点滅
    }else if(this.tx >= -gXXX){
      let sp = this.sp;
      this.pos[0] = this.pos[0] + sp;
      // 動き終わった（txに到達したかどうか） かどうか
      if((this.dr==0 && this.pos[0] < this.tx)
       || (this.dr==1 && this.pos[0] > this.tx)){
        this.pos[0] = this.tx;
        this.tx = this.txinvalid;
        this.wtime = this.wtimebase;
        this.yc.notify(); // 完了通知
      }
    }else{
      // なにもしない
    }
  }
  // 描画
  draw(ctx,type){
    let [xx,yy,sz] = this.pos;
    if(this.wtime==0 && this.tx > this.txinvalid){
      if(type==0){return;}
      ctx.fillStyle = "#FFCC00";
      this.cdraw(ctx,xx+sz/2,yy+sz/2,sz/2); // 黄色のマル
    }else{
      if(type==1){return;}
      if(this.wtime > 0){
        ctx.fillStyle = (this.wtime%4>=2)? "#FF00FF":"#FF0000";
        ctx.fillRect(xx,yy,sz,sz); // 点滅の四角
      }else{
        let [ii,ix,iy]=(this.dr==1)?[1,this.ix,this.iy]:[0,4-this.ix,this.iy];
        ctx.drawImage(gBoss[ii],40*ix,40*iy,40,40,xx,yy,sz,sz); // 絵を出す
      }
    }
  }
  // 目を描く
  eyedraw(ctx){
    let [xx,yy,sz] = this.pos;
    let [cx,cy,cz] = [xx+sz/2,yy+5+sz/2,sz/4];
    ctx.fillStyle = "#FF0000";
    this.cdraw(ctx,cx,cy,cz);
  }
  // マルを描く
  cdraw(ctx,cx,cy,cz){
    ctx.beginPath();
    ctx.arc(cx,cy,cz, 0, Math.PI*2, false);
    ctx.fill();
    ctx.strokeStyle = "#000000";
    ctx.beginPath();
    ctx.arc(cx,cy,cz, 0, Math.PI*2, false);
    ctx.stroke();
  }
}

//2つの期間が重なり合うかどうかを判定する。 // 重なるなら１
//https://koseki.hatenablog.com/entry/20111021/range
function utilRangeDup(a1,a2,b1,b2){
  return ((b1 <= a2) && (a1 <= b2));
}
