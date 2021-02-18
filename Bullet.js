"use strict";
var PHE;
(function (PHE) {
    var fc = FudgeCore;
    class Bullet extends PHE.Moveable {
        constructor(_name, _size, _position) {
            super("Bullet", _size, _position);
            //public speed: number = 5;
            this.velocity = fc.Vector3.ZERO();
            this.grey = new fc.Material("Grey", fc.ShaderUniColor, new fc.CoatColored(fc.Color.CSS("GREY")));
            //this.velocity = new fc.Vector3(fc.Random.default.getRange(-1, 1), fc.Random.default.getRange(-1, 1), 1);
            //this.velocity.normalize(this.speed);
            let cmpMaterial = new fc.ComponentMaterial(this.grey);
            this.addComponent(cmpMaterial);
        }
        shoot(_velocity) {
            this.velocity = _velocity;
            //let distance: fc.Vector3 = fc.Vector3.SCALE(this.velocity, this.speed);
            //this.translate(distance);
            //this.mtxLocal.translateX(this.speed * fc.Loop.timeFrameGame / 1000);
            for (let speed = 1; speed <= 1.05; speed += 0.01) {
                let distance = fc.Vector3.SCALE(this.velocity, speed);
                this.translate(distance);
                for (let enemy of PHE.enemies.getChildren()) {
                    if (this.checkCollision(enemy, null)) {
                        PHE.enemies.removeChild(enemy);
                        PHE.level.removeChild(PHE.bullet);
                        PHE.gameState.score += 50;
                        return true;
                    }
                }
            }
            PHE.level.removeChild(PHE.bullet);
            return false;
        }
        translate(_distance) {
            this.mtxLocal.translate(_distance);
            this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
            this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
        }
    }
    PHE.Bullet = Bullet;
})(PHE || (PHE = {}));
//# sourceMappingURL=Bullet.js.map