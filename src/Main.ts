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

        let armatureDisplay: dragonBones.EgretArmatureDisplay = dragonbonesFactory.buildArmatureDisplay("Swordsman");

        this.addChild(armatureDisplay);
        armatureDisplay.x = this.stage.stageWidth / 2;
        armatureDisplay.y = this.stage.stageHeight / 2;
        armatureDisplay.animation.play("steady");



        const action = (e: KeyboardEvent) => {
            /**
             * to remove the keyboard listener to that the animation will no interupt whenever other button is clicked
             */
            document.removeEventListener("keydown", action);
            switch (e.code) {
                case 'KeyQ':
                    armatureDisplay.animation.play("attack1", 1);

                    /**
                     * to run the loop_finish function after the animation is done
                     */
                    armatureDisplay.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, loop_finish, this);
                    break;

                case 'KeyW':
                    armatureDisplay.animation.play("attack1_+1", 1);

                    /**
                     * to run the loop_finish function after the animation is done
                     */
                    armatureDisplay.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, loop_finish, this);
                    break;

                case 'KeyE':
                    armatureDisplay.animation.play("attack2", 1);

                    /**
                     * to run the loop_finish function after the animation is done
                     */
                    armatureDisplay.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, loop_finish, this);
                    break;

                case 'KeyF':
                    if (armatureDisplay.animation.lastAnimationName === 'steady2' || armatureDisplay.animation.lastAnimationName === 'walk2') {
                        armatureDisplay.animation.play("steady");
                    } else {
                        armatureDisplay.animation.play("steady2");
                    }

                    /**
                     * keyboard listener is added back, cannot be added outside of the switch case as it will immediately add back the listener
                     */
                    document.addEventListener("keydown", action);
                    break;

                case 'Space':
                    armatureDisplay.animation.play("jump", 1);

                    /**
                     * to run the loop_finish function after the animation is done
                     */
                    armatureDisplay.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, loop_finish, this);
                    break;

                case 'ArrowRight':
                    if (armatureDisplay.animation.lastAnimationName === 'steady2') {
                        armatureDisplay.animation.play("walk2");
                    } else {
                        armatureDisplay.animation.play("walk");
                    }

                    /**
                     * keyboard listener is added back, cannot be added outside of the switch case as it will immediately add back the listener
                     */
                    document.addEventListener("keydown", action);
                    break;

                case 'ArrowLeft':
                    if (armatureDisplay.animation.lastAnimationName === 'steady2') {
                        armatureDisplay.animation.play("walk2");
                    } else {
                        armatureDisplay.animation.play("walk");
                    }

                    /**
                     * keyboard listener is added back, cannot be added outside of the switch case as it will immediately add back the listener
                     */
                    document.addEventListener("keydown", action);
                    break;

                default:

                    /**
                     * listener is added back, cannot be added outside of the switch case as it will immediately add back the listener
                     */
                    document.addEventListener("keydown", action);
                    armatureDisplay.animation.play("steady");
            };

        }

        document.addEventListener("keydown", action);

        function loop_finish() {
            armatureDisplay.animation.play("steady");

            /**
             * after the animation is done, the keyboard listener is added back again
             */
            document.addEventListener("keydown", action);

            /**
             * if the above action is run first, the listener effect will stay unless removed.
             */
            armatureDisplay.removeEventListener(dragonBones.EventObject.LOOP_COMPLETE, loop_finish, this);
        }

    }
}
