namespace PHE {
    import fc = FudgeCore;
  
    export class Wall extends GameObject {
      
  
      public constructor(_size: fc.Vector2, _position: fc.Vector3, _material: fc.Material) {
        super("Wall", _size, _position);
  
        let cmpMaterial: fc.ComponentMaterial = new fc.ComponentMaterial(_material);
        this.addComponent(cmpMaterial);
        
      }
    }
  }