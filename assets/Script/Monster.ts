const { ccclass, property } = cc._decorator;

enum MoveDirection {
    None,
    monsterLeft,
    monsterRight,
    monsterDead,
}

@ccclass
export default class Monster extends cc.Component {

    @property({
        type: cc.Enum(MoveDirection)
    })
    _move_direction: MoveDirection = MoveDirection.monsterRight;

    get move_direction() {
        return this._move_direction;
    }

    set move_direction(value) {
        if (value !== this._move_direction) {
            this._move_direction = value;
            if (this._move_direction !== MoveDirection.None) {
                let animName = MoveDirection[this._move_direction];
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
    }

    update() {
        let speed = this._body.linearVelocity;

        if (this.move_direction === MoveDirection.monsterRight) {
            speed.x = this.speed;
        } else if (this.move_direction === MoveDirection.monsterLeft) {
            speed.x = -this.speed;
        } else if (this.move_direction === MoveDirection.monsterDead) {
            speed.x = 0;
        }

        this._body.linearVelocity = speed;
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        let group = cc.game.groupList[otherCollider.node.groupIndex];
        if (group === 'pipe') {
            if (this.move_direction === MoveDirection.monsterLeft) {
                this.move_direction = MoveDirection.monsterRight;
            } else {
                this.move_direction = MoveDirection.monsterLeft;
            }
        } else if (group === 'player') {
            let manifold = contact.getWorldManifold();
            let normal = manifold.normal;

            if (normal.y === 1) {
                this.move_direction = MoveDirection.monsterDead;
            } else if(normal.y !== 1 && (normal.x === 1 || normal.x === -1)){
                otherCollider.getComponent('Player').game.gameOver();
            }
        }
    }

    onDeadAnimationEnd() {
        this.node.destroy();
    }

}
