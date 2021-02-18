"use strict";
var PHE;
(function (PHE) {
    var fc = FudgeCore;
    //import fcaid = FudgeAid;
    let JOB;
    (function (JOB) {
        JOB[JOB["IDLE"] = 0] = "IDLE";
        JOB[JOB["PATROL"] = 1] = "PATROL";
        JOB[JOB["Hunt"] = 2] = "Hunt";
    })(JOB = PHE.JOB || (PHE.JOB = {}));
    class Enemy extends PHE.Moveable {
        // private animation: fc.Node;
        //private rotateNow: boolean = false;
        /*  private red: fc.Material = new fc.Material("Red", fc.ShaderUniColor, new fc.CoatColored(fc.Color.CSS("RED")));
         private hitBox: fc.Node;
         private meshQuad: fc.MeshQuad = new fc.MeshQuad(); */
        constructor(_name, _size, _position, _material) {
            super(_name, _size, _position);
            this.speed = 3;
            let cmpMaterial = new fc.ComponentMaterial(_material);
            this.addComponent(cmpMaterial);
            this.mtxLocal.rotateZ(fc.Random.default.getRange(0, 359));
            this.mtxLocal.translation = _position;
            this.mtxLocal.translateZ(0.01);
            this.rect = new fc.Rectangle(_position.x, _position.y, _size.x / 4, _size.y / 4, fc.ORIGIN2D.CENTER);
            /*  this.hitBox = new fcaid.Node("Laser", fc.Matrix4x4.IDENTITY());
             this.appendChild(this.hitBox);
             let cmpMaterialred: fc.ComponentMaterial = new fc.ComponentMaterial(this.red);
             this.hitBox.addComponent(new fc.ComponentMesh(this.meshQuad));
             this.hitBox.addComponent(cmpMaterialred);
             this.hitBox.mtxLocal.scaleX(this.rect.size.x);
             this.hitBox.mtxLocal.scaleY(this.rect.size.y);
             this.hitBox.mtxLocal.scaleZ(0); */
        }
        update() {
            this.moveEnemy();
            if (this.checkCollision(PHE.avatar, null) && PHE.gameState.health > 0) {
                PHE.gameState.health -= 5;
                this.mtxLocal.translateX(-2);
                this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
                this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
                let zombieSound = Math.round(fc.random.getRange(1, 3));
                switch (zombieSound) {
                    case 1:
                        PHE.cmpAudioZombie1.play(true);
                        break;
                    case 2:
                        PHE.cmpAudioZombie2.play(true);
                        break;
                    default:
                        PHE.cmpAudioZombie1.play(true);
                }
            }
        }
        moveEnemy() {
            if (this.vectorAmount(fc.Vector3.DIFFERENCE(PHE.avatar.mtxLocal.translation, this.mtxLocal.translation)) < 8 && this.vectorAmount(fc.Vector3.DIFFERENCE(PHE.avatar.mtxLocal.translation, this.mtxLocal.translation)) > 1) {
                this.rotateToAvatar();
                this.mtxLocal.translateX(this.speed * fc.Loop.timeFrameGame / 1000);
                this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
                this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
            }
        }
        rotateToAvatar() {
            let vectorAnimation3D = fc.Vector3.DIFFERENCE(PHE.avatar.mtxLocal.translation, this.mtxLocal.translation);
            let vectorAnimation = new fc.Vector3(vectorAnimation3D.x, vectorAnimation3D.y, 0);
            // let xCoordNorm: number = (1 / this.vectorAmount(vectorA)) * vectorA.x;
            let yCoordNorm = (1 / this.vectorAmount(vectorAnimation)) * vectorAnimation.y;
            let angle;
            angle = Math.acos(yCoordNorm) * 180 / Math.PI;
            angle += 90;
            if (this.mtxLocal.translation.x < PHE.avatar.mtxLocal.translation.x) {
                angle = 180 - angle;
            }
            this.mtxLocal.rotateZ(this.mtxLocal.rotation.z * -1);
            this.mtxLocal.rotateZ(angle);
        }
        vectorAmount(_vector) {
            return Math.sqrt(Math.pow(_vector.x, 2) + Math.pow(_vector.y, 2) + Math.pow(_vector.z, 2));
        }
    }
    PHE.Enemy = Enemy;
})(PHE || (PHE = {}));
//# sourceMappingURL=Enemy.js.map