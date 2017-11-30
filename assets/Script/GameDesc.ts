const {ccclass, property} = cc._decorator;

@ccclass
export default class GameDesc extends cc.Component {

    onLoad() {
        cc.director.resume();

        this.schedule(function(){
            cc.director.loadScene('superMario-1')
        }, 3, 0);
        
    }
}
