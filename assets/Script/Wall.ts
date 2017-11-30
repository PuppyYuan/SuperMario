const { ccclass, property } = cc._decorator;

@ccclass
export default class Wall extends cc.Component {

    @property(cc.Action)
    _animAction: cc.Action = null;

    @property(cc.Sprite)
    _sprite: cc.Sprite = null;

    @property(cc.Prefab)
    extraBonus: cc.Prefab = null;

    @property(cc.SpriteFrame)
    postSpriteFrame: cc.SpriteFrame = null;

    @property(cc.AudioClip)
    shakeAudio: cc.AudioClip = null;

    onLoad() {
        this._animAction = this.setShakeAction();

        this._sprite = this.getComponent(cc.Sprite);
    }

    setShakeAction() {
        let pos = this.node.position;

        let upAction = cc.moveTo(0.1, cc.p(pos.x, pos.y + 10)).easing(cc.easeCubicActionOut());
        let downAction = cc.moveTo(0.1, pos).easing(cc.easeCubicActionOut());

        let callFunc = cc.callFunc(this.playShakeAudio, this);

        return cc.sequence(upAction, downAction, callFunc);
    }

    playShakeAudio() {
        cc.audioEngine.playEffect(this.shakeAudio, false, 0.5);
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        let group = cc.game.groupList[otherCollider.node.groupIndex];
        let pos = this.node.convertToWorldSpaceAR(cc.Vec2.ZERO);

        let manifold = contact.getWorldManifold();
        let points = manifold.points;

        let middleX = (points[1].x + points[0].x) / 2;

        if (group === 'player'
            && manifold.normal.y === -1
            && Math.abs(middleX - pos.x) < this.node.width / 4) {
            if (this.extraBonus !== null) {
                let extraBonus = cc.instantiate(this.extraBonus);
                extraBonus.x = this.node.x;
                extraBonus.y = this.node.y + this.node.height / 2;

                this.node.parent.addChild(extraBonus);

                this._sprite.spriteFrame = this.postSpriteFrame;
                // 清空分支条件，防止多次触发
                this.extraBonus = null;
            } else if (this.postSpriteFrame === null) {
                this.node.runAction(this._animAction);
            }
        }
    }
}
