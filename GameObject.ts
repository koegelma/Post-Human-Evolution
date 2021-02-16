namespace PHE {
  import fc = FudgeCore;

  export class GameObject extends fc.Node {

    private static readonly meshQuad: fc.MeshSprite = new fc.MeshSprite();
    public mtxPivot: fc.Matrix4x4;
    public mtxPivotInverse: fc.Matrix4x4;
    public mtxComplete: fc.Matrix4x4;
    public mtxCompleteInverse: fc.Matrix4x4;

    public constructor(_name: string, _size: fc.Vector2, _position: fc.Vector3) {
      super(_name);
      this.addComponent(new fc.ComponentTransform(fc.Matrix4x4.TRANSLATION(_position)));
      //this.mtxLocal.rotation = _rotation;

      let cmpQuad: fc.ComponentMesh = new fc.ComponentMesh(GameObject.meshQuad);
      this.addComponent(cmpQuad);
      cmpQuad.pivot.scale(_size.toVector3(0));

      this.mtxPivot = this.getComponent(fc.ComponentMesh).pivot;
    }

    public hndCollision(): Wall {
      let targetRadius: number = 2;

      for (let walls of level.getChildrenByName("Walls"))
        for (let wall of walls.getChildren() as GameObject[]) {

          if (wall.detectHit(this.mtxWorld.translation, targetRadius)) {
            return wall;

          }

        }
      return null;
    }


    public detectHit(_posWith: fc.Vector3, _radius: number): boolean {

      let normal: fc.Vector3 = this.mtxWorld.getY();
      let posThis: fc.Vector3 = this.mtxWorld.translation;

      let difference: fc.Vector3 = fc.Vector3.DIFFERENCE(_posWith, posThis);
      let distance: number = fc.Vector3.DOT(difference, normal);

      if (distance < 0 || distance > _radius) {
        return false;
      }


      let size: fc.Vector3 = this.getComponent(fc.ComponentMesh).pivot.scaling;
      let ray: fc.Ray = new fc.Ray(normal, _posWith);
      let intersect: fc.Vector3 = ray.intersectPlane(posThis, normal);

      let localIntersect: fc.Vector3 = fc.Vector3.TRANSFORMATION(intersect, this.mtxWorldInverse, true);

      if (Math.abs(localIntersect.x) - _radius > 0.5 * size.x) {
        return false;
      }

      return true;
    }


  }
}