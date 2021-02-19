namespace PHE {
    import fc = FudgeCore;


    enum Axis {
        XAXIS, YAXIS
    }
    export class Moveable extends GameObject {

        public velocity: fc.Vector3 = fc.Vector3.ZERO();

        public constructor(_name: string, _size: fc.Vector3, _position: fc.Vector3) {
            super(_name, _size, _position);
            this.velocity = fc.Vector3.ZERO();
        }

        public move(): void {
            let frameTime: number = fc.Loop.timeFrameGame / 1000;
            let distance: fc.Vector3 = fc.Vector3.SCALE(this.velocity, frameTime);
            this.translate(distance);
        }

        public translate(_distance: fc.Vector3): void {
            this.mtxLocal.translate(_distance);
            this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
            this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
        }

        public checkCollision(_target: GameObject, _name: string): boolean {
            let intersection: fc.Rectangle = this.rect.getIntersection(_target.rect);
            if (intersection == null)
                return false;

            if (_name === "avatar") {
                if (intersection.size.x < intersection.size.y) {
                    this.hndCollisionAvatar(_target, Axis.XAXIS);
                } else {
                    this.hndCollisionAvatar(_target, Axis.YAXIS);
                }
            }
            return true;
        }

        private hndCollisionAvatar(_target: GameObject, _axis: Axis): void {
            let buffer: number = 0.5;

            if (_axis == Axis.XAXIS) {
                if (this.mtxLocal.translation.x < _target.mtxLocal.translation.x) {
                        this.velocity.x = 0;
                        this.mtxLocal.translation = new fc.Vector3(_target.mtxLocal.translation.x - buffer * (this.getComponent(fc.ComponentMesh).pivot.scaling.x + _target.getComponent(fc.ComponentMesh).pivot.scaling.x), this.mtxLocal.translation.y, 0);
                }
                else {
                        this.velocity.x = 0;
                        this.mtxLocal.translation = new fc.Vector3(_target.mtxLocal.translation.x + buffer * (this.getComponent(fc.ComponentMesh).pivot.scaling.x + _target.getComponent(fc.ComponentMesh).pivot.scaling.x), this.mtxLocal.translation.y, 0);
                }
            } else if (_axis == Axis.YAXIS) {
                if (this.mtxLocal.translation.y > _target.mtxLocal.translation.y) {
                        this.velocity.y = 0;
                        this.mtxLocal.translation = new fc.Vector3(this.mtxLocal.translation.x, _target.mtxLocal.translation.y + buffer * (this.getComponent(fc.ComponentMesh).pivot.scaling.y + _target.getComponent(fc.ComponentMesh).pivot.scaling.y), 0);
                } else {

                        this.velocity.y = 0;
                        this.mtxLocal.translation = new fc.Vector3(this.mtxLocal.translation.x, _target.mtxLocal.translation.y - buffer * (this.getComponent(fc.ComponentMesh).pivot.scaling.y + _target.getComponent(fc.ComponentMesh).pivot.scaling.y), 0);
                }
            }

        }
    }
}