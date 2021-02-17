//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends eui.UILayer {


    protected createChildren(): void {
        super.createChildren();

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());


        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private async runGame() {
        await this.loadResource()
        this.createGameScene();
        // const result = await RES.getResAsync("description_json")
        // this.startAnimation(result);
        await platform.login();
        const userInfo = await platform.getUserInfo();
        console.log(userInfo);

    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await this.loadTheme();
            await RES.loadGroup("skin")
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);

        })
    }

    private textfield: egret.TextField;
    /**
     * 创建场景界面
     * Create scene interface
     */
    protected createGameScene(): void {

        /**
         * import all the resource
         */
        var dragonbonesData = RES.getRes("SwordsMan_ske_json");
        var textureData = RES.getRes("SwordsMan_tex_json");
        var texture = RES.getRes("SwordsMan_tex_png");

        let dragonbonesFactory: dragonBones.EgretFactory = new dragonBones.EgretFactory();
        dragonbonesFactory.parseDragonBonesData(dragonbonesData);
        dragonbonesFactory.parseTextureAtlasData(textureData, texture);


        /**
         * this name is retrieved from dragonbone 'armature' section
         */
        let armatureDisplayAttack1: dragonBones.EgretArmatureDisplay = dragonbonesFactory.buildArmatureDisplay("Swordsman");
        let armatureDisplayAttack1_1: dragonBones.EgretArmatureDisplay = dragonbonesFactory.buildArmatureDisplay("Swordsman");
        let armatureDisplayAttack2: dragonBones.EgretArmatureDisplay = dragonbonesFactory.buildArmatureDisplay("Swordsman");
        let armatureDisplayJump: dragonBones.EgretArmatureDisplay = dragonbonesFactory.buildArmatureDisplay("Swordsman");
        let armatureDisplaySteady: dragonBones.EgretArmatureDisplay = dragonbonesFactory.buildArmatureDisplay("Swordsman");
        let armatureDisplaySteady2: dragonBones.EgretArmatureDisplay = dragonbonesFactory.buildArmatureDisplay("Swordsman");
        let armatureDisplayWalk: dragonBones.EgretArmatureDisplay = dragonbonesFactory.buildArmatureDisplay("Swordsman");
        let armatureDisplayWalk2: dragonBones.EgretArmatureDisplay = dragonbonesFactory.buildArmatureDisplay("Swordsman");


        this.addChild(armatureDisplayAttack1);
        this.addChild(armatureDisplayAttack1_1);
        this.addChild(armatureDisplayAttack2);
        this.addChild(armatureDisplayJump);
        this.addChild(armatureDisplaySteady);
        this.addChild(armatureDisplaySteady2);
        this.addChild(armatureDisplayWalk);
        this.addChild(armatureDisplayWalk2);


        armatureDisplayAttack1.x = this.stage.stageWidth * 0.2;
        armatureDisplayAttack1.y = this.stage.stageHeight * 0.25;
        armatureDisplayAttack1_1.x = this.stage.stageWidth * 0.4;
        armatureDisplayAttack1_1.y = this.stage.stageHeight * 0.25;
        armatureDisplayAttack2.x = this.stage.stageWidth * 0.6;
        armatureDisplayAttack2.y = this.stage.stageHeight * 0.25;
        armatureDisplayJump.x = this.stage.stageWidth * 0.8;
        armatureDisplayJump.y = this.stage.stageHeight * 0.25;

        armatureDisplaySteady.x = this.stage.stageWidth * 0.2;
        armatureDisplaySteady.y = this.stage.stageHeight * 0.75;
        armatureDisplaySteady2.x = this.stage.stageWidth * 0.4;
        armatureDisplaySteady2.y = this.stage.stageHeight * 0.75;
        armatureDisplayWalk.x = this.stage.stageWidth * 0.6;
        armatureDisplayWalk.y = this.stage.stageHeight * 0.75;
        armatureDisplayWalk2.x = this.stage.stageWidth * 0.8;
        armatureDisplayWalk2.y = this.stage.stageHeight * 0.75;

        /**
         * these name are retrieved from dragonbone 'animation' section
         */
        armatureDisplayAttack1.animation.play("attack1");
        armatureDisplayAttack1_1.animation.play("attack1_+1");
        armatureDisplayAttack2.animation.play("attack2");
        armatureDisplayJump.animation.play("jump");
        armatureDisplaySteady.animation.play("steady");
        armatureDisplaySteady2.animation.play("steady2");
        armatureDisplayWalk.animation.play("walk");
        armatureDisplayWalk2.animation.play("walk2");


    }
}
