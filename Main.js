"use strict";
var PHE;
(function (PHE) {
    var fc = FudgeCore;
    //import fcaid = FudgeAid;
    window.addEventListener("load", hndLoad);
    let avatar;
    let walls;
    let floor;
    //let meshQuad: fc.MeshQuad = new fc.MeshQuad();
    let white = new fc.Material("White", fc.ShaderUniColor, new fc.CoatColored(fc.Color.CSS("WHITE")));
    //let black: fc.Material = new fc.Material("Black", fc.ShaderUniColor, new fc.CoatColored(fc.Color.CSS("BLACK")));
    //let grey: fc.Material = new fc.Material("Grey", fc.ShaderUniColor, new fc.CoatColored(fc.Color.CSS("DarkGrey")));
    let controlVertical = new fc.Control("AvatarControlVertical", 1, 0 /* PROPORTIONAL */);
    controlVertical.setDelay(80);
    let controlHorizontal = new fc.Control("AvatarControlHorizontal", 1, 0 /* PROPORTIONAL */);
    controlHorizontal.setDelay(80);
    PHE.controlRotation = new fc.Control("AvatarControlRotation", 1, 0 /* PROPORTIONAL */);
    PHE.controlRotation.setDelay(80);
    let controlDash = new fc.Control("AvatarControlDash", 1, 0 /* PROPORTIONAL */);
    //export let controlRotation: fc.Control = new fc.Control("RotationAngle", 1, fc.CONTROL_TYPE.PROPORTIONAL);
    function hndLoad(_event) {
        const canvas = document.querySelector("canvas");
        PHE.root = new fc.Node("Root");
        PHE.root.addComponent(new fc.ComponentTransform());
        PHE.level = new fc.Node("Level");
        PHE.root.appendChild(PHE.level);
        //Floor
        floor = createFloor();
        PHE.level.appendChild(floor);
        // Avatar
        avatar = new PHE.Avatar("Avatar", fc.Vector2.ZERO(), new fc.Vector3(0, 0, 0));
        PHE.root.appendChild(avatar);
        // Walls
        walls = createWalls();
        PHE.level.appendChild(walls);
        // Setup Camera
        let cmpCamera = new fc.ComponentCamera();
        cmpCamera.pivot.translateZ(18);
        cmpCamera.pivot.rotateY(180);
        cmpCamera.backgroundColor = fc.Color.CSS("black");
        avatar.addComponent(cmpCamera);
        // Setup Viewport
        PHE.viewport = new fc.Viewport();
        PHE.viewport.initialize("Viewport", PHE.root, cmpCamera, canvas);
        // EventListener
        // canvas.addEventListener("mousemove", hndMouse);
        fc.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, hndLoop);
        fc.Loop.start(fc.LOOP_MODE.TIME_GAME, 60);
    }
    function hndLoop(_event) {
        setControlInput();
        avatar.move(controlVertical.getOutput(), controlHorizontal.getOutput(), controlDash.getOutput(), PHE.controlRotation.getOutput());
        //controlRotation.setInput(0);
        hndAvatar();
        PHE.viewport.draw();
    }
    function setControlInput() {
        controlVertical.setInput(fc.Keyboard.mapToValue(1, 0, [fc.KEYBOARD_CODE.W])
            + fc.Keyboard.mapToValue(-1, 0, [fc.KEYBOARD_CODE.S]));
        controlHorizontal.setInput(fc.Keyboard.mapToValue(-1, 0, [fc.KEYBOARD_CODE.A])
            + fc.Keyboard.mapToValue(1, 0, [fc.KEYBOARD_CODE.D]));
        controlDash.setInput(fc.Keyboard.mapToValue(1, 0, [fc.KEYBOARD_CODE.SHIFT_LEFT]));
        PHE.controlRotation.setInput(fc.Keyboard.mapToValue(1, 0, [fc.KEYBOARD_CODE.ARROW_LEFT])
            + fc.Keyboard.mapToValue(-1, 0, [fc.KEYBOARD_CODE.ARROW_RIGHT]));
    }
    /* function hndMouse(_event: MouseEvent): void {
        let mousePosClient: fc.Vector2 = new fc.Vector2(_event.clientX, _event.clientY);
        let mousePos3DClient: fc.Vector3 = new fc.Vector3(_event.clientX, _event.clientY, 0);
        //console.log("X: " + _event.clientX + "\nY: " + _event.clientY);

        let normal: fc.Vector3 = floor.mtxWorld.getZ();
        //let normal: fc.Vector3 = new fc.Vector3(0, 0, 1);
        let mousePosWorld: fc.Vector3 = viewport.getRayFromClient(mousePosClient).intersectPlane(mousePos3DClient, normal);

        avatar.rotateTo(mousePosWorld);

    } */
    function hndAvatar() {
        let tempPos = avatar.mtxLocal.translation;
        let collisionsWall = avatar.hndCollision();
        if (collisionsWall) {
            tempPos.x += collisionsWall.mtxLocal.getY().y * 0.05;
            tempPos.y += collisionsWall.mtxLocal.getY().y * 0.05;
            avatar.mtxLocal.translation = tempPos;
            console.log("Hit");
        }
    }
    function createWalls() {
        let walls = new fc.Node("Walls");
        //walls.appendChild(new Wall(new fc.Vector2(0.5, 20.5), new fc.Vector3(-18, 0, 0), white));
        for (let i = 0; i < 21; i += 0.5) {
            walls.appendChild(new PHE.Wall(new fc.Vector2(0.5, i), new fc.Vector3(-18, 0, 0), white));
            walls.appendChild(new PHE.Wall(new fc.Vector2(0.5, i), new fc.Vector3(18, 0, 0), white));
        }
        for (let i = 0; i < 36; i += 0.5) {
            walls.appendChild(new PHE.Wall(new fc.Vector2(i, 0.5), new fc.Vector3(0, 10, 0), white));
            walls.appendChild(new PHE.Wall(new fc.Vector2(i, 0.5), new fc.Vector3(0, -10, 0), white));
        }
        return walls;
    }
    function createFloor() {
        let floor = new fc.Node("Floor");
        let txtFloor = new fc.TextureImage("../Assets/floor.png");
        let mtrFloor = new fc.Material("MaterialAvatar", fc.ShaderTexture, new fc.CoatTextured(fc.Color.CSS("WHITE"), txtFloor));
        for (let y = -9; y < 10; y++) {
            for (let x = -17; x < 18; x++) {
                floor.appendChild(new PHE.Floor(new fc.Vector2(2, 2), new fc.Vector3(x, y, -0.00009), mtrFloor));
            }
        }
        return floor;
    }
})(PHE || (PHE = {}));
// TODO
// - Bounce / Collision GameObject
// - Sprites
// - Enemies (State Machine)
// - Dash verbessern
// - Shooting
// - Level Builder
// - Items
//# sourceMappingURL=Main.js.map