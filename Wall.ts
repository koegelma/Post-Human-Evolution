namespace PHE {
  import fc = FudgeCore;

  export class Wall extends GameObject {


    public constructor(_size: fc.Vector3, _position: fc.Vector3, _material: fc.Material) {
      super("Wall", _size, _position);

      let cmpMaterial: fc.ComponentMaterial = new fc.ComponentMaterial(_material);
      this.addComponent(cmpMaterial);
      //this.rect = new fc.Rectangle(_position.x, _position.y, _size.x, _size.y, fc.ORIGIN2D.CENTER);
    }
  }
}