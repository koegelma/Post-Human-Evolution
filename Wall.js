"use strict";
var PHE;
(function (PHE) {
    var fc = FudgeCore;
    class Wall extends PHE.GameObject {
        constructor(_size, _position, _material) {
            super("Wall", _size, _position);
            let cmpMaterial = new fc.ComponentMaterial(_material);
            this.addComponent(cmpMaterial);
        }
    }
    PHE.Wall = Wall;
})(PHE || (PHE = {}));
//# sourceMappingURL=Wall.js.map