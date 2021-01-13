"use strict";
var PHE;
(function (PHE) {
    var fc = FudgeCore;
    class Avatar extends fc.Node {
        constructor(_name, _position) {
            super(_name);
            this.white = fc.Color.CSS("white");
            this.meshQuad = new fc.MeshQuad();
            this.txtAvatar = new fc.TextureImage("../Assets/survivor-move_handgun_0.png");
            this.mtrAvatar = new fc.Material("MaterialAvatar", fc.ShaderTexture, new fc.CoatTextured(this.white, this.txtAvatar));
            this.addComponent(new fc.ComponentTransform);
            this.addComponent(new fc.ComponentMaterial(this.mtrAvatar));
            this.addComponent(new fc.ComponentMesh(this.meshQuad));
            this.mtxLocal.translation = _position;
            this.getComponent(fc.ComponentMesh).pivot.scale(new fc.Vector3(1, 1, 2));
        }
    }
    PHE.Avatar = Avatar;
})(PHE || (PHE = {}));
//# sourceMappingURL=Avatar.js.map