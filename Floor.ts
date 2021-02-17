namespace PHE {
  import fc = FudgeCore;

  export class Floor extends GameObject {

    public constructor(_size: fc.Vector3, _position: fc.Vector3, _material: fc.Material) {
      super("Floor", _size, _position);

      let cmpMaterial: fc.ComponentMaterial = new fc.ComponentMaterial(_material);
      this.addComponent(cmpMaterial);
    }
  }
}
