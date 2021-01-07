"use strict";
var PHE;
(function (PHE) {
    var fc = FudgeCore;
    class Avatar extends fc.Node {
        constructor(_name, _position) {
            super(_name);
            this.white = new fc.Material("White", fc.ShaderUniColor, new fc.CoatColored(fc.Color.CSS("WHITE")));
            this.meshQuad = new fc.MeshQuad();
            this.addComponent(new fc.ComponentTransform);
            this.addComponent(new fc.ComponentMaterial(this.white));
            this.addComponent(new fc.ComponentMesh(this.meshQuad));
            this.mtxLocal.translation = _position;
            this.getComponent(fc.ComponentMesh).pivot.scale(new fc.Vector3(1, 1, 2));
        }
    }
    PHE.Avatar = Avatar;
})(PHE || (PHE = {}));
//# sourceMappingURL=Avatar.js.map