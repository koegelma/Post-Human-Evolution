"use strict";
var PHE;
(function (PHE) {
    var fc = FudgeCore;
    var fcaid = FudgeAid;
    class Avatar extends fc.Node {
        constructor(_name, _position) {
            super(_name);
            this.white = fc.Color.CSS("white");
            this.meshQuad = new fc.MeshQuad();
            this.txtAvatar = new fc.TextureImage("../Assets/survivor-move_handgun_0.png");
            this.mtrAvatar = new fc.Material("MaterialAvatar", fc.ShaderTexture, new fc.CoatTextured(this.white, this.txtAvatar));
            this.usedDash = false;
            this.addComponent(new fc.ComponentTransform);
            this.animation = new fcaid.Node("Show", fc.Matrix4x4.IDENTITY());
            this.appendChild(this.animation);
            this.animation.addComponent(new fc.ComponentMaterial(this.mtrAvatar));
            this.animation.addComponent(new fc.ComponentMesh(this.meshQuad));
            this.mtxLocal.translation = _position;
            this.vectorAnim = new fc.Vector3(1, 0, 0);
            //this.vecAnim = this.animation.mtxLocal.getX();
            /*  this.addComponent(new fc.ComponentMaterial(this.mtrAvatar));
             this.addComponent(new fc.ComponentMesh(this.meshQuad)); */
            //this.getComponent(fc.ComponentMesh).pivot.scale(new fc.Vector3(1, 1, 2));
        }
        move(_translationY, _translationX, _dash, _rotation) {
            let speedX = _translationX * 0.08;
            let speedY = _translationY * 0.08;
            if (_dash == 1 && !this.usedDash) {
                let dashSpeed = 25;
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
            this.animation.mtxLocal.rotateZ(_rotation);
        }
        rotateTo(_mousePos) {
            let newMousePos = fc.Vector3.DIFFERENCE(_mousePos, this.mtxLocal.translation);
            let xVector = new fc.Vector3(1, 0, 0);
            let lookVector = this.rotateVector(xVector, this.animation.mtxLocal.rotation.z);
            //console.log(this.animation.mtxLocal.rotation.z);
            let angleA = this.calcAngleBetweenVectors(lookVector, xVector);
            let angleB = this.calcAngleBetweenVectors(newMousePos, xVector);
            let angleRotation = this.calcAngleBetweenVectors(newMousePos, this.vectorAnim);
            // console.log("Angle: " + angleRotation);
            if (this.animation.mtxLocal.rotation.z <= 0) {
                if (angleA > angleB) {
                    angleRotation = angleRotation;
                }
                else if (angleA <= angleB) {
                    angleRotation *= -1;
                }
            }
            else if (this.animation.mtxLocal.rotation.z > 0) {
                if (angleA > angleB) {
                    angleRotation *= -1;
                }
                else if (angleA <= angleB) {
                    angleRotation = angleRotation;
                }
            }
            PHE.controlRotation.setInput(angleRotation);
            this.vectorAnim = newMousePos;
        }
        calcAngleBetweenVectors(_vector1, _vector2) {
            let angle;
            angle = fc.Vector3.DOT(_vector1, _vector2) / (this.vectorAmount(_vector1) * this.vectorAmount(_vector2));
            angle = Math.acos(angle) * 180 / Math.PI;
            return angle;
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
        vectorAmount(_vector) {
            return Math.sqrt(Math.pow(_vector.x, 2) + Math.pow(_vector.y, 2) + Math.pow(_vector.z, 2));
        }
    }
    PHE.Avatar = Avatar;
})(PHE || (PHE = {}));
//# sourceMappingURL=Avatar.js.map