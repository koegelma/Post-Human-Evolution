namespace PHE {
    import fc = FudgeCore;

    export class Avatar extends fc.Node {
        
        private white: fc.Material = new fc.Material("White", fc.ShaderUniColor, new fc.CoatColored(fc.Color.CSS("WHITE")));
        private meshQuad: fc.MeshQuad = new fc.MeshQuad();

        constructor(_name: string, _position: fc.Vector3) {
            super(_name);
            this.addComponent(new fc.ComponentTransform);
            this.addComponent(new fc.ComponentMaterial(this.white));
            this.addComponent(new fc.ComponentMesh(this.meshQuad));
            this.mtxLocal.translation = _position;
            this.getComponent(fc.ComponentMesh).pivot.scale(new fc.Vector3(1, 1, 2));
        }
    }
}