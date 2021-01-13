namespace PHE {
    import fc = FudgeCore;

    export class Bullet extends GameObject {

        public speed: number = 15;
        public velocity: fc.Vector3 = fc.Vector3.ZERO();

        public constructor(_name: string, _size: fc.Vector2, _position: fc.Vector3) {
            super("Bullet", _size, _position);

            this.velocity = new fc.Vector3(fc.Random.default.getRange(-1, 1), fc.Random.default.getRange(-1, 1), 0);
            this.velocity.normalize(this.speed);
        }


       /*  public move(): void {
            let frameTime: number = fc.Loop.timeFrameGame / 1000;

            let distance: fc.Vector3 = fc.Vector3.SCALE(this.velocity, frameTime);
            this.translate(distance);
        }

        public translate(_distance: fc.Vector3): void {
            this.mtxLocal.translate(_distance);
            this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
            this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
        } */

    }
}