const { ccclass, property } = cc._decorator;

enum MoveDirection {
    None,
    monsterLeft,
    monsterRight,
}

@ccclass
export default class Mushroom extends cc.Component {

    @property({
        type: cc.Enum(MoveDirection)
    })
    _move_direction: MoveDirection = MoveDirection.monsterRight;

    @property(cc.Integer)
    speed = 100;

    @property(cc.RigidBody)
    _body: cc.RigidBody = null;

    @property(cc.Boolean)
    _animFlag = false;

    onLoad() {
        this._body = this.getComponent(cc.RigidBody);

    }

    onAnimationEnd() {

        this._body.linearVelocity.x = this.speed;
        this._animFlag = true;
    }

    update() {
        if (this._animFlag) {
            let speed = this._body.linearVelocity;

            if (this._move_direction === MoveDirection.monsterRight) {
                speed.x = this.speed;
            } else if (this._move_direction === MoveDirection.monsterLeft) {
                speed.x = -this.speed;
            }

            this._body.linearVelocity = speed;
        }
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        let group = cc.game.groupList[otherCollider.node.groupIndex];
        if (group === 'pipe') {
            if (this._move_direction === MoveDirection.monsterLeft) {
                this._move_direction = MoveDirection.monsterRight;
            } else {
                this._move_direction = MoveDirection.monsterLeft;
            }
        } else if (group === 'player') {
            this.node.destroy();
        }
    }
}
