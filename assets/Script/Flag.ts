const { ccclass, property } = cc._decorator;

import Player from './Player';

@ccclass
export default class Flag extends cc.Component {

    @property(cc.AudioClip)
    flagAudio: cc.AudioClip = null;

    @property(cc.Node)
    flagNode: cc.Node = null;

    onLoad() {

    }

    onBeginContact(contact, selfCollider, otherCollider) {
        let group = cc.game.groupList[otherCollider.node.groupIndex];
        if (group === 'player') {

            let pos = otherCollider.body.getWorldPosition();

            let player = otherCollider.getComponent(Player);
            
            this.flagNode.runAction(cc.sequence(cc.moveBy(1.5, 0, - 297), cc.callFunc(function(){
                this._drag_flag = true;
            }, player)));
            
            cc.audioEngine.playEffect(this.flagAudio, false, 0.5);
        }
    }
}
