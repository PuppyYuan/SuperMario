const { ccclass, property } = cc._decorator;

import Game from './Game';

enum PlayerState {
    None,
    smallMarioRightRun,
    smallMarioRightJump,
    smallMarioLeftRun,
    smallMarioLeftJump,
}

enum MoveFlag {
    None,
    Left,
    Right,
}

@ccclass
export default class Player extends cc.Component {

    @property(Game)
    game: Game = null;

    // 跳跃声音
    @property(cc.AudioClip)
    jumpAudio: cc.AudioClip = null;
    // 踩敌人声音
    @property(cc.AudioClip)
    hitAudio: cc.AudioClip = null;
    // 状态
    @property({
        type: cc.Enum(PlayerState)
    })
    _playerState: PlayerState = PlayerState.None;

    get playerState(): PlayerState {
        return this._playerState;
    }

    set playerState(value: PlayerState) {

        if (value !== this._playerState) {
            this._playerState = value;
            this._anim.stop();
            if (this._playerState !== PlayerState.None) {
                let animName = PlayerState[this._playerState];
                this._anim.play(animName);
            }
        }
    }

    @property(cc.Animation)
    _anim: cc.Animation = null;

    @property(cc.Integer)
    maxSpeed = 500;

    @property(cc.Integer)
    acceleration = 1500;

    @property(cc.Integer)
    jumpSpeed = 650;
    // 阻力
    @property(cc.Integer)
    drag = 600;


    @property({
        type: cc.Enum(MoveFlag)
    })
    _moveFlag: MoveFlag = MoveFlag.Right;

    @property(cc.Boolean)
    _up = false;

    @property(cc.Boolean)
    _upPressed = false;

    @property(cc.RigidBody)
    _body: cc.RigidBody = null;

    @property(cc.Sprite)
    _sprite: cc.Sprite = null;

    @property(cc.SpriteFrame)
    leftStandSpriteFrame: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    rightStandSpritFrame: cc.SpriteFrame = null;

    @property
    _key_pressed = {};

    @property
    _land_flag = true;

    @property
    _drag_flag = false;

    onLoad() {

        this._anim = this.getComponent(cc.Animation);
        this._body = this.getComponent(cc.RigidBody);
        this._sprite = this.getComponent(cc.Sprite);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    update(dt) {

        let speed = this._body.linearVelocity;

        if (this._drag_flag) {
            cc.director.targetOff(this);

            this.playerState = PlayerState.smallMarioRightRun;
            this._moveFlag = MoveFlag.Right;
            speed.x = 300;
        } else {

            // 左方向
            if (this._key_pressed[cc.KEY.a] && !this._key_pressed[cc.KEY.w]) {
                this.playerState = PlayerState.smallMarioLeftRun;
                this._moveFlag = MoveFlag.Left;
                speed.x -= this.acceleration * dt;
                if (speed.x < -this.maxSpeed) {
                    speed.x = -this.maxSpeed;
                }
            }

            // 右方向
            if (this._key_pressed[cc.KEY.d] && !this._key_pressed[cc.KEY.w]) {
                this.playerState = PlayerState.smallMarioRightRun;
                this._moveFlag = MoveFlag.Right;
                speed.x += this.acceleration * dt;
                if (speed.x > this.maxSpeed) {
                    speed.x = this.maxSpeed;
                }
            }

            if (!this._key_pressed[cc.KEY.d] && !this._key_pressed[cc.KEY.a]
                && Math.abs(speed.x) < 200 && !this._key_pressed[cc.KEY.w]) {
                this.playerState = PlayerState.None;
                if (this._moveFlag === MoveFlag.Left)
                    this._sprite.spriteFrame = this.leftStandSpriteFrame;
                if (this._moveFlag === MoveFlag.Right)
                    this._sprite.spriteFrame = this.rightStandSpritFrame;

                // this._moveFlag = MoveFlag.None;
            }

            if (this._key_pressed[cc.KEY.w]) {
                if (this._moveFlag === MoveFlag.Left)
                    this.playerState = PlayerState.smallMarioLeftJump;
                if (this._moveFlag === MoveFlag.Right)
                    this.playerState = PlayerState.smallMarioRightJump;

                if (Math.abs(speed.y) < 1 && this._land_flag) {
                    speed.y = this.jumpSpeed;
                    cc.audioEngine.playEffect(this.jumpAudio, false, 0.3);
                    this._land_flag = false;
                }
            }

        }

        if (this.node.x >= 10450) {
            speed.x = 0;
            this.node.opacity -= 100 * dt;
            if (this.node.opacity <= 0) {
                this.node.opacity = 0;
                this.game.gameOver();
            }
        }

        if (this.node.y <= -cc.winSize.height / 2) {
            this.game.gameOver();
        }

        this._body.linearVelocity = speed;


    }

    onKeyDown(event) {
        switch (event.keyCode) {
            // // W
            // case cc.KEY.w:
            // case cc.KEY.up:
            //     if (!this._upPressed) {
            //         this._up = true;
            //         if(this._moveFlag === MoveFlag.Right)
            //             this.playerState = PlayerState.smallMarioRightJump;
            //         else if(this._moveFlag === MoveFlag.Left)
            //             this.playerState = PlayerState.smallMarioLeftJump;
            //     }
            //     this._upPressed = true;

            //     break;
            // // A
            // case cc.KEY.a:
            // case cc.KEY.left:
            //     this._moveFlag |= MoveFlag.Left;
            //     this.playerState = PlayerState.smallMarioLeftRun;
            //     break;
            // // D
            // case cc.KEY.d:
            // case cc.KEY.right:

            //     this._moveFlag |= MoveFlag.Right;
            //     this.playerState = PlayerState.smallMarioRightRun;

            //     break;
            // default:
            //     break;

            case cc.KEY.w:
            case cc.KEY.a:
            case cc.KEY.d:
                this._key_pressed[event.keyCode] = true;
                break;
            default:
                break;
        }
    }

    onKeyUp(event) {
        switch (event.keyCode) {
            // // W
            // case cc.KEY.w:
            // case cc.KEY.up:
            //     this._upPressed = false;
            //     if(this._moveFlag === MoveFlag.Right)
            //         this._sprite.spriteFrame = this.rightStandSpritFream;
            //     else if(this._moveFlag === MoveFlag.Left)
            //         this._sprite.spriteFrame = this.leftStandSpriteFrame;
            //     break;
            // // A
            // case cc.KEY.a:
            // case cc.KEY.left:
            //     this._moveFlag &= ~MoveFlag.Left;
            //     this.playerState = PlayerState.None;
            //     this._sprite.spriteFrame = this.leftStandSpriteFrame;
            //     break;
            // // D
            // case cc.KEY.d:
            // case cc.KEY.right:
            //     this._moveFlag &= ~MoveFlag.Right;
            //     this.playerState = PlayerState.None;
            //     this._sprite.spriteFrame = this.rightStandSpritFream;
            //     break;
            // default:
            //     break;
            case cc.KEY.w:
            case cc.KEY.a:
            case cc.KEY.d:
                this._key_pressed[event.keyCode] = false;
                break;
            default:
                break;
        }
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        let group = cc.game.groupList[otherCollider.node.groupIndex];

        if (group === 'wall' || group === 'ground' || group === 'pipe' || group === 'stair') {
            let worldManifold = contact.getWorldManifold();
            let normal = worldManifold.normal;

            // 判断是否从上面降落，来触发下次跳跃事件
            if (normal.y === -1) {
                this._land_flag = true;
            }
        }
    }

}
