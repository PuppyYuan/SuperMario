const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {


    onBeginContact(contact, selfCollider, otherCollider) {
        let group = cc.game.groupList[otherCollider.node.groupIndex];
        if (group === 'player') {
            this.node.destroy();
        }
    }
}
