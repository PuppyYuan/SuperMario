const {ccclass, property} = cc._decorator;

@ccclass
export default class CameraControl extends cc.Component {

    @property(cc.Node)
    target: cc.Node = null;

    @property(cc.Camera)
    _camera: cc.Camera = null;

    onLoad() {
        this._camera = this.getComponent(cc.Camera);
    }

    onEnable() {
        cc.director.getPhysicsManager().attachDebugDrawToCamera(this._camera);
    }

    onDisable() {
        cc.director.getPhysicsManager().detachDebugDrawFromCamera(this._camera);
    }

    lateUpdate(){
        let winSize = cc.winSize;

        let targetPos = this.target.convertToWorldSpaceAR(cc.Vec2.ZERO);
        let newPos = this.node.parent.convertToNodeSpaceAR(targetPos);
        if(newPos.x <= winSize.width / 2){
            newPos.x = winSize.width / 2;
        }

        if(newPos.x >= 11400){
            newPos.x = 11400;
        }
        
        newPos.y =  winSize.height / 2;
        this.node.position = newPos;


        // let ratio = targetPos.y / cc.winSize.height;
        // this._camera.zoomRatio = 1 + (0.5 - ratio) * 0.5;
    }
}
