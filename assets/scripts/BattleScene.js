var g_playerNum = 2;//玩家数量
var g_player = [];//玩家
var A2_10JQK = 'NAN,A,2,3,4,5,6,7,8,9,10,J,Q,K'.split(',');

var BattleScene = cc.Class({
    extends: cc.Component,

    properties: {
        editbox: cc.EditBox,
        btnStart: cc.Button,
        playLayer: cc.Node,
        playerCard: [cc.Sprite],
        bossCard: [cc.Sprite],
        Suit: [cc.SpriteFrame],
        mainPic: [cc.SpriteFrame],
    },

    backToLogin: function () {
        cc.director.loadScene('LoginScene');
    },

    startGame: function () {
        var playername = this.editbox.string;
        this.editbox.node.runAction(cc.removeSelf());
        this.btnStart.node.runAction(cc.removeSelf());
        this.playLayer.active = true;
        this.initCard();
        this.pushCard();
        //cc.log('playername=', playername);
    },

    initCard: function () {
        //初始化牌的信息    
        var g_arCard = [];  //1~52的牌组
        var g_cardNum = 52; //当前arCard中的牌的数量
        //初始化g_arCard 52张牌
        for (let i = 0; i < 52; i++) {
            g_arCard[i] = i;
        }
        //初始化g_player.Card
        for (let i = 0; i < g_playerNum; i++) {
            g_player[i] = {
                Type: 0,
                Card: [],
            };
            for (let j = 0; j < 5; j++) {
                g_player[i].Card[j] = {
                    idx: 1,             //0~51  
                    number: 1,          //1~13
                    color: 'Red',       //Red or Black
                    type: 'Fangkuai',
                    mainPic: 'queen',
                };

                let a = randNum(0, g_cardNum);  //0到g_cardNum-1随机数
                //初始化sprite精灵
                if (i == 0) {
                    var m_point = this.bossCard[j].node.getChildByName('point');
                    var m_suit = this.bossCard[j].node.getChildByName('suit');
                    var m_mainPic = this.bossCard[j].node.getChildByName('mainPic');
                }
                else {
                    var m_point = this.playerCard[j].node.getChildByName('point');
                    var m_suit = this.playerCard[j].node.getChildByName('suit');
                    var m_mainPic = this.playerCard[j].node.getChildByName('mainPic');
                }
                g_player[i].Card[j].idx = g_arCard[a];
                g_player[i].Card[j].number = g_player[i].Card[j].idx % 13 + 1;
                //数字
                m_point.getComponent(cc.Label).string = A2_10JQK[g_player[i].Card[j].number];
                //数字颜色
                switch (Math.floor(g_player[i].Card[j].idx / 26)) {
                    case 0:
                        g_player[i].Card[j].color = 'Red';
                        m_point.color = cc.color(202, 5, 5, 255);
                        break;
                    case 1:
                        g_player[i].Card[j].color = 'Black';
                        m_point.color = cc.Color.BLACK;
                        break;
                }
                //类型 小图标suit
                switch (Math.floor(g_player[i].Card[j].idx / 13)) {
                    case 0:
                        //方块
                        g_player[i].Card[j].mainPic = g_player[i].Card[j].type = 'Fangkuai';
                        m_suit.getComponent(cc.Sprite).spriteFrame = this.Suit[0];
                        m_mainPic.getComponent(cc.Sprite).spriteFrame = this.mainPic[0];
                        break;
                    case 1:
                        //红桃
                        g_player[i].Card[j].mainPic = g_player[i].Card[j].type = 'Hongtao';
                        m_suit.getComponent(cc.Sprite).spriteFrame = this.Suit[1];
                        m_mainPic.getComponent(cc.Sprite).spriteFrame = this.mainPic[1];
                        break;
                    case 2:
                        //黑桃
                        g_player[i].Card[j].mainPic = g_player[i].Card[j].type = 'Heitao';
                        m_suit.getComponent(cc.Sprite).spriteFrame = this.Suit[2];
                        m_mainPic.getComponent(cc.Sprite).spriteFrame = this.mainPic[2];
                        break;
                    case 3:
                        //梅花
                        g_player[i].Card[j].mainPic = g_player[i].Card[j].type = 'Meihua';
                        m_suit.getComponent(cc.Sprite).spriteFrame = this.Suit[3];
                        m_mainPic.getComponent(cc.Sprite).spriteFrame = this.mainPic[3];
                        break;
                }
                //MainPic
                switch (g_player[i].Card[j].number) {
                    case 11:
                        g_player[i].Card[j].mainPic = 'Ranker';
                        m_mainPic.getComponent(cc.Sprite).spriteFrame = this.mainPic[4];
                        break;
                    case 12:
                        g_player[i].Card[j].mainPic = 'Queen';
                        m_mainPic.getComponent(cc.Sprite).spriteFrame = this.mainPic[5];
                        break;
                    case 13:
                        g_player[i].Card[j].mainPic = 'King';
                        m_mainPic.getComponent(cc.Sprite).spriteFrame = this.mainPic[6];
                        break;
                    default:
                        break;
                }
                //将随机到的从卡牌数组g_arCard中删去
                g_arCard.splice(a, 1);
                g_cardNum--;
            }
        }
        //初始化g_player.Type
        for (let playeridx = 0; playeridx < 2; playeridx) {
            for (let i = 0; i < 5; i++) {
                for (let j = i + 1; j < 5; j++) {
                    for (let k = j + 1; k < 5; k++) {
                        if (g_player[playeridx].Card[i] + g_player[playeridx].Card[j] + g_player[playeridx].Card[k] == 0) {
                            g_player[playeridx].Type = TwoFromFive(i, j, k)[0] + TwoFromFive(i, j, k)[1];
                        }
                    }
                }
            }
        }
    },

    pushCard: function () {
        var timeframe = 0.1;
        var distance = 40;
        for (let i = 0; i < 5; i++) {
            this.playerCard[i].node.runAction(cc.moveBy(timeframe * i, cc.v2(distance * i, 0)));
        }
        for (let i = 0; i < 5; i++) {
            this.bossCard[i].node.runAction(cc.moveBy(timeframe * i, cc.v2(distance * i, 0)));
        }
    },

    resetGame() {
        cc.director.loadScene('BattleScene');
        //this.startGame();
    }
});


