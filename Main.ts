namespace PHE {
    import fc = FudgeCore;
    import fcaid = FudgeAid;

    window.addEventListener("load", hndLoad);

    export let viewport: fc.Viewport;

    let root: fc.Node;
    let level: fc.Node;
    let avatar: fc.Node;
    let walls: fc.Node;
    let floor: fc.Node;

    let meshQuad: fc.MeshQuad = new fc.MeshQuad();
    let white: fc.Material = new fc.Material("White", fc.ShaderUniColor, new fc.CoatColored(fc.Color.CSS("WHITE")));
    let black: fc.Material = new fc.Material("Black", fc.ShaderUniColor, new fc.CoatColored(fc.Color.CSS("BLACK")));
    let grey: fc.Material = new fc.Material("Grey", fc.ShaderUniColor, new fc.CoatColored(fc.Color.CSS("DarkGrey")));

    let controlVertical: fc.Control = new fc.Control("AvatarControlVert", 1, fc.CONTROL_TYPE.PROPORTIONAL);
    controlVertical.setDelay(80);

    let controlHorizontal: fc.Control = new fc.Control("AvatarControlHor", 1, fc.CONTROL_TYPE.PROPORTIONAL);
    controlHorizontal.setDelay(80);

    let controlDash: fc.Control = new fc.Control("AvatarControlDash", 1, fc.CONTROL_TYPE.PROPORTIONAL);

    let usedDash: boolean = false;

    function hndLoad(_event: Event): void {
        const canvas: HTMLCanvasElement = document.querySelector("canvas");
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
        avatar = new Avatar("Avatar", new fc.Vector3(0, 0, 0));
        root.appendChild(avatar);


        // Setup Camera
        let cmpCamera: fc.ComponentCamera = new fc.ComponentCamera();
        cmpCamera.pivot.translateZ(120);
        cmpCamera.pivot.rotateY(180);
        cmpCamera.backgroundColor = fc.Color.CSS("black");
        //avatar.addComponent(cmpCamera);

        // Setup Viewport
        viewport = new fc.Viewport();
        viewport.initialize("Viewport", root, cmpCamera, canvas);

        // EventListener
        fc.Loop.addEventListener(fc.EVENT.LOOP_FRAME, hndLoop);
        fc.Loop.start(fc.LOOP_MODE.TIME_GAME, 120);
    }

    function hndLoop(_event: Event): void {

        moveAvatar(controlVertical.getOutput(), controlHorizontal.getOutput(), controlDash.getOutput());

        viewport.draw();
    }

    function moveAvatar(_translationY: number, _translationX: number, _dash: number): void {
        controlVertical.setInput(
            fc.Keyboard.mapToValue(1, 0, [fc.KEYBOARD_CODE.W, fc.KEYBOARD_CODE.ARROW_LEFT])
            + fc.Keyboard.mapToValue(-1, 0, [fc.KEYBOARD_CODE.S, fc.KEYBOARD_CODE.ARROW_RIGHT])
        );

        controlHorizontal.setInput(
            fc.Keyboard.mapToValue(-1, 0, [fc.KEYBOARD_CODE.A, fc.KEYBOARD_CODE.ARROW_LEFT])
            + fc.Keyboard.mapToValue(1, 0, [fc.KEYBOARD_CODE.D, fc.KEYBOARD_CODE.ARROW_RIGHT])
        );

        controlDash.setInput(
            fc.Keyboard.mapToValue(1, 0, [fc.KEYBOARD_CODE.SHIFT_LEFT, fc.KEYBOARD_CODE.SPACE])
        );

        let speedX: number = _translationX * 0.1;
        let speedY: number = _translationY * 0.1;

        if (_dash == 1 && !usedDash) {
            let dashSpeed: number = 25;
            speedX *= dashSpeed;
            speedY *= dashSpeed;
            usedDash = true;
            console.log("Dash was just used");
            fc.Time.game.setTimer(2000, 1, (_event: fc.EventTimer) => {
                usedDash = false;
                console.log("Dash can be used again");
            });
        } else {
            speedX *= 1;
            speedY *= 1;
        }

        avatar.mtxLocal.translateX(speedX);
        avatar.mtxLocal.translateY(speedY);

    }

    function createWalls(): fc.Node {
        let walls: fc.Node = new fc.Node("Walls");
        walls.appendChild(new Wall(new fc.Vector2(1, 51), new fc.Vector3(-45, 0, 0), white));
        walls.appendChild(new Wall(new fc.Vector2(1, 51), new fc.Vector3(45, 0, 0), white));
        walls.appendChild(new Wall(new fc.Vector2(90, 1), new fc.Vector3(0, 25, 0), white));
        walls.appendChild(new Wall(new fc.Vector2(90, 1), new fc.Vector3(0, -25, 0), white));
        return walls;
    }
}

// TODO

// - Avatar Klasse und Funktionen auslagern
// - Sprites
// + Dash Cooldown
// - Dash verbessern
// - Bounce / Collision GameObject
// - Shooting
// - Level Builder
