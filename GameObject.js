"use strict";
var PHE;
(function (PHE) {
    var fc = FudgeCore;
    class GameObject extends fc.Node {
        constructor(_name, _size, _position) {
            super(_name);
            this.addComponent(new fc.ComponentTransform(fc.Matrix4x4.TRANSLATION(_position)));
            this.rect = new fc.Rectangle(_position.x, _position.y, _size.x, _size.y, fc.ORIGIN2D.CENTER);
            let cmpQuad = new fc.ComponentMesh(GameObject.meshQuad);
            this.addComponent(cmpQuad);
            cmpQuad.pivot.scale(_size);
            this.mtxLocal.translation = _position;
            this.mtxPivot = this.getComponent(fc.ComponentMesh).pivot;
        }
    }
    GameObject.meshQuad = new fc.MeshSprite();
    PHE.GameObject = GameObject;
})(PHE || (PHE = {}));
//# sourceMappingURL=GameObject.js.map