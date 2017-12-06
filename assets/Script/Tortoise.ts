const {ccclass, property} = cc._decorator;

enum MoveDirection {
    None,
    tortoiseL,
    tortoiseR,
}

@ccclass
export default class Tortoise extends cc.Component {

    @property({
        type: cc.Enum(MoveDirection)
    })
    move_direction: MoveDirection = MoveDirection.tortoiseL;

    setMoveDirection(value) {
        if (value !== this.move_direction) {
            this.move_direction = value;
            if (this.move_direction !== MoveDirection.None) {
                let animName = MoveDirection[this.move_direction];
                this._anim.stop();
                this._anim.play(animName);
            }
        }
    }

    @property(cc.Animation)
    _anim: cc.Animation = null;

    @property(cc.Integer)
    speed = 100;

    @property(cc.RigidBody)
    _body: cc.RigidBody = null;

    onLoad() {
        this._anim = this.getComponent(cc.Animation);
        this._body = this.getComponent(cc.RigidBody);
        this._body.linearVelocity.x = this.speed;

        this._anim.play(MoveDirection[this.move_direction]);
        
    }

    update() {
        let speed = this._body.linearVelocity;

        if (this.move_direction === MoveDirection.tortoiseR) {
            speed.x = this.speed;
        } else if (this.move_direction === MoveDirection.tortoiseL) {
            speed.x = -this.speed;
        }

        this._body.linearVelocity = speed;

        if(this.node.y <= -cc.winSize.height / 2){
            this.node.destroy();
        }
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        let group = cc.game.groupList[otherCollider.node.groupIndex];
        if (group === 'pipe' || group === 'monster') {
            if (this.move_direction === MoveDirection.tortoiseL) {
                this.setMoveDirection(MoveDirection.tortoiseR);
            } else {
                this.setMoveDirection(MoveDirection.tortoiseL);
            }
        }
    }

}
