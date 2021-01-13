"use strict";
var PHE;
(function (PHE) {
    var fc = FudgeCore;
    //import fcaid = FudgeAid;
    window.addEventListener("load", hndLoad);
    //const canvas: HTMLCanvasElement = document.querySelector("canvas");
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
    let controlRotation = new fc.Control("AvatarRotation", -0.1, 0 /* PROPORTIONAL */);
    //controlRotation.setDelay(80);
    /*     let xWidth: fc.Control = new fc.Control("CanvasWidth", 1, fc.CONTROL_TYPE.PROPORTIONAL);
        let yHeight: fc.Control = new fc.Control("CanvasWidth", 1, fc.CONTROL_TYPE.PROPORTIONAL); */
    let usedDash = false;
    function hndLoad(_event) {
        const canvas = document.querySelector("canvas");
        /* xWidth.setInput(canvas.width / 2);
        yHeight.setInput(canvas.height / 2); */
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
        //avatar.addComponent(cmpCamera);
        // Setup Viewport
        PHE.viewport = new fc.Viewport();
        PHE.viewport.initialize("Viewport", root, cmpCamera, canvas);
        // EventListener
        canvas.addEventListener("mousemove", hndMouse);
        fc.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, hndLoop);
        fc.Loop.start(fc.LOOP_MODE.TIME_GAME, 60);
    }
    function hndLoop(_event) {
        moveAvatar(controlVertical.getOutput(), controlHorizontal.getOutput(), controlDash.getOutput(), controlRotation.getOutput());
        controlRotation.setInput(0);
        PHE.viewport.draw();
    }
    function hndMouse(_event) {
        //console.log(_event.clientX, _event.clientY);
        let mousePos = new fc.Vector2(_event.clientX, _event.clientY);
        let mousePos3D = new fc.Vector3(_event.clientX, _event.clientY, 0);
        let normal = floor.mtxWorld.getZ();
        let intersect = PHE.viewport.getRayFromClient(mousePos).intersectPlane(mousePos3D, normal);
        //console.log(intersect.x, intersect.y, intersect.z);
        let vecAnim = new fc.Vector3(1, 0, 0);
        let angle = fc.Vector3.DOT(intersect, vecAnim) / (vectorAmount(intersect) * vectorAmount(vecAnim));
        angle = Math.acos(angle) * 180 / Math.PI;
        console.log(angle);
        controlRotation.setInput(angle);
    }
    function vectorAmount(_vector) {
        return Math.sqrt(Math.pow(_vector.x, 2) + Math.pow(_vector.y, 2) + Math.pow(_vector.z, 2));
    }
    function moveAvatar(_translationY, _translationX, _dash, _rotation) {
        controlVertical.setInput(fc.Keyboard.mapToValue(1, 0, [fc.KEYBOARD_CODE.W, fc.KEYBOARD_CODE.ARROW_LEFT])
            + fc.Keyboard.mapToValue(-1, 0, [fc.KEYBOARD_CODE.S, fc.KEYBOARD_CODE.ARROW_RIGHT]));
        controlHorizontal.setInput(fc.Keyboard.mapToValue(-1, 0, [fc.KEYBOARD_CODE.A, fc.KEYBOARD_CODE.ARROW_LEFT])
            + fc.Keyboard.mapToValue(1, 0, [fc.KEYBOARD_CODE.D, fc.KEYBOARD_CODE.ARROW_RIGHT]));
        controlDash.setInput(fc.Keyboard.mapToValue(1, 0, [fc.KEYBOARD_CODE.SHIFT_LEFT, fc.KEYBOARD_CODE.SPACE]));
        let speedX = _translationX * 0.08;
        let speedY = _translationY * 0.08;
        if (_dash == 1 && !usedDash) {
            let dashSpeed = 25;
            speedX *= dashSpeed;
            speedY *= dashSpeed;
            usedDash = true;
            console.log("Dash was just used");
            fc.Time.game.setTimer(2000, 1, (_event) => {
                usedDash = false;
                console.log("Dash can be used again");
            });
        }
        else {
            speedX *= 1;
            speedY *= 1;
        }
        avatar.mtxLocal.translateX(speedX);
        avatar.mtxLocal.translateY(speedY);
        avatar.mtxLocal.rotateZ(_rotation);
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