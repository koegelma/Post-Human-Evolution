"use strict";
var PHE;
(function (PHE) {
    var fc = FudgeCore;
    class Bullet extends PHE.GameObject {
        constructor(_name, _size, _position) {
            super("Bullet", _size, _position);
            this.speed = 15;
            this.velocity = fc.Vector3.ZERO();
            this.velocity = new fc.Vector3(fc.Random.default.getRange(-1, 1), fc.Random.default.getRange(-1, 1), 0);
            this.velocity.normalize(this.speed);
        }
    }
    PHE.Bullet = Bullet;
})(PHE || (PHE = {}));
//# sourceMappingURL=Bullet.js.map