function randNum(min, max) {
    //获得一个min到max-1的随机数
    return Math.floor(Math.random() * (max - min) + min);
}

function TwoFromFive(a, b, c) {
    var arr = [];
    for (let i = 0, j = 0; i < 5; i++) {
        if (i != a && i != b && i != c) {
            arr[j] = i;
            j++;
        }
    }
    return arr;
}

/*
function initCard(bosscard, playercard, suit, mainpic) {
    //初始化牌的信息    
    var g_arCard = [];  //1~52的牌组
    var g_cardNum = 52; //当前arCard中的牌的数量
    var g_playerNum = 2;//玩家数量
    var g_playerCard = [];//玩家手牌
    var A2_10JQK = 'NAN,A,2,3,4,5,6,7,8,9,10,J,Q,K'.split(',');
    //初始化g_arCard 52张牌
    for (let i = 0; i < 52; i++) {
        g_arCard[i] = i;
    }
    //初始化g_playerCard
    for (let i = 0; i < g_playerNum; i++) {
        g_playerCard[i] = [];
        for (let j = 0; j < 5; j++) {
            g_player[i].Card[j] = {
                idx: 1,
                number: 1,
                color: 'Red',
                type: 'Fangkuai',
                mainPic: 'queen',
            };

            let a = randNum(0, g_cardNum);
            //初始化sprite精灵
            if (i == 0) {
                var m_point = bosscard[j].node.getChildByName('point');
                var m_suit = bosscard[j].node.getChildByName('suit');
                var m_mainPic = bosscard[j].node.getChildByName('mainPic');
            }
            else {
                var m_point = playercard[j].node.getChildByName('point');
                var m_suit = playercard[j].node.getChildByName('suit');
                var m_mainPic = playercard[j].node.getChildByName('mainPic');
            }
            g_player[i].Card[j].idx = a;
            g_player[i].Card[j].number = g_player[i].Card[j].idx % 13 + 1;
            //数字
            m_point.getComponent(cc.Label).string = A2_10JQK[g_player[i].Card[j].number];
            //数字颜色
            switch (Math.floor(g_player[i].Card[j].idx / 26)) {
                case 0:
                    g_player[i].Card[j].color = 'Red';
                    m_point.color = cc.color(202, 5, 5, 255);
                    break;
                case 1:
                    g_player[i].Card[j].color = 'Black';
                    m_point.color = cc.Color.BLACK;
                    break;
            }
            //类型 小图标suit
            switch (Math.floor(g_player[i].Card[j].idx / 13)) {
                case 0:
                    //方块
                    g_player[i].Card[j].mainPic = g_player[i].Card[j].type = 'Fangkuai';
                    m_suit.getComponent(cc.Sprite).spriteFrame = suit[0];
                    m_mainPic.getComponent(cc.Sprite).spriteFrame = mainpic[0];
                    break;
                case 1:
                    //红桃
                    g_player[i].Card[j].mainPic = g_player[i].Card[j].type = 'Hongtao';
                    m_suit.getComponent(cc.Sprite).spriteFrame = suit[1];
                    m_mainPic.getComponent(cc.Sprite).spriteFrame = mainpic[1];
                    break;
                case 2:
                    //黑桃
                    g_player[i].Card[j].mainPic = g_player[i].Card[j].type = 'Heitao';
                    m_suit.getComponent(cc.Sprite).spriteFrame = suit[2];
                    m_mainPic.getComponent(cc.Sprite).spriteFrame = mainpic[2];
                    break;
                case 3:
                    //梅花
                    g_player[i].Card[j].mainPic = g_player[i].Card[j].type = 'Meihua';
                    m_suit.getComponent(cc.Sprite).spriteFrame = suit[3];
                    m_mainPic.getComponent(cc.Sprite).spriteFrame = mainpic[3];
                    break;
            }
            //MainPic
            switch (g_player[i].Card[j].number) {
                case 11:
                    g_player[i].Card[j].mainPic = 'Ranker';
                    m_mainPic.getComponent(cc.Sprite).spriteFrame = mainpic[4];
                    break;
                case 12:
                    g_player[i].Card[j].mainPic = 'Queen';
                    m_mainPic.getComponent(cc.Sprite).spriteFrame = mainpic[5];
                    break;
                case 13:
                    g_player[i].Card[j].mainPic = 'King';
                    m_mainPic.getComponent(cc.Sprite).spriteFrame = mainpic[6];
                    break;
                default:
                    break;
            }
            //将随机到的从卡牌数组g_arCard中删去
            g_arCard.splice(a, 1);
            g_cardNum--;
        }
    }
}
*/