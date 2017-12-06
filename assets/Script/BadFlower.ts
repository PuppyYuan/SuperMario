const { ccclass, property } = cc._decorator;

@ccclass
export default class BadFlower extends cc.Component {

    @property
    _gap = 5;

    @property(cc.Vec2)
    _originPos: cc.Vec2 = null;

    onLoad() {

        this._originPos = this.node.getPosition();

        this.schedule(function(){
            this.node.setPosition(this._originPos);
            this.node.opacity = 255;
            this.getComponent(cc.Animation).play();
        }, this._gap);
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        let group = cc.game.groupList[otherCollider.node.groupIndex];
        if (group === 'player') {
            let manifold = contact.getWorldManifold();
            let normal = manifold.normal;
        }
    }

    onAnimatedEnd(){
        this.node.setPosition(this._originPos.x, this._originPos.y - 40);
        this.node.opacity = 0;
    }
}