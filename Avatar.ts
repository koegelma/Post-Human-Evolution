namespace PHE {
    import fc = FudgeCore;
    import fcaid = FudgeAid;

    export class Avatar extends Moveable {

        // public rect: fc.Rectangle;

        private clrWhite: fc.Color = fc.Color.CSS("white");
        private meshQuad: fc.MeshQuad = new fc.MeshQuad();
        private txtAvatar: fc.TextureImage = new fc.TextureImage("../Assets/Top_Down_Survivor/shotgun/idle/survivor-idle_shotgun_0.png");
        private mtrAvatar: fc.Material = new fc.Material("MaterialAvatar", fc.ShaderTexture, new fc.CoatTextured(this.clrWhite, this.txtAvatar));
        private animation: fc.Node;
        private usedDash: boolean = false;
        private shotReady: boolean = true;
        private red: fc.Material = new fc.Material("Red", fc.ShaderUniColor, new fc.CoatColored(fc.Color.CSS("RED")));

        private lasersight: fc.Node;

        public constructor(_name: string, _size: fc.Vector3, _position: fc.Vector3) {
            super(_name, _size, _position);
            this.animation = new fcaid.Node("Animation", fc.Matrix4x4.IDENTITY());
            this.appendChild(this.animation);
            this.animation.addComponent(new fc.ComponentMaterial(this.mtrAvatar));
            this.animation.addComponent(new fc.ComponentMesh(this.meshQuad));
            this.animation.mtxLocal.translateZ(0.01);
            this.mtxLocal.translation = _position;

            this.lasersight = new fcaid.Node("Laser", fc.Matrix4x4.IDENTITY());
            this.animation.appendChild(this.lasersight);
            let cmpMaterial: fc.ComponentMaterial = new fc.ComponentMaterial(this.red);
            this.lasersight.addComponent(new fc.ComponentMesh(this.meshQuad));
            this.lasersight.addComponent(cmpMaterial);
            this.lasersight.mtxLocal.scale(new fc.Vector3(6, 0.01, 0));
            this.lasersight.mtxLocal.translateX(0.5);
            this.lasersight.mtxLocal.translateY(-24);
        }

        public moveAvatar(_translationY: number, _translationX: number, _dash: number, _rotation: number, _shoot: number, _reload: number): void {

            let speedX: number = _translationX * 0.08;
            let speedY: number = _translationY * 0.08;

            let rotation: number = _rotation * 2;

            if (_dash == 1 && !this.usedDash) {
                let dashSpeed: number = 15;
                speedX *= dashSpeed;
                speedY *= dashSpeed;
                this.usedDash = true;
                console.log("Dash was just used");
                fc.Time.game.setTimer(3000, 1, (_event: fc.EventTimer) => {
                    this.usedDash = false;
                    console.log("Dash can be used again");
                });
            } else {
                speedX *= 1;
                speedY *= 1;
            }

            this.mtxLocal.translateX(speedX);
            this.mtxLocal.translateY(speedY);
            this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
            this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
            this.animation.mtxLocal.rotateZ(rotation);

            if (_shoot == 1 && this.shotReady && gameState.ammo > 0) {
                this.shoot();
                this.shotReady = false;
                fc.Time.game.setTimer(800, 1, (_event: fc.EventTimer) => {
                    this.shotReady = true;
                });
            } else if (_shoot == 1 && this.shotReady && gameState.ammo == 0) {
                cmpAudioEmptyGun.play(true);
            }

            

            if (_reload == 1) {
                gameState.ammo = 15;
                cmpAudioReload.play(true);
            }
        }

        private shoot(): void {

            let shotDirection: fc.Vector3 = this.animation.mtxWorld.getX();

            console.log("Shootdirection: " + shotDirection);

            let bulletPosition: fc.Vector3 = new fc.Vector3(this.mtxWorld.translation.x, this.mtxWorld.translation.y - 0.24, 1);

            bullet = new Bullet("Bullet", new fc.Vector3(0.1, 0.1, 1), bulletPosition);
            level.appendChild(bullet);

            cmpAudioShoot.play(true);

            bullet.shoot(shotDirection);
            gameState.ammo--;
        }

    }
}