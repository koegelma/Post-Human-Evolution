"use strict";
var PHE;
(function (PHE) {
    var fc = FudgeCore;
    var fcaid = FudgeAid;
    let JOB;
    (function (JOB) {
        JOB[JOB["IDLE"] = 0] = "IDLE";
        JOB[JOB["PATROL"] = 1] = "PATROL";
        JOB[JOB["Hunt"] = 2] = "Hunt";
    })(JOB = PHE.JOB || (PHE.JOB = {}));
    class Enemy extends PHE.Moveable {
        constructor(_name, _size, _position, _material) {
            super(_name, _size, _position);
            this.speed = 3;
            // private animation: fc.Node;
            //private rotateNow: boolean = false;
            this.red = new fc.Material("Red", fc.ShaderUniColor, new fc.CoatColored(fc.Color.CSS("RED")));
            this.meshQuad = new fc.MeshQuad();
            let cmpMaterial = new fc.ComponentMaterial(_material);
            this.addComponent(cmpMaterial);
            this.mtxLocal.rotateZ(fc.Random.default.getRange(0, 359));
            this.mtxLocal.translation = _position;
            this.mtxLocal.translateZ(0.01);
            this.rect = new fc.Rectangle(_position.x, _position.y, _size.x / 4, _size.y / 4, fc.ORIGIN2D.CENTER);
            this.hitBox = new fcaid.Node("Laser", fc.Matrix4x4.IDENTITY());
            this.appendChild(this.hitBox);
            let cmpMaterialred = new fc.ComponentMaterial(this.red);
            this.hitBox.addComponent(new fc.ComponentMesh(this.meshQuad));
            this.hitBox.addComponent(cmpMaterialred);
            this.hitBox.mtxLocal.scaleX(this.rect.size.x);
            this.hitBox.mtxLocal.scaleY(this.rect.size.y);
            this.hitBox.mtxLocal.scaleZ(0);
        }
        update() {
            this.moveEnemy();
            if (this.checkCollision(PHE.avatar, "enemy") && PHE.gameState.health > 0) {
                PHE.gameState.health -= 1;
                // this.mtxLocal.translateX((this.speed * fc.Loop.timeFrameGame / 1000) * -30);
                this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
                this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
            }
        }
        moveEnemy() {
            /*  fc.Time.game.setTimer(5000, 1, (_event: fc.EventTimer) => {
                 this.rotateNow = true;
             }); */
            if (this.vectorAmount(fc.Vector3.DIFFERENCE(PHE.avatar.mtxLocal.translation, this.mtxLocal.translation)) < 5 && this.vectorAmount(fc.Vector3.DIFFERENCE(PHE.avatar.mtxLocal.translation, this.mtxLocal.translation)) > 2) {
                //console.log(this.mtxLocal.rotation.z);
                this.rotateToAvatar();
                this.mtxLocal.translateX(this.speed * fc.Loop.timeFrameGame / 1000);
                this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
                this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
            }
        }
        rotateToAvatar() {
            // Vektor animation
            let vectorA3D = fc.Vector3.DIFFERENCE(PHE.avatar.mtxLocal.translation, this.mtxLocal.translation);
            let vectorA = new fc.Vector3(vectorA3D.x, vectorA3D.y, 0);
            // Vektor normieren:
            // let xCoordNorm: number = (1 / this.vectorAmount(vectorA)) * vectorA.x;
            let yCoordNorm = (1 / this.vectorAmount(vectorA)) * vectorA.y;
            // Winkel berechnen
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