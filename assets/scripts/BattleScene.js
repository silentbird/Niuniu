var g_playerNum = 2;//玩家数量
var g_player = [];//玩家
var A2_10JQK = 'NAN,A,2,3,4,5,6,7,8,9,10,J,Q,K'.split(',');
var firstEnter = true;

var BattleScene = cc.Class({
    extends: cc.Component,

    properties: {
        registerLayer: cc.Node,
        btnResetGame: cc.Button,
        editbox: cc.EditBox,
        playLayer: cc.Node,
        playerCard: [cc.Sprite],
        bossCard: [cc.Sprite],
        Suit: [cc.SpriteFrame],
        mainPic: [cc.SpriteFrame],
        bossResult: cc.Sprite,
        playerResult: cc.Sprite,
        ResultText: cc.Label,
        playerInfo: cc.Node,
    },

    onLoad: function () {
        if (firstEnter == true) {
            this.registerLayer.active = true;
            this.playLayer.active = false;
        }
        else {
            this.registerLayer.active = false;
            this.playLayer.active = true;
            this.startGame();
        }
    },

    backToLogin: function () {
        firstEnter = true;
        cc.director.loadScene('LoginScene');
    },

    startGame: function () {
        var playername = this.editbox.string;
        this.registerLayer.active = false;
        this.playLayer.active = true;
        this.playerInfo.active = true;
        this.playerInfo.getChildByName("playerName").getComponent(cc.Label).string = playername;
        this.playerInfo.getChildByName("playerMoney").getComponent(cc.Label).string = '$5000';
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
                Beishu: 1,
            };
            for (let j = 0; j < 5; j++) {
                g_player[i].Card[j] = {
                    idx: 1,             //0~51  
                    number: 1,          //1~13
                    inumber: 1,         //1~10
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
                g_player[i].Card[j].inumber = g_player[i].Card[j].idx % 13 + 1;
                if (g_player[i].Card[j].inumber >= 10) g_player[i].Card[j].inumber = 10;
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
        for (let playeridx = 0; playeridx < 2; playeridx++) {
            for (let i = 0; i < 5; i++) {
                for (let j = i + 1; j < 5; j++) {
                    for (let k = j + 1; k < 5; k++) {
                        var number = [];
                        number[0] = g_player[playeridx].Card[i].inumber;
                        number[1] = g_player[playeridx].Card[j].inumber;
                        number[2] = g_player[playeridx].Card[k].inumber;
                        number[3] = g_player[playeridx].Card[TwoFromFive(i, j, k)[0]].inumber;
                        number[4] = g_player[playeridx].Card[TwoFromFive(i, j, k)[1]].inumber;
                        //有牛牛的情况
                        if ((number[0] + number[1] + number[2]) % 10 == 0) {
                            g_player[playeridx].Type = (number[3] + number[4]) % 10;
                            if (g_player[playeridx].Type >= 7) {
                                g_player[playeridx].Beishu = 2;
                            }
                            //牛牛的情况
                            if ((number[3] + number[4]) % 10 == 0) {
                                g_player[playeridx].Type = 10;
                                g_player[playeridx].Beishu = 3;
                            }
                        }
                    }
                }
            }
            //四炸
            for (let a = 0; a < 5; a++) {
                for (let b = a + 1; b < 5; b++) {
                    for (let c = b + 1; c < 5; c++) {
                        for (let d = c + 1; d < 5; d++) {
                            if (g_player[playeridx].Card[a].number == g_player[playeridx].Card[b].number
                                && g_player[playeridx].Card[a].number == g_player[playeridx].Card[c].number
                                && g_player[playeridx].Card[a].number == g_player[playeridx].Card[d].number) {
                                g_player[playeridx].Type = 11;
                                g_player[playeridx].Beishu = 4;
                            }
                            for (let e = d + 1; e < 5; e++) {
                                //五花牛的情况
                                if (g_player[playeridx].Card[a].number > 10
                                    && g_player[playeridx].Card[b].number > 10
                                    && g_player[playeridx].Card[c].number > 10
                                    && g_player[playeridx].Card[d].number > 10
                                    && g_player[playeridx].Card[e].number > 10) {
                                    g_player[playeridx].Type = 12;
                                    g_player[playeridx].Beishu = 5;
                                }
                            }
                        }
                    }
                }
            }
            //五小牛判断
            if (g_player[playeridx].Card[0].number < 6
                && g_player[playeridx].Card[1].number < 6
                && g_player[playeridx].Card[2].number < 6
                && g_player[playeridx].Card[3].number < 6
                && g_player[playeridx].Card[4].number < 6
                && g_player[playeridx].Card[0].number + g_player[playeridx].Card[1].number
                + g_player[playeridx].Card[2].number + g_player[playeridx].Card[3].number
                + g_player[playeridx].Card[4].number <= 10) {
                g_player[playeridx].Type = 13;
                g_player[playeridx].Beishu = 8;
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
            if (i == 4) {
                this.bossCard[i].node.runAction(
                    cc.sequence(cc.moveBy(timeframe * i, cc.v2(distance * i, 0)),
                        cc.delayTime(0.5),
                        cc.callFunc(this.compareCard, this),
                        cc.delayTime(0.5),
                        cc.callFunc(this.result, this)));
                return;
            }
            this.bossCard[i].node.runAction(cc.moveBy(timeframe * i, cc.v2(distance * i, 0)));
        }
    },

    resetGame: function () {
        cc.director.loadScene('BattleScene');
        firstEnter = false;
    },

    compareCard: function () {
        var result = [cc.Sprite];
        for (let i = 0; i < 2; i++) {
            if (i == 0) {
                result[i] = this.bossResult;
            }
            else {
                result[i] = this.playerResult;
            }
            cc.loader.loadRes("niu" + g_player[i].Type, cc.SpriteFrame, function (err, spriteFrame) {
                result[i].node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
            result[i].node.active = true;
            result[i].node.scale = 0;
            result[i].node.runAction(cc.sequence(cc.scaleTo(0.2, 1.5), cc.scaleTo(0.1, 1)));
        }
    },

    result: function () {
        this.ResultText.node.active = true;
        if (g_player[0].Type > g_player[1].Type) {
            this.ResultText.string = '你输了！';
            g_player[1].Beishu = -g_player[1].Beishu;
        }
        else if (g_player[0].Type < g_player[1].Type) {
            this.ResultText.string = '你赢了！';
        }
        else {
            this.ResultText.string = '平局！';
            g_player[1].Beishu = 0;
        }
        this.btnResetGame.node.active = true;
        this.btnResetGame.scale = 0;
        this.btnResetGame.node.runAction(cc.scaleTo(1, 1));
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