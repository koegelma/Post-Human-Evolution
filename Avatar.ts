namespace PHE {
    import fc = FudgeCore;
    import fcaid = FudgeAid;

    export class Avatar extends fc.Node {

        private white: fc.Color = fc.Color.CSS("white");
        private meshQuad: fc.MeshQuad = new fc.MeshQuad();
        private txtAvatar: fc.TextureImage = new fc.TextureImage("../Assets/survivor-move_handgun_0.png");
        private mtrAvatar: fc.Material = new fc.Material("MaterialAvatar", fc.ShaderTexture, new fc.CoatTextured(this.white, this.txtAvatar));
        private animation: fc.Node;
        private usedDash: boolean = false;
        private vectorAnim: fc.Vector3;



        public constructor(_name: string, _position: fc.Vector3) {
            super(_name);
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

        public move(_translationY: number, _translationX: number, _dash: number, _rotation: number): void {
            let speedX: number = _translationX * 0.08;
            let speedY: number = _translationY * 0.08;

            if (_dash == 1 && !this.usedDash) {
                let dashSpeed: number = 25;
                speedX *= dashSpeed;
                speedY *= dashSpeed;
                this.usedDash = true;
                console.log("Dash was just used");
                fc.Time.game.setTimer(2000, 1, (_event: fc.EventTimer) => {
                    this.usedDash = false;
                    console.log("Dash can be used again");
                });
            } else {
                speedX *= 1;
                speedY *= 1;
            }

            this.mtxLocal.translateX(speedX);
            this.mtxLocal.translateY(speedY);
            this.animation.mtxLocal.rotateZ(_rotation);
        }

        public rotateTo(_mousePos: fc.Vector3): void {

            let newMousePos: fc.Vector3 = fc.Vector3.DIFFERENCE(_mousePos, this.mtxLocal.translation);

            let xVector: fc.Vector3 = new fc.Vector3(1, 0, 0);

            let lookVector: fc.Vector3 = this.rotateVector(xVector, this.animation.mtxLocal.rotation.z);

            //console.log(this.animation.mtxLocal.rotation.z);

            let angleA: number = this.calcAngleBetweenVectors(lookVector, xVector);
            let angleB: number = this.calcAngleBetweenVectors(newMousePos, xVector);

            let angleRotation: number = this.calcAngleBetweenVectors(newMousePos, this.vectorAnim);

            // console.log("Angle: " + angleRotation);

            if (this.animation.mtxLocal.rotation.z <= 0) {
                if (angleA > angleB) {
                    angleRotation = angleRotation;
                } else if (angleA <= angleB) {
                    angleRotation *= -1;
                }
            } else if (this.animation.mtxLocal.rotation.z > 0) {
                if (angleA > angleB) {
                    angleRotation *= -1;
                } else if (angleA <= angleB) {
                    angleRotation = angleRotation;
                }
            }
            controlRotation.setInput(angleRotation);
            this.vectorAnim = newMousePos;
        }


        private calcAngleBetweenVectors(_vector1: fc.Vector3, _vector2: fc.Vector3): number {
            let angle: number;

            angle = fc.Vector3.DOT(_vector1, _vector2) / (this.vectorAmount(_vector1) * this.vectorAmount(_vector2));
            angle = Math.acos(angle) * 180 / Math.PI;

            return angle;
        }

        private rotateVector(_vector: fc.Vector3, _angle: number): fc.Vector3 {

            let _rotatedVector: fc.Vector3 = new fc.Vector3;
            let xCoord: number;
            let yCoord: number;

            let cosAngle: number = Math.cos(_angle * Math.PI / 180);
            let sinAngle: number = Math.sin(_angle * Math.PI / 180);

            xCoord = (_vector.x * cosAngle) - (_vector.y * sinAngle);
            yCoord = (_vector.x * sinAngle) + (_vector.y * cosAngle);

            _rotatedVector = new fc.Vector3(xCoord, yCoord, 0);

            return _rotatedVector;
        }

        private vectorAmount(_vector: fc.Vector3): number {
            return Math.sqrt(Math.pow(_vector.x, 2) + Math.pow(_vector.y, 2) + Math.pow(_vector.z, 2));
        }
    }
}