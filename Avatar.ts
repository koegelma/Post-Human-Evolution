namespace PHE {
    import fc = FudgeCore;

    export class Avatar extends fc.Node {

        private white: fc.Color = fc.Color.CSS("white");
        private meshQuad: fc.MeshQuad = new fc.MeshQuad();

        private txtAvatar: fc.TextureImage = new fc.TextureImage("../Assets/survivor-move_handgun_0.png");
        private mtrAvatar: fc.Material = new fc.Material("MaterialAvatar", fc.ShaderTexture, new fc.CoatTextured(this.white, this.txtAvatar));

        public constructor(_name: string, _position: fc.Vector3) {
        super(_name);
        this.addComponent(new fc.ComponentTransform);
        this.addComponent(new fc.ComponentMaterial(this.mtrAvatar));
        this.addComponent(new fc.ComponentMesh(this.meshQuad));
        this.mtxLocal.translation = _position;
        this.getComponent(fc.ComponentMesh).pivot.scale(new fc.Vector3(1, 1, 2));
    }
}
}