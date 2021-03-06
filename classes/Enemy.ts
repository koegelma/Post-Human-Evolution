///<reference path="GameObject.ts"/>
///<reference path="Moveable.ts"/>

namespace PHE {
    import fc = FudgeCore;
    //import fcaid = FudgeAid;


    export enum JOB {
        IDLE, PATROL, Hunt
    }

    export class Enemy extends Moveable {

        public speed: number = 3;
        // private animation: fc.Node;

        //private rotateNow: boolean = false;
        /*  private red: fc.Material = new fc.Material("Red", fc.ShaderUniColor, new fc.CoatColored(fc.Color.CSS("RED")));
         private hitBox: fc.Node;
         private meshQuad: fc.MeshQuad = new fc.MeshQuad(); */



        constructor(_name: string, _size: fc.Vector3, _position: fc.Vector3, _material: fc.Material) {
            super(_name, _size, _position);

            let cmpMaterial: fc.ComponentMaterial = new fc.ComponentMaterial(_material);
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

        public update(): void {
            this.moveEnemy();
            if (this.checkCollision(avatar, null) && gameState.health > 0) {
                gameState.health -= gameState.enemyDamage;
                this.mtxLocal.translateX(-2);
                this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
                this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;

                let zombieSound: number = Math.round(fc.random.getRange(1, 3));

                switch (zombieSound) {
                    case 1:
                        cmpAudioZombie1.play(true);
                        break;
                    case 2:
                        cmpAudioZombie2.play(true);
                        break;
                    default:
                        cmpAudioZombie1.play(true);
                }
            }
        }

        private moveEnemy(): void {
            // check if avatar is in range, then rotate and move enemy
            if (this.vectorAmount(fc.Vector3.DIFFERENCE(avatar.mtxLocal.translation, this.mtxLocal.translation)) < 10 && this.vectorAmount(fc.Vector3.DIFFERENCE(avatar.mtxLocal.translation, this.mtxLocal.translation)) > 1) {
                this.rotateToAvatar();
                this.mtxLocal.translateX(this.speed * fc.Loop.timeFrameGame / 1000);
                this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
                this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
            }
        }

        private rotateToAvatar(): void {
            // calculate rotation angle via unit circle
            let vectorAnimation: fc.Vector3 = fc.Vector3.DIFFERENCE(avatar.mtxLocal.translation, this.mtxLocal.translation);
            vectorAnimation = new fc.Vector3(vectorAnimation.x, vectorAnimation.y, 0);

            let yCoordNorm: number = (1 / this.vectorAmount(vectorAnimation)) * vectorAnimation.y;

            let angle: number;
            angle = Math.acos(yCoordNorm) * 180 / Math.PI;
            angle += 90;

            if (this.mtxLocal.translation.x < avatar.mtxLocal.translation.x) {
                angle = 180 - angle;
            }

            this.mtxLocal.rotateZ(this.mtxLocal.rotation.z * -1);
            this.mtxLocal.rotateZ(angle);
        }

        private vectorAmount(_vector: fc.Vector3): number {
            return Math.sqrt(Math.pow(_vector.x, 2) + Math.pow(_vector.y, 2) + Math.pow(_vector.z, 2));
        }




    }
}