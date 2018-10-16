cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        //cc.director.preloadScene('BattleScene');
    },

    goToBattle() {
        cc.director.loadScene('BattleScene');
    },

    // update (dt) {},
});
