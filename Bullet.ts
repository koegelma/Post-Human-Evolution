namespace PHE {
    import fc = FudgeCore;

    export class Bullet extends Moveable {

        //public speed: number = 5;
        public velocity: fc.Vector3 = fc.Vector3.ZERO();
        public grey: fc.Material = new fc.Material("Grey", fc.ShaderUniColor, new fc.CoatColored(fc.Color.CSS("GREY")));

        public constructor(_name: string, _size: fc.Vector3, _position: fc.Vector3) {
            super("Bullet", _size, _position);
            //this.velocity = new fc.Vector3(fc.Random.default.getRange(-1, 1), fc.Random.default.getRange(-1, 1), 1);
            //this.velocity.normalize(this.speed);
            let cmpMaterial: fc.ComponentMaterial = new fc.ComponentMaterial(this.grey);
            this.addComponent(cmpMaterial);
        }


        public shoot(_velocity: fc.Vector3): boolean {
            this.velocity = _velocity;
            //let distance: fc.Vector3 = fc.Vector3.SCALE(this.velocity, this.speed);
            //this.translate(distance);

            //this.mtxLocal.translateX(this.speed * fc.Loop.timeFrameGame / 1000);
            for (let speed: number = 1; speed <= 1.05; speed += 0.01) {
                let distance: fc.Vector3 = fc.Vector3.SCALE(this.velocity, speed);
                this.translate(distance);
                for (let enemy of enemies.getChildren() as Enemy[]) {
                    if (this.checkCollision(enemy, null)) {
                        enemies.removeChild(enemy);
                        level.removeChild(bullet);
                        gameState.score += 50;
                        return true;
                    }
                }
            }
            level.removeChild(bullet);
            return false;
        }

        public translate(_distance: fc.Vector3): void {
            this.mtxLocal.translate(_distance);
            this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
            this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
        }

    }
}