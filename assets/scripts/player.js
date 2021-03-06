// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // 主角跳跃高度
        jumpHeight: 0,
        // 主角跳跃持续时间
        jumpDuration: 0,
        // 最大移动速度
        maxMoveSpeed: 0,
        // 加速度
        accel: 0,         
        // 跳跃音效资源
        jumpAudio: {
            default: null,
            type: cc.AudioClip
        },      
        // 主角跳跃高度
        jumpHeight: 0,
        // 主角跳跃持续时间
        jumpDuration: 0,
        // 辅助形变动作时间
        squashDuration: 0,
    },
    runJumpAction () {
        // 跳跃上升
        var jumpUp = cc.tween().by(this.jumpDuration, {y: this.jumpHeight}, {easing: 'sineOut'});
        // 下落
        var jumpDown = cc.tween().by(this.jumpDuration, {y: -this.jumpHeight}, {easing: 'sineIn'});
        // 形变
        var squash = cc.scaleTo(this.squashDuration, 1, 0.6);
        var stretch = cc.scaleTo(this.squashDuration, 1, 1.2);
        var scaleBack = cc.scaleTo(this.squashDuration, 1, 1);
        // 添加一个回调函数，用于在动作结束时调用我们定义的其他方法
        // var callback = cc.callFunc(this.playJumpSound, this);
        // 创建一个缓动，按 jumpUp、jumpDown 的顺序执行动作 
        // .call 添加一个回调函数，在前面的动作都结束时调用我们定义的 playJumpSound() 方法
        var tween = cc.tween().sequence(jumpUp, jumpDown, squash, stretch, scaleBack).call(this.playJumpSound, this);
        // 不断重复
        return cc.tween().repeatForever(tween);
    },
    playJumpSound: function () {
        // 调用声音引擎播放声音
        cc.audioEngine.playEffect(this.jumpAudio, false);
    },
    onKeyDown (event) {
        // set a flag when key pressed
        // console.log('down', event.keyCode)
        switch(event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                this.accLeft = true;
                this.accRight = false;
                break;
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:    
                this.accLeft = false;
                this.accRight = true;
                break;
            }
    },
            
    onKeyUp (event) {
        // unset a flag when key released
        // console.log('up', event.keyCode)
        switch(event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                this.accLeft = false;
                break;
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                this.accRight = false;
                break;
        }
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.enabled = false;
        // 初始化跳跃动作
        // var jumpAction = this.runJumpAction();
        // cc.tween(this.node).then(jumpAction).start()
        // 加速度方向开关
        this.accLeft = false;
        this.accRight = false;
        // 主角当前水平方向速度
        this.xSpeed = 0;
        // 初始化键盘输入监听
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);   
        var touchReceiver = cc.Canvas.instance.node;
        touchReceiver.on('touchstart', this.onTouchStart, this);
        touchReceiver.on('touchend', this.onTouchEnd, this);                
    },
    startMoveAt: function (pos) {
        this.enabled = true;
        this.xSpeed = 0;
        this.node.setPosition(pos);
        var jumpAction = this.runJumpAction();
        cc.tween(this.node).then(jumpAction).start()        
    },    
    onDestroy () {
        // 取消键盘输入监听
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        var touchReceiver = cc.Canvas.instance.node;
        touchReceiver.off('touchstart', this.onTouchStart, this);
        touchReceiver.off('touchend', this.onTouchEnd, this);
    },
    onTouchStart (event) {
        var touchLoc = event.getLocation();
        if (touchLoc.x >= cc.winSize.width/2) {
            this.accLeft = false;
            this.accRight = true;
        } else {
            this.accLeft = true;
            this.accRight = false;
        }
    },
    
    onTouchEnd (event) {
        this.accLeft = false;
        this.accRight = false;
    },    
    start () {
        this.winMaxWidth=cc.winSize.width/2-this.node.width/2;
    },

    update (dt) {
        // 根据当前加速度方向每帧更新速度
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt;
        }
        else if (this.accRight) {
            this.xSpeed += this.accel * dt;
        }

        // 限制主角的速度不能超过最大值
        if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
            // if speed reach limit, use max speed with current direction
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }
        // 判断不能超出画布内
        if(Math.abs(this.node.x)>this.winMaxWidth){
            this.node.x=this.winMaxWidth*this.node.x/Math.abs(this.node.x);
        }
        // 根据当前速度更新主角的位置
        this.node.x += this.xSpeed * dt;        
    }
});
