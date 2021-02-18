namespace PHE {
    import fc = FudgeCore;
    import fcaid = FudgeAid;


    export enum JOB {
        IDLE, PATROL, Hunt
    }

    export class Enemy extends Moveable {

        public speed: number = 3;
        // private animation: fc.Node;

        //private rotateNow: boolean = false;
        private red: fc.Material = new fc.Material("Red", fc.ShaderUniColor, new fc.CoatColored(fc.Color.CSS("RED")));
        private hitBox: fc.Node;
        private meshQuad: fc.MeshQuad = new fc.MeshQuad();




        constructor(_name: string, _size: fc.Vector3, _position: fc.Vector3, _material: fc.Material) {
            super(_name, _size, _position);

            let cmpMaterial: fc.ComponentMaterial = new fc.ComponentMaterial(_material);
            this.addComponent(cmpMaterial);
            this.mtxLocal.rotateZ(fc.Random.default.getRange(0, 359));
            this.mtxLocal.translation = _position;
            this.mtxLocal.translateZ(0.01);

            this.rect = new fc.Rectangle(_position.x, _position.y, _size.x / 4, _size.y / 4, fc.ORIGIN2D.CENTER);


            this.hitBox = new fcaid.Node("Laser", fc.Matrix4x4.IDENTITY());
            this.appendChild(this.hitBox);
            let cmpMaterialred: fc.ComponentMaterial = new fc.ComponentMaterial(this.red);
            this.hitBox.addComponent(new fc.ComponentMesh(this.meshQuad));
            this.hitBox.addComponent(cmpMaterialred);
            this.hitBox.mtxLocal.scaleX(this.rect.size.x);
            this.hitBox.mtxLocal.scaleY(this.rect.size.y);
            this.hitBox.mtxLocal.scaleZ(0);
        }

        public update(): void {
            this.moveEnemy();
            if (this.checkCollision(avatar, "enemy") && gameState.health > 0) {
                gameState.health -= 1;
                // this.mtxLocal.translateX((this.speed * fc.Loop.timeFrameGame / 1000) * -30);
                this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
                this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
            }
        }


        public moveEnemy(): void {

            /*  fc.Time.game.setTimer(5000, 1, (_event: fc.EventTimer) => {
                 this.rotateNow = true;
             }); */

            if (this.vectorAmount(fc.Vector3.DIFFERENCE(avatar.mtxLocal.translation, this.mtxLocal.translation)) < 5 && this.vectorAmount(fc.Vector3.DIFFERENCE(avatar.mtxLocal.translation, this.mtxLocal.translation)) > 2) {
                //console.log(this.mtxLocal.rotation.z);
                this.rotateToAvatar();
                this.mtxLocal.translateX(this.speed * fc.Loop.timeFrameGame / 1000);
                this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
                this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;

            }
        }

        public rotateToAvatar(): void {

            // Vektor animation
            let vectorA3D: fc.Vector3 = fc.Vector3.DIFFERENCE(avatar.mtxLocal.translation, this.mtxLocal.translation);
            let vectorA: fc.Vector3 = new fc.Vector3(vectorA3D.x, vectorA3D.y, 0);

            // Vektor normieren:
            // let xCoordNorm: number = (1 / this.vectorAmount(vectorA)) * vectorA.x;
            let yCoordNorm: number = (1 / this.vectorAmount(vectorA)) * vectorA.y;

            // Winkel berechnen
            let angle: number;
            angle = Math.acos(yCoordNorm) * 180 / Math.PI;
            angle += 90;

            if (this.mtxLocal.translation.x < avatar.mtxLocal.translation.x) {
                angle = 180 - angle;
            }

            this.mtxLocal.rotateZ(this.mtxLocal.rotation.z * -1);
            this.mtxLocal.rotateZ(angle);
        }

        public vectorAmount(_vector: fc.Vector3): number {
            return Math.sqrt(Math.pow(_vector.x, 2) + Math.pow(_vector.y, 2) + Math.pow(_vector.z, 2));
        }
    }
}