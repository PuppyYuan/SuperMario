const {ccclass, property} = cc._decorator;

@ccclass
export default class Money extends cc.Component {

    @property(cc.AudioClip)
    moneyAudio: cc.AudioClip = null;

    onLoad(){
        let pos = this.node.position;

        let upAction = cc.moveTo(0.15, cc.p(pos.x, pos.y + 50));
        let scaleAction = cc.sequence(cc.scaleTo(0.75, 0.1), cc.scaleTo(0.75, 0.5));
        let fadeAction = cc.fadeOut(0.15);

        let callFunc = cc.callFunc(this.playMoneyAudio, this);

        this.node.runAction(cc.spawn(upAction, scaleAction, fadeAction, callFunc));

        this.schedule(function(){

            this.node.destroy();
        }, 0.5, 0);
    }

   playMoneyAudio(){
       cc.audioEngine.playEffect(this.moneyAudio, false, 0.5);
   }
}
