"use strict";
var PHE;
(function (PHE) {
    var fc = FudgeCore;
    var fcaid = FudgeAid;
    class Avatar extends PHE.Moveable {
        constructor(_name, _size, _position) {
            super(_name, _size, _position);
            // public rect: fc.Rectangle;
            this.white = fc.Color.CSS("white");
            this.meshQuad = new fc.MeshQuad();
            this.txtAvatar = new fc.TextureImage("../Assets/survivor-move_handgun_0.png");
            this.mtrAvatar = new fc.Material("MaterialAvatar", fc.ShaderTexture, new fc.CoatTextured(this.white, this.txtAvatar));
            this.usedDash = false;
            this.animation = new fcaid.Node("Animation", fc.Matrix4x4.IDENTITY());
            this.appendChild(this.animation);
            this.animation.addComponent(new fc.ComponentMaterial(this.mtrAvatar));
            this.animation.addComponent(new fc.ComponentMesh(this.meshQuad));
            this.animation.mtxLocal.translateZ(0.01);
            this.mtxLocal.translation = _position;
            //this.rect = new fc.Rectangle(_position.x, _position.y, _size.x, _size.y, fc.ORIGIN2D.CENTER);
        }
        moveAvatar(_translationY, _translationX, _dash, _rotation) {
            let speedX = _translationX * 0.08;
            let speedY = _translationY * 0.08;
            let rotation = _rotation * 4.5;
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
        }
    }
    PHE.Avatar = Avatar;
})(PHE || (PHE = {}));
//# sourceMappingURL=Avatar.js.map