"use strict";
var PHE;
(function (PHE) {
    var fc = FudgeCore;
    var fcaid = FudgeAid;
    class Avatar extends PHE.Moveable {
        constructor(_name, _size, _position) {
            super(_name, _size, _position);
            // public rect: fc.Rectangle;
            this.clrWhite = fc.Color.CSS("white");
            this.meshQuad = new fc.MeshQuad();
            this.txtAvatar = new fc.TextureImage("../Assets/Top_Down_Survivor/shotgun/idle/survivor-idle_shotgun_0.png");
            this.mtrAvatar = new fc.Material("MaterialAvatar", fc.ShaderTexture, new fc.CoatTextured(this.clrWhite, this.txtAvatar));
            this.usedDash = false;
            this.shotReady = true;
            this.red = new fc.Material("Red", fc.ShaderUniColor, new fc.CoatColored(fc.Color.CSS("RED")));
            this.animation = new fcaid.Node("Animation", fc.Matrix4x4.IDENTITY());
            this.appendChild(this.animation);
            this.animation.addComponent(new fc.ComponentMaterial(this.mtrAvatar));
            this.animation.addComponent(new fc.ComponentMesh(this.meshQuad));
            this.animation.mtxLocal.translateZ(0.01);
            this.mtxLocal.translation = _position;
            this.lasersight = new fcaid.Node("Laser", fc.Matrix4x4.IDENTITY());
            this.animation.appendChild(this.lasersight);
            let cmpMaterial = new fc.ComponentMaterial(this.red);
            this.lasersight.addComponent(new fc.ComponentMesh(this.meshQuad));
            this.lasersight.addComponent(cmpMaterial);
            this.lasersight.mtxLocal.scale(new fc.Vector3(6, 0.01, 0));
            this.lasersight.mtxLocal.translateX(0.5);
            this.lasersight.mtxLocal.translateY(-24);
        }
        moveAvatar(_translationY, _translationX, _dash, _rotation, _shoot, _reload) {
            let speedX = _translationX * 0.08;
            let speedY = _translationY * 0.08;
            let rotation = _rotation * 2;
            if (_dash == 1 && !this.usedDash) {
                let dashSpeed = 15;
                speedX *= dashSpeed;
                speedY *= dashSpeed;
                this.usedDash = true;
                console.log("Dash was just used");
                fc.Time.game.setTimer(2000, 1, (_event) => {
                    this.usedDash = false;
                    console.log("Dash can be used again");
                });
            }
            else {
                speedX *= 1;
                speedY *= 1;
            }
            this.mtxLocal.translateX(speedX);
            this.mtxLocal.translateY(speedY);
            // this.rect.position.x = this.mtxLocal.translation.x;
            //this.rect.position.y = this.mtxLocal.translation.y;
            this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
            this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
            this.animation.mtxLocal.rotateZ(rotation);
            if (_shoot == 1 && this.shotReady && PHE.gameState.ammo > 0) {
                this.shoot();
                this.shotReady = false;
                fc.Time.game.setTimer(800, 1, (_event) => {
                    this.shotReady = true;
                });
            }
            if (_reload == 1) {
                PHE.gameState.ammo = 15;
                PHE.cmpAudioReload.play(true);
            }
        }
        shoot() {
            let shotDirection = this.animation.mtxWorld.getX();
            console.log("Shootdirection: " + shotDirection);
            let bulletPosition = new fc.Vector3(this.mtxWorld.translation.x, this.mtxWorld.translation.y - 0.24, 1);
            PHE.bullet = new PHE.Bullet("Bullet", new fc.Vector3(0.1, 0.1, 1), bulletPosition);
            PHE.level.appendChild(PHE.bullet);
            PHE.cmpAudioShoot.play(true);
            PHE.bullet.shoot(shotDirection);
            PHE.gameState.ammo--;
        }
    }
    PHE.Avatar = Avatar;
})(PHE || (PHE = {}));
//# sourceMappingURL=Avatar.js.map