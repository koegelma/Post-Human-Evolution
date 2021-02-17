namespace PHE {
    import fc = FudgeCore;
    // import fcaid = FudgeAid;


    export enum JOB {
        IDLE, PATROL, Hunt
    }

    export class Enemy extends Moveable {


        // private animation: fc.Node;

        public speed: number = 3;

        constructor(_name: string, _size: fc.Vector3, _position: fc.Vector3, _material: fc.Material) {
            super(_name, _size, _position);

            let cmpMaterial: fc.ComponentMaterial = new fc.ComponentMaterial(_material);
            this.addComponent(cmpMaterial);
            this.mtxLocal.rotateZ(fc.Random.default.getRange(0, 359));
            this.mtxLocal.translation = _position;
            this.mtxLocal.translateZ(0.01);
        }


        public moveEnemy(): void {

            if (this.vectorAmount(fc.Vector3.DIFFERENCE(avatar.mtxLocal.translation, this.mtxLocal.translation)) < 5 && this.vectorAmount(fc.Vector3.DIFFERENCE(avatar.mtxLocal.translation, this.mtxLocal.translation)) > 1) {
                //console.log(this.mtxLocal.rotation.z);
                this.rotateToAvatar();
                this.mtxLocal.translateX(this.speed * fc.Loop.timeFrameGame / 1000);
                this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
                this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
            }

        }

        public rotateToAvatar(): void {

            // Vektor a

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

            //console.log("Avatar x: " + avatar.mtxLocal.translation.x + " \n\n Enemy x: " + this.mtxLocal.translation.x);
            this.mtxLocal.rotateZ(this.mtxLocal.rotation.z * -1);
            this.mtxLocal.rotateZ(angle);
        }

        public vectorAmount(_vector: fc.Vector3): number {
            return Math.sqrt(Math.pow(_vector.x, 2) + Math.pow(_vector.y, 2) + Math.pow(_vector.z, 2));
        }
    }
}