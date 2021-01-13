"use strict";
var PHE;
(function (PHE) {
    var fc = FudgeCore;
    class Floor extends PHE.GameObject {
        constructor(_size, _position, _material) {
            super("Floor", _size, _position);
            let cmpMaterial = new fc.ComponentMaterial(_material);
            this.addComponent(cmpMaterial);
        }
    }
    PHE.Floor = Floor;
})(PHE || (PHE = {}));
//# sourceMappingURL=Floor.js.map