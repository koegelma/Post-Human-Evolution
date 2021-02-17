namespace PHE {
    import fc = FudgeCore;
    import fcaid = FudgeAid;

    export class Avatar extends Moveable {

        // public rect: fc.Rectangle;

        private white: fc.Color = fc.Color.CSS("white");
        private meshQuad: fc.MeshQuad = new fc.MeshQuad();
        private txtAvatar: fc.TextureImage = new fc.TextureImage("../Assets/survivor-move_handgun_0.png");
        private mtrAvatar: fc.Material = new fc.Material("MaterialAvatar", fc.ShaderTexture, new fc.CoatTextured(this.white, this.txtAvatar));
        private animation: fc.Node;
        private usedDash: boolean = false;



        public constructor(_name: string, _size: fc.Vector3, _position: fc.Vector3) {
            super(_name, _size, _position);
            this.animation = new fcaid.Node("Animation", fc.Matrix4x4.IDENTITY());
            this.appendChild(this.animation);
            this.animation.addComponent(new fc.ComponentMaterial(this.mtrAvatar));
            this.animation.addComponent(new fc.ComponentMesh(this.meshQuad));
            this.animation.mtxLocal.translateZ(0.01);
            this.mtxLocal.translation = _position;

            //this.rect = new fc.Rectangle(_position.x, _position.y, _size.x, _size.y, fc.ORIGIN2D.CENTER);
        }

        public moveAvatar(_translationY: number, _translationX: number, _dash: number, _rotation: number): void {
            let speedX: number = _translationX * 0.08;
            let speedY: number = _translationY * 0.08;

            let rotation: number = _rotation * 4.5;

            if (_dash == 1 && !this.usedDash) {
                let dashSpeed: number = 15;
                speedX *= dashSpeed;
                speedY *= dashSpeed;
                this.usedDash = true;
                console.log("Dash was just used");
                fc.Time.game.setTimer(2000, 1, (_event: fc.EventTimer) => {
                    this.usedDash = false;
                    console.log("Dash can be used again");
                });
            } else {
                speedX *= 1;
                speedY *= 1;
            }
            this.mtxLocal.translateX(speedX);
            this.mtxLocal.translateY(speedY);
            // this.rect.position.x = this.mtxLocal.translation.x;
            //this.rect.position.y = this.mtxLocal.translation.y;
            this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
            this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
            this.animation.mtxLocal.rotateZ(rotation);
        }

        /* public rotateTo(_mousePos: fc.Vector3): void {
    
            let newMousePos: fc.Vector3 = fc.Vector3.DIFFERENCE(_mousePos, this.mtxLocal.translation);
    
            console.log("_mousePos: " + _mousePos.toString());
    
            console.log("newMousePos: " + newMousePos.toString());
    
            console.log(this.animation.mtxLocal.rotation.z);
    
            //controlRotation.setInput(angleRotation);
    
        } */
    }
}