const {ccclass, property} = cc._decorator;

@ccclass
export default class GameStart extends cc.Component {


    onLoad() {
        cc.director.preloadScene('gameDesc');
        cc.director.preloadScene('superMario-1');
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);   
    }

    onKeyDown(event){
        cc.director.loadScene('gameDesc');
    }
}
