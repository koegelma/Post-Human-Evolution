"use strict";
var PHE;
(function (PHE) {
    var fc = FudgeCore;
    class GameObject extends fc.Node {
        constructor(_name, _size, _position) {
            super(_name);
            this.addComponent(new fc.ComponentTransform(fc.Matrix4x4.TRANSLATION(_position)));
            //this.mtxLocal.rotation = _rotation;
            let cmpQuad = new fc.ComponentMesh(GameObject.meshQuad);
            this.addComponent(cmpQuad);
            cmpQuad.pivot.scale(_size.toVector3(0));
            this.mtxPivot = this.getComponent(fc.ComponentMesh).pivot;
        }
        hndCollision() {
            let targetRadius = 2;
            for (let walls of PHE.level.getChildrenByName("Walls"))
                for (let wall of walls.getChildren()) {
                    if (wall.detectHit(this.mtxWorld.translation, targetRadius)) {
                        return wall;
                    }
                }
            return null;
        }
        detectHit(_posWith, _radius) {
            let normal = this.mtxWorld.getY();
            let posThis = this.mtxWorld.translation;
            let difference = fc.Vector3.DIFFERENCE(_posWith, posThis);
            let distance = fc.Vector3.DOT(difference, normal);
            if (distance < 0 || distance > _radius) {
                return false;
            }
            let size = this.getComponent(fc.ComponentMesh).pivot.scaling;
            let ray = new fc.Ray(normal, _posWith);
            let intersect = ray.intersectPlane(posThis, normal);
            let localIntersect = fc.Vector3.TRANSFORMATION(intersect, this.mtxWorldInverse, true);
            if (Math.abs(localIntersect.x) - _radius > 0.5 * size.x) {
                return false;
            }
            return true;
        }
    }
    GameObject.meshQuad = new fc.MeshSprite();
    PHE.GameObject = GameObject;
})(PHE || (PHE = {}));
//# sourceMappingURL=GameObject.js.map