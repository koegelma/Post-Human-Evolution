"use strict";
var PHE;
(function (PHE) {
    var fc = FudgeCore;
    //import fcaid = FudgeAid;
    window.addEventListener("load", hndLoad);
    //let meshQuad: fc.MeshQuad = new fc.MeshQuad();
    //let white: fc.Material = new fc.Material("White", fc.ShaderUniColor, new fc.CoatColored(fc.Color.CSS("WHITE")));
    //let black: fc.Material = new fc.Material("Black", fc.ShaderUniColor, new fc.CoatColored(fc.Color.CSS("BLACK")));
    let grey = new fc.Material("Grey", fc.ShaderUniColor, new fc.CoatColored(fc.Color.CSS("DarkGrey")));
    let controlVertical = new fc.Control("AvatarControlVertical", 1, 0 /* PROPORTIONAL */);
    controlVertical.setDelay(80);
    let controlHorizontal = new fc.Control("AvatarControlHorizontal", 1, 0 /* PROPORTIONAL */);
    controlHorizontal.setDelay(80);
    PHE.controlRotation = new fc.Control("AvatarControlRotation", 1, 0 /* PROPORTIONAL */);
    PHE.controlRotation.setDelay(80);
    let controlDash = new fc.Control("AvatarControlDash", 1, 0 /* PROPORTIONAL */);
    //export let crc2: CanvasRenderingContext2D;
    //export let controlRotation: fc.Control = new fc.Control("RotationAngle", 1, fc.CONTROL_TYPE.PROPORTIONAL);
    function hndLoad(_event) {
        const canvas = document.querySelector("canvas");
        PHE.root = new fc.Node("Root");
        PHE.root.addComponent(new fc.ComponentTransform());
        PHE.level = new fc.Node("Level");
        PHE.root.appendChild(PHE.level);
        //Floor
        PHE.floor = createFloor();
        PHE.level.appendChild(PHE.floor);
        // Avatar
        PHE.avatar = new PHE.Avatar("Avatar", new fc.Vector3(1, 1, 2), new fc.Vector3(-15, 0, 0));
        PHE.root.appendChild(PHE.avatar);
        // Walls
        PHE.walls = createWalls();
        PHE.level.appendChild(PHE.walls);
        //Enemy
        PHE.enemies = createEnemies();
        PHE.level.appendChild(PHE.enemies);
        // Setup Camera
        let cmpCamera = new fc.ComponentCamera();
        cmpCamera.pivot.translateZ(18);
        cmpCamera.pivot.rotateY(180);
        cmpCamera.backgroundColor = fc.Color.CSS("black");
        PHE.avatar.addComponent(cmpCamera);
        // Setup Viewport
        PHE.viewport = new fc.Viewport();
        PHE.viewport.initialize("Viewport", PHE.root, cmpCamera, canvas);
        //crc2 = canvas.getContext("2d");
        // EventListener
        //canvas.addEventListener("mousemove", hndMouse);
        fc.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, hndLoop);
        fc.Loop.start(fc.LOOP_MODE.TIME_GAME, 60);
    }
    function hndLoop(_event) {
        setControlInput();
        PHE.avatar.moveAvatar(controlVertical.getOutput(), controlHorizontal.getOutput(), controlDash.getOutput(), PHE.controlRotation.getOutput());
        //controlRotation.setInput(0);
        hndCollision();
        for (let enemy of PHE.enemies.getChildren()) {
            enemy.moveEnemy();
        }
        PHE.viewport.draw();
        // crc2.fillRect(0, 0, 50, 50);
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
    /*  function hndMouse(_event: MouseEvent): void {
         let mousePosClient: fc.Vector2 = new fc.Vector2(_event.clientX, _event.clientY);
         let mousePos3DClient: fc.Vector3 = new fc.Vector3(_event.clientX, _event.clientY, 0);
         console.log("X: " + _event.clientX + "\nY: " + _event.clientY);
 
         let normal: fc.Vector3 = floor.mtxWorld.getZ();
         //let normal: fc.Vector3 = new fc.Vector3(0, 0, 1);
         let mousePosWorld: fc.Vector3 = viewport.getRayFromClient(mousePosClient).intersectPlane(mousePos3DClient, normal);
 
 
 
       //  avatar.rotateTo(mousePosWorld);
 
     } */
    function hndCollision() {
        for (let wall of PHE.walls.getChildren()) {
            PHE.avatar.checkCollision(wall);
        }
    }
    function createWalls() {
        let walls = new fc.Node("Walls");
        //walls.appendChild(new Wall(new fc.Vector2(0.5, 20.5), new fc.Vector3(-18, 0, 0), white));
        for (let i = 0; i < 21; i += 0.5) {
            walls.appendChild(new PHE.Wall(new fc.Vector3(0.5, i, 2), new fc.Vector3(-18, 0, 0), grey));
            walls.appendChild(new PHE.Wall(new fc.Vector3(0.5, i, 2), new fc.Vector3(18, 0, 0), grey));
        }
        for (let i = 0; i < 36; i += 0.5) {
            walls.appendChild(new PHE.Wall(new fc.Vector3(i, 0.5, 2), new fc.Vector3(0, 10, 0), grey));
            walls.appendChild(new PHE.Wall(new fc.Vector3(i, 0.5, 2), new fc.Vector3(0, -10, 0), grey));
        }
        return walls;
    }
    function createFloor() {
        let floor = new fc.Node("Floor");
        let txtFloor = new fc.TextureImage("../Assets/floor.png");
        let mtrFloor = new fc.Material("MaterialAvatar", fc.ShaderTexture, new fc.CoatTextured(fc.Color.CSS("WHITE"), txtFloor));
        for (let y = -9; y < 10; y++) {
            for (let x = -17; x < 18; x++) {
                floor.appendChild(new PHE.Floor(new fc.Vector3(2, 2, 0), new fc.Vector3(x, y, 0), mtrFloor));
            }
        }
        return floor;
    }
    function createEnemies() {
        let enemies = new fc.Node("Enemies");
        let txtZombie2 = new fc.TextureImage("../Assets/Zombie/attack01/attack01_0000.png");
        let mtrZombie2 = new fc.Material("MaterialEnemy", fc.ShaderTexture, new fc.CoatTextured(fc.Color.CSS("WHITE"), txtZombie2));
        enemies.appendChild(new PHE.Enemy("Enemy1", new fc.Vector3(4.5, 4.5, 4.5), new fc.Vector3(fc.Random.default.getRange(-10, 16), fc.Random.default.getRange(-8, 8), 0), mtrZombie2));
        enemies.appendChild(new PHE.Enemy("Enemy2", new fc.Vector3(4.5, 4.5, 4.5), new fc.Vector3(fc.Random.default.getRange(-10, 16), fc.Random.default.getRange(-8, 8), 0), mtrZombie2));
        return enemies;
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