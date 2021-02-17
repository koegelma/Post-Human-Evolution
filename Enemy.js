"use strict";
var PHE;
(function (PHE) {
    var fc = FudgeCore;
    // import fcaid = FudgeAid;
    let JOB;
    (function (JOB) {
        JOB[JOB["IDLE"] = 0] = "IDLE";
        JOB[JOB["PATROL"] = 1] = "PATROL";
        JOB[JOB["Hunt"] = 2] = "Hunt";
    })(JOB = PHE.JOB || (PHE.JOB = {}));
    class Enemy extends PHE.Moveable {
        constructor(_name, _size, _position, _material) {
            super(_name, _size, _position);
            // private animation: fc.Node;
            this.speed = 3;
            let cmpMaterial = new fc.ComponentMaterial(_material);
            this.addComponent(cmpMaterial);
            this.mtxLocal.rotateZ(fc.Random.default.getRange(0, 359));
            this.mtxLocal.translation = _position;
            this.mtxLocal.translateZ(0.01);
        }
        moveEnemy() {
            if (this.vectorAmount(fc.Vector3.DIFFERENCE(PHE.avatar.mtxLocal.translation, this.mtxLocal.translation)) < 5 && this.vectorAmount(fc.Vector3.DIFFERENCE(PHE.avatar.mtxLocal.translation, this.mtxLocal.translation)) > 1) {
                //console.log(this.mtxLocal.rotation.z);
                this.rotateToAvatar();
                this.mtxLocal.translateX(this.speed * fc.Loop.timeFrameGame / 1000);
                this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
                this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
            }
        }
        rotateToAvatar() {
            // Vektor a
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
            //console.log("Avatar x: " + avatar.mtxLocal.translation.x + " \n\n Enemy x: " + this.mtxLocal.translation.x);
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