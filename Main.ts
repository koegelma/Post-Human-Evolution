namespace PHE {
    import fc = FudgeCore;
    //import fcaid = FudgeAid;

    window.addEventListener("load", hndLoad);

    export let viewport: fc.Viewport;

    export let root: fc.Node;
    export let level: fc.Node;
    export let avatar: Avatar;
    export let walls: fc.Node;
    export let floor: fc.Node;
    export let enemies: fc.Node;

    //let meshQuad: fc.MeshQuad = new fc.MeshQuad();
    //let white: fc.Material = new fc.Material("White", fc.ShaderUniColor, new fc.CoatColored(fc.Color.CSS("WHITE")));
    //let black: fc.Material = new fc.Material("Black", fc.ShaderUniColor, new fc.CoatColored(fc.Color.CSS("BLACK")));
    let grey: fc.Material = new fc.Material("Grey", fc.ShaderUniColor, new fc.CoatColored(fc.Color.CSS("DarkGrey")));

    let controlVertical: fc.Control = new fc.Control("AvatarControlVertical", 1, fc.CONTROL_TYPE.PROPORTIONAL);
    controlVertical.setDelay(80);

    let controlHorizontal: fc.Control = new fc.Control("AvatarControlHorizontal", 1, fc.CONTROL_TYPE.PROPORTIONAL);
    controlHorizontal.setDelay(80);

    export let controlRotation: fc.Control = new fc.Control("AvatarControlRotation", 1, fc.CONTROL_TYPE.PROPORTIONAL);
    controlRotation.setDelay(80);

    let controlDash: fc.Control = new fc.Control("AvatarControlDash", 1, fc.CONTROL_TYPE.PROPORTIONAL);

    //export let crc2: CanvasRenderingContext2D;

    //export let controlRotation: fc.Control = new fc.Control("RotationAngle", 1, fc.CONTROL_TYPE.PROPORTIONAL);

    function hndLoad(_event: Event): void {

        const canvas: HTMLCanvasElement = document.querySelector("canvas");

        root = new fc.Node("Root");
        root.addComponent(new fc.ComponentTransform());

        level = new fc.Node("Level");
        root.appendChild(level);

        //Floor
        floor = createFloor();
        level.appendChild(floor);

        // Avatar
        avatar = new Avatar("Avatar", new fc.Vector3(1, 1, 2), new fc.Vector3(-15, 0, 0));
        root.appendChild(avatar);

        // Walls
        walls = createWalls();
        level.appendChild(walls);

        //Enemy
        enemies = createEnemies();
        level.appendChild(enemies);


        // Setup Camera
        let cmpCamera: fc.ComponentCamera = new fc.ComponentCamera();
        cmpCamera.pivot.translateZ(18);
        cmpCamera.pivot.rotateY(180);
        cmpCamera.backgroundColor = fc.Color.CSS("black");
        avatar.addComponent(cmpCamera);

        // Setup Viewport
        viewport = new fc.Viewport();
        viewport.initialize("Viewport", root, cmpCamera, canvas);
        //crc2 = canvas.getContext("2d");

        // EventListener
        //canvas.addEventListener("mousemove", hndMouse);
        fc.Loop.addEventListener(fc.EVENT.LOOP_FRAME, hndLoop);
        fc.Loop.start(fc.LOOP_MODE.TIME_GAME, 60);
    }

    function hndLoop(_event: Event): void {
        setControlInput();
        avatar.moveAvatar(controlVertical.getOutput(), controlHorizontal.getOutput(), controlDash.getOutput(), controlRotation.getOutput());
        //controlRotation.setInput(0);

        hndCollision();

        for (let enemy of enemies.getChildren() as Enemy[]) {
            enemy.moveEnemy();
        }



        viewport.draw();

        // crc2.fillRect(0, 0, 50, 50);
    }

    function setControlInput(): void {
        controlVertical.setInput(
            fc.Keyboard.mapToValue(1, 0, [fc.KEYBOARD_CODE.W])
            + fc.Keyboard.mapToValue(-1, 0, [fc.KEYBOARD_CODE.S])
        );
        controlHorizontal.setInput(
            fc.Keyboard.mapToValue(-1, 0, [fc.KEYBOARD_CODE.A])
            + fc.Keyboard.mapToValue(1, 0, [fc.KEYBOARD_CODE.D])
        );
        controlDash.setInput(
            fc.Keyboard.mapToValue(1, 0, [fc.KEYBOARD_CODE.SHIFT_LEFT])
        );
        controlRotation.setInput(
            fc.Keyboard.mapToValue(1, 0, [fc.KEYBOARD_CODE.ARROW_LEFT])
            + fc.Keyboard.mapToValue(-1, 0, [fc.KEYBOARD_CODE.ARROW_RIGHT])
        );
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

    function hndCollision(): void {
        for (let wall of walls.getChildren() as Wall[]) {
            avatar.checkCollision(wall);
        }
    }

    function createWalls(): fc.Node {
        let walls: fc.Node = new fc.Node("Walls");
        //walls.appendChild(new Wall(new fc.Vector2(0.5, 20.5), new fc.Vector3(-18, 0, 0), white));

        for (let i: number = 0; i < 21; i += 0.5) {
            walls.appendChild(new Wall(new fc.Vector3(0.5, i, 2), new fc.Vector3(-18, 0, 0), grey));
            walls.appendChild(new Wall(new fc.Vector3(0.5, i, 2), new fc.Vector3(18, 0, 0), grey));
        }

        for (let i: number = 0; i < 36; i += 0.5) {
            walls.appendChild(new Wall(new fc.Vector3(i, 0.5, 2), new fc.Vector3(0, 10, 0), grey));
            walls.appendChild(new Wall(new fc.Vector3(i, 0.5, 2), new fc.Vector3(0, -10, 0), grey));
        }

        return walls;
    }

    function createFloor(): fc.Node {
        let floor: fc.Node = new fc.Node("Floor");
        let txtFloor: fc.TextureImage = new fc.TextureImage("../Assets/floor.png");
        let mtrFloor: fc.Material = new fc.Material("MaterialAvatar", fc.ShaderTexture, new fc.CoatTextured(fc.Color.CSS("WHITE"), txtFloor));

        for (let y: number = -9; y < 10; y++) {
            for (let x: number = -17; x < 18; x++) {
                floor.appendChild(new Floor(new fc.Vector3(2, 2, 0), new fc.Vector3(x, y, 0), mtrFloor));
            }
        }
        return floor;
    }

    function createEnemies(): fc.Node {
        let enemies: fc.Node = new fc.Node("Enemies");
        let txtZombie2: fc.TextureImage = new fc.TextureImage("../Assets/Zombie/attack01/attack01_0000.png");
        let mtrZombie2: fc.Material = new fc.Material("MaterialEnemy", fc.ShaderTexture, new fc.CoatTextured(fc.Color.CSS("WHITE"), txtZombie2));

        enemies.appendChild(new Enemy("Enemy1", new fc.Vector3(4.5, 4.5, 4.5), new fc.Vector3(fc.Random.default.getRange(-10, 16), fc.Random.default.getRange(-8, 8), 0), mtrZombie2));
        enemies.appendChild(new Enemy("Enemy2", new fc.Vector3(4.5, 4.5, 4.5), new fc.Vector3(fc.Random.default.getRange(-10, 16), fc.Random.default.getRange(-8, 8), 0), mtrZombie2));
        return enemies;
    }


}

// TODO

// - Bounce / Collision GameObject
// - Sprites
// - Enemies (State Machine)
// - Dash verbessern
// - Shooting
// - Level Builder
// - Items

