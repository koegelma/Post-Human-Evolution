"use strict";
var PHE;
(function (PHE) {
    var fc = FudgeCore;
    window.addEventListener("load", hndLoad);
    let root;
    let level;
    let avatar;
    let walls;
    let floor;
    let meshQuad = new fc.MeshQuad();
    let white = new fc.Material("White", fc.ShaderUniColor, new fc.CoatColored(fc.Color.CSS("WHITE")));
    let black = new fc.Material("Black", fc.ShaderUniColor, new fc.CoatColored(fc.Color.CSS("BLACK")));
    let grey = new fc.Material("Grey", fc.ShaderUniColor, new fc.CoatColored(fc.Color.CSS("DarkGrey")));
    let controlVertical = new fc.Control("AvatarControlVert", 1, 0 /* PROPORTIONAL */);
    controlVertical.setDelay(80);
    let controlHorizontal = new fc.Control("AvatarControlHor", 1, 0 /* PROPORTIONAL */);
    controlHorizontal.setDelay(80);
    let controlDash = new fc.Control("AvatarControlDash", 1, 0 /* PROPORTIONAL */);
    let usedDash = false;
    function hndLoad(_event) {
        const canvas = document.querySelector("canvas");
        root = new fc.Node("Root");
        root.addComponent(new fc.ComponentTransform());
        level = new fc.Node("Level");
        root.appendChild(level);
        // Walls
        walls = createWalls();
        level.appendChild(walls);
        /* //Floor
        let floor: fc.Node = new fc.Node("Floor");
        floor.addComponent(new fc.ComponentTransform);
        floor.addComponent(new fc.ComponentMaterial(grey));
        floor.addComponent(new fc.ComponentMesh(meshQuad));
        floor.cmpTransform.local.translate(new fc.Vector3(0, 0, 0));
        floor.getComponent(fc.ComponentMesh).pivot.scale(new fc.Vector3(55, 35, -10));
        root.appendChild(floor); */
        //root.appendChild(createNode3D("Map", meshQuad, grey, new fc.Vector3(0, -100, 0), new fc.Vector3(55, 35, 1)));
        // Avatar
        /*  avatar = new fc.Node("Avatar");
         avatar.addComponent(new fc.ComponentTransform);
         avatar.addComponent(new fc.ComponentMaterial(white));
         avatar.addComponent(new fc.ComponentMesh(meshQuad));
         avatar.cmpTransform.local.translate(new fc.Vector3(0, 0, 0));
         avatar.getComponent(fc.ComponentMesh).pivot.scale(new fc.Vector3(1, 1, 2)); */
        avatar = new PHE.Avatar("Avatar", new fc.Vector3(0, 0, 0));
        root.appendChild(avatar);
        // Setup Camera
        let cmpCamera = new fc.ComponentCamera();
        cmpCamera.pivot.translateZ(120);
        cmpCamera.pivot.rotateY(180);
        cmpCamera.backgroundColor = fc.Color.CSS("black");
        //avatar.addComponent(cmpCamera);
        // Setup Viewport
        PHE.viewport = new fc.Viewport();
        PHE.viewport.initialize("Viewport", root, cmpCamera, canvas);
        // EventListener
        fc.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, hndLoop);
        fc.Loop.start(fc.LOOP_MODE.TIME_GAME, 120);
    }
    function hndLoop(_event) {
        moveAvatar(controlVertical.getOutput(), controlHorizontal.getOutput(), controlDash.getOutput());
        PHE.viewport.draw();
    }
    function moveAvatar(_translationY, _translationX, _dash) {
        controlVertical.setInput(fc.Keyboard.mapToValue(1, 0, [fc.KEYBOARD_CODE.W, fc.KEYBOARD_CODE.ARROW_LEFT])
            + fc.Keyboard.mapToValue(-1, 0, [fc.KEYBOARD_CODE.S, fc.KEYBOARD_CODE.ARROW_RIGHT]));
        controlHorizontal.setInput(fc.Keyboard.mapToValue(-1, 0, [fc.KEYBOARD_CODE.A, fc.KEYBOARD_CODE.ARROW_LEFT])
            + fc.Keyboard.mapToValue(1, 0, [fc.KEYBOARD_CODE.D, fc.KEYBOARD_CODE.ARROW_RIGHT]));
        controlDash.setInput(fc.Keyboard.mapToValue(1, 0, [fc.KEYBOARD_CODE.SHIFT_LEFT, fc.KEYBOARD_CODE.SPACE]));
        let speedX = _translationX * 0.1;
        let speedY = _translationY * 0.1;
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
    }
    function createWalls() {
        let walls = new fc.Node("Walls");
        walls.appendChild(new PHE.Wall(new fc.Vector2(1, 51), new fc.Vector3(-45, 0, 0), white));
        walls.appendChild(new PHE.Wall(new fc.Vector2(1, 51), new fc.Vector3(45, 0, 0), white));
        walls.appendChild(new PHE.Wall(new fc.Vector2(90, 1), new fc.Vector3(0, 25, 0), white));
        walls.appendChild(new PHE.Wall(new fc.Vector2(90, 1), new fc.Vector3(0, -25, 0), white));
        return walls;
    }
})(PHE || (PHE = {}));
// TODO
// - Avatar Klasse und Funktionen auslagern
// - Sprites
// + Dash Cooldown
// - Dash verbessern
// - Bounce / Collision GameObject
// - Shooting
// - Level Builder
//# sourceMappingURL=Main.js.map