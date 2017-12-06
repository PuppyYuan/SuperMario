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
    move_direction: MoveDirection = MoveDirection.monsterLeft;

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

    @property(cc.AudioClip)
    dieAudioClip: cc.AudioClip = null;

    onLoad() {
        this._anim = this.getComponent(cc.Animation);
        this._body = this.getComponent(cc.RigidBody);
        this._body.linearVelocity.x = this.speed;

        this._anim.play(MoveDirection[this.move_direction]);
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

        if(this.node.y <= -cc.winSize.height / 2){
            this.node.destroy();
        }
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        let group = cc.game.groupList[otherCollider.node.groupIndex];
        if (group === 'pipe' || group === 'monster') {
            if (this.move_direction === MoveDirection.monsterLeft) {
                this.setMoveDirection(MoveDirection.monsterRight);
            } else {
                this.setMoveDirection(MoveDirection.monsterLeft);
            }
        } else if (group === 'player') {
            let manifold = contact.getWorldManifold();
            let normal = manifold.normal;

            if (normal.y === 1) {
                cc.audioEngine.playEffect(this.dieAudioClip, false, 0.5);
                this.setMoveDirection(MoveDirection.monsterDead);
            } else if(normal.y !== 1 && (normal.x === 1 || normal.x === -1)){
                otherCollider.getComponent('Player').game.gameOver();
            }
        }
    }

    onDeadAnimationEnd() {
        this.node.destroy();
    }

}
