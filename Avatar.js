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
            //let rotation: number = _rotation * 2;
            if (_dash == 1 && !this.usedDash) {
                let dashSpeed = 15;
                speedX *= dashSpeed;
                speedY *= dashSpeed;
                this.usedDash = true;
                console.log("Dash was just used");
                fc.Time.game.setTimer(3000, 1, (_event) => {
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
            this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
            this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
            this.animation.mtxLocal.rotateZ(_rotation);
            if (_reload == 1) {
                PHE.gameState.ammo = 15;
                PHE.cmpAudioReload.play(true);
            }
        }
        shoot() {
            if (this.shotReady && PHE.gameState.ammo > 0) {
                let shotDirection = this.animation.mtxWorld.getX();
                let bulletPosition = new fc.Vector3(this.mtxWorld.translation.x, this.mtxWorld.translation.y - 0.24, 1);
                PHE.bullet = new PHE.Bullet("Bullet", new fc.Vector3(0.1, 0.1, 1), bulletPosition);
                PHE.level.appendChild(PHE.bullet);
                PHE.cmpAudioShoot.play(true);
                PHE.bullet.shoot(shotDirection);
                PHE.gameState.ammo--;
                this.shotReady = false;
                fc.Time.game.setTimer(800, 1, (_event) => {
                    this.shotReady = true;
                });
            }
            else if (this.shotReady && PHE.gameState.ammo == 0) {
                PHE.cmpAudioEmptyGun.play(true);
            }
        }
        rotateTo(_mousePos) {
            let newMousePos = fc.Vector3.DIFFERENCE(_mousePos, this.mtxWorld.translation);
            let lookDirection = this.animation.mtxWorld.getX();
            let angleRotation = this.calcAngleBetweenVectors(newMousePos, lookDirection);
            let newLookDirection = this.rotateVector(lookDirection, angleRotation);
            if (this.calcAngleBetweenVectors(newLookDirection, newMousePos) > 0.1) {
                angleRotation = angleRotation * -1;
            }
            PHE.controlRotation.setInput(angleRotation);
        }
        calcAngleBetweenVectors(_vector1, _vector2) {
            let angle;
            angle = fc.Vector3.DOT(_vector1, _vector2) / (this.vectorAmount(_vector1) * this.vectorAmount(_vector2));
            angle = Math.acos(angle) * 180 / Math.PI;
            return angle;
        }
        vectorAmount(_vector) {
            return Math.sqrt(Math.pow(_vector.x, 2) + Math.pow(_vector.y, 2) + Math.pow(_vector.z, 2));
        }
        rotateVector(_vector, _angle) {
            let _rotatedVector = new fc.Vector3;
            let xCoord;
            let yCoord;
            let cosAngle = Math.cos(_angle * Math.PI / 180);
            let sinAngle = Math.sin(_angle * Math.PI / 180);
            xCoord = (_vector.x * cosAngle) - (_vector.y * sinAngle);
            yCoord = (_vector.x * sinAngle) + (_vector.y * cosAngle);
            _rotatedVector = new fc.Vector3(xCoord, yCoord, 0);
            return _rotatedVector;
        }
    }
    PHE.Avatar = Avatar;
})(PHE || (PHE = {}));
//# sourceMappingURL=Avatar.js.map