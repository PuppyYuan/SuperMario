const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property(cc.AudioClip)
    gameBgm: cc.AudioClip = null;

    @property(cc.AudioClip)
    gameOverBgm: cc.AudioClip = null;

    @property(cc.Integer)
    _currentBgm = null;

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
        this._currentBgm = cc.audioEngine.playEffect(this.gameBgm, false, 0.5);
    }

    gameOver(){
        cc.director.pause();
        cc.audioEngine.stop(this._currentBgm);
        this._currentBgm = cc.audioEngine.playEffect(this.gameOverBgm, false, 0.5);

        // cc.director.resume();

        cc.director.loadScene('gameDesc');
        
    }
    
}
