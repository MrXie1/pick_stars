"use strict";
cc._RF.push(module, '5918aCMCLZKIrRt/Rdbipag', 'btn');
// scripts/btn.js

"use strict";

// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
cc.Class({
  "extends": cc.Component,
  properties: {// foo: {
    //     // ATTRIBUTES:
    //     default: null,        // The default value will be used only when the component attaching
    //                           // to a node for the first time
    //     type: cc.SpriteFrame, // optional, default is typeof default
    //     serializable: true,   // optional, default is true
    // },
    // bar: {
    //     get () {
    //         return this._bar;
    //     },
    //     set (value) {
    //         this._bar = value;
    //     }
    // },
  },
  // LIFE-CYCLE CALLBACKS:
  // onLoad () {},
  onStartGame: function onStartGame() {
    // 初始化计分
    this.score = 0;
    this.scoreDisplay.string = 'Score: ' + this.score.toString(); // set game state to running

    this.enabled = true; // set button and gameover text out of screen

    this.btnNode.x = 3000; // reset player position and move speed

    this.player.getComponent('player').startMoveAt(cc.v2(0, this.groundY)); // spawn star

    this.spawnNewStar();
  },
  start: function start() {},
  btnClick: function btnClick(event, customEventData) {
    //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
    var node = event.target;
    var button = node.getComponent(cc.Button); //这里的 customEventData 参数就等于你之前设置的 "click1 user data"

    cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
  } // update (dt) {},

});

cc._RF.pop();