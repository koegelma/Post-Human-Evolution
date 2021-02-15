"use strict";
var PHE;
(function (PHE) {
    var fc = FudgeCore;
    //import fcaid = FudgeAid;
    window.addEventListener("load", hndLoad);
    let root;
    let level;
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
    let controlDash = new fc.Control("AvatarControlDash", 1, 0 /* PROPORTIONAL */);
    PHE.controlRotation = new fc.Control("RotationAngle", 1, 0 /* PROPORTIONAL */);
    function hndLoad(_event) {
        const canvas = document.querySelector("canvas");
        root = new fc.Node("Root");
        root.addComponent(new fc.ComponentTransform());
        level = new fc.Node("Level");
        root.appendChild(level);
        //Floor
        floor = createFloor();
        level.appendChild(floor);
        // Avatar
        avatar = new PHE.Avatar("Avatar", new fc.Vector3(0, 0, 0));
        root.appendChild(avatar);
        // Walls
        walls = createWalls();
        level.appendChild(walls);
        // Setup Camera
        let cmpCamera = new fc.ComponentCamera();
        cmpCamera.pivot.translateZ(18);
        cmpCamera.pivot.rotateY(180);
        cmpCamera.backgroundColor = fc.Color.CSS("black");
        avatar.addComponent(cmpCamera);
        // Setup Viewport
        PHE.viewport = new fc.Viewport();
        PHE.viewport.initialize("Viewport", root, cmpCamera, canvas);
        // EventListener
        canvas.addEventListener("mousemove", hndMouse);
        fc.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, hndLoop);
        fc.Loop.start(fc.LOOP_MODE.TIME_GAME, 120);
    }
    function hndLoop(_event) {
        setControlInput();
        avatar.move(controlVertical.getOutput(), controlHorizontal.getOutput(), controlDash.getOutput(), PHE.controlRotation.getOutput());
        PHE.controlRotation.setInput(0);
        PHE.viewport.draw();
    }
    function setControlInput() {
        controlVertical.setInput(fc.Keyboard.mapToValue(1, 0, [fc.KEYBOARD_CODE.W, fc.KEYBOARD_CODE.ARROW_LEFT])
            + fc.Keyboard.mapToValue(-1, 0, [fc.KEYBOARD_CODE.S, fc.KEYBOARD_CODE.ARROW_RIGHT]));
        controlHorizontal.setInput(fc.Keyboard.mapToValue(-1, 0, [fc.KEYBOARD_CODE.A, fc.KEYBOARD_CODE.ARROW_LEFT])
            + fc.Keyboard.mapToValue(1, 0, [fc.KEYBOARD_CODE.D, fc.KEYBOARD_CODE.ARROW_RIGHT]));
        controlDash.setInput(fc.Keyboard.mapToValue(1, 0, [fc.KEYBOARD_CODE.SHIFT_LEFT, fc.KEYBOARD_CODE.SPACE]));
    }
    function hndMouse(_event) {
        let mousePosClient = new fc.Vector2(_event.clientX, _event.clientY);
        let mousePos3DClient = new fc.Vector3(_event.clientX, _event.clientY, 0);
        //console.log("X: " + _event.clientX + "\nY: " + _event.clientY);
        let normal = floor.mtxWorld.getZ();
        //let normal: fc.Vector3 = new fc.Vector3(0, 0, 1);
        let mousePosWorld = PHE.viewport.getRayFromClient(mousePosClient).intersectPlane(mousePos3DClient, normal);
        avatar.rotateTo(mousePosWorld);
    }
    function createWalls() {
        let walls = new fc.Node("Walls");
        walls.appendChild(new PHE.Wall(new fc.Vector2(0.5, 20.5), new fc.Vector3(-18, 0, 0), white));
        walls.appendChild(new PHE.Wall(new fc.Vector2(0.5, 20.5), new fc.Vector3(18, 0, 0), white));
        walls.appendChild(new PHE.Wall(new fc.Vector2(35.5, 0.5), new fc.Vector3(0, 10, 0), white));
        walls.appendChild(new PHE.Wall(new fc.Vector2(35.5, 0.5), new fc.Vector3(0, -10, 0), white));
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
// - Avatar Klasse und Funktionen auslagern
// - Sprites
// - Dash verbessern
// - Bounce / Collision GameObject
// - Shooting
// - Level Builder
//# sourceMappingURL=Main.js.map