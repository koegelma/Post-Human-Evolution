namespace PHE {
  import fc = FudgeCore;

  export class GameObject extends fc.Node {

    private static readonly meshQuad: fc.MeshSprite = new fc.MeshSprite();
    //public mtxPivot: fc.Matrix4x4;
    public rect: fc.Rectangle;

    public constructor(_name: string, _size: fc.Vector3, _position: fc.Vector3) {
      super(_name);
      this.addComponent(new fc.ComponentTransform(fc.Matrix4x4.TRANSLATION(_position)));
      this.rect = new fc.Rectangle(_position.x, _position.y, _size.x, _size.y, fc.ORIGIN2D.CENTER);
      let cmpQuad: fc.ComponentMesh = new fc.ComponentMesh(GameObject.meshQuad);
      this.addComponent(cmpQuad);
      cmpQuad.pivot.scale(_size);
      this.mtxLocal.translation = _position;
      //this.mtxPivot = this.getComponent(fc.ComponentMesh).pivot;
    }
  }
}