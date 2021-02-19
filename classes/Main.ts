namespace PHE {
    import fc = FudgeCore;
    export let viewport: fc.Viewport;
    export let root: fc.Node;
    export let level: fc.Node;
    export let avatar: Avatar;
    export let walls: fc.Node;
    export let floor: fc.Node;
    export let enemies: fc.Node;
    export let bullet: Bullet;
    export let enemy: Enemy;

    let grey: fc.Material = new fc.Material("Grey", fc.ShaderUniColor, new fc.CoatColored(fc.Color.CSS("DarkGrey")));

    export let controlVertical: fc.Control = new fc.Control("AvatarControlVertical", 1, fc.CONTROL_TYPE.PROPORTIONAL);
    controlVertical.setDelay(80);
    export let controlHorizontal: fc.Control = new fc.Control("AvatarControlHorizontal", 1, fc.CONTROL_TYPE.PROPORTIONAL);
    controlHorizontal.setDelay(80);
    export let controlRotation: fc.Control = new fc.Control("AvatarControlRotation", 1, fc.CONTROL_TYPE.PROPORTIONAL);
    let controlDash: fc.Control = new fc.Control("AvatarControlDash", 1, fc.CONTROL_TYPE.PROPORTIONAL);
    let controlShoot: fc.Control = new fc.Control("AvatarControlShoot", 1, fc.CONTROL_TYPE.PROPORTIONAL);
    let controlReload: fc.Control = new fc.Control("AvatarControlReload", 1, fc.CONTROL_TYPE.PROPORTIONAL);
    let controlDifficulty: fc.Control = new fc.Control("ControlDifficulty", 1, fc.CONTROL_TYPE.PROPORTIONAL);

    export let cmpAudioShoot: fc.ComponentAudio;
    export let cmpAudioReload: fc.ComponentAudio;
    export let cmpAudioEmptyGun: fc.ComponentAudio;
    export let cmpAudioZombie1: fc.ComponentAudio;
    export let cmpAudioZombie2: fc.ComponentAudio;
    let cmpAudioSoundtrack: fc.ComponentAudio;
    let cmpAudioAmbience: fc.ComponentAudio;

    let canvas: HTMLCanvasElement;
    let cmpCamera: fc.ComponentCamera;

    let timer: boolean = true;
    let enemySpawnTime: number = 5000;

    window.addEventListener("load", start);

    async function start(_event: Event): Promise<void> {
        root = new fc.Node("Root");
        root.addComponent(new fc.ComponentTransform());

        let listener: ƒ.ComponentAudioListener = new ƒ.ComponentAudioListener();
        fc.AudioManager.default.listenTo(root);
        fc.AudioManager.default.listenWith(listener);

        let audioSoundtrack: fc.Audio = new fc.Audio("../Assets/Audio/soundtrack.mp3");
        cmpAudioSoundtrack = new fc.ComponentAudio(audioSoundtrack, true);
        root.addComponent(cmpAudioSoundtrack);
        cmpAudioSoundtrack.play(true);

        let div: HTMLDivElement = document.querySelector("div#StartScreen");
        div.addEventListener("click", () => {
            div.style.display = "none";
            //cmpAudioSoundtrack.play(false);
            hndLoad();
        });
    }

    function hndLoad(): void {

        canvas = document.querySelector("canvas");

        setupLevel();

        // Setup Viewport
        viewport = new fc.Viewport();
        viewport.initialize("Viewport", root, cmpCamera, canvas);

        Hud.start();

        canvas.addEventListener("mousemove", hndMouse);
        canvas.addEventListener("click", shoot);
        fc.Loop.addEventListener(fc.EVENT.LOOP_FRAME, hndLoop);
        fc.Loop.start(fc.LOOP_MODE.TIME_GAME, 60);
    }

    function hndLoop(_event: Event): void {
        setControlInput();
        avatar.moveAvatar(controlVertical.getOutput(), controlHorizontal.getOutput(), controlDash.getOutput(), controlRotation.getOutput(), controlShoot.getOutput(), controlReload.getOutput());
        controlRotation.setInput(0);

        hndCollision();

        setDifficulty();

        for (let enemy of enemies.getChildren() as Enemy[]) {
            enemy.update();
        }

        increaseEnemys();

        if (gameState.health <= 0) {
            level.removeChild(enemies);
            if (gameState.highscore < gameState.score) {
                gameState.highscore = gameState.score;
            }
            newLevel();
        }
        viewport.draw();
    }

    function shoot(): void {
        avatar.shoot();
    }

    function hndMouse(_event: MouseEvent): void {
        let mousePosClient: fc.Vector2 = new fc.Vector2(_event.clientX, _event.clientY);
        let mousePos3DClient: fc.Vector3 = new fc.Vector3(_event.clientX, _event.clientY, 0);
        //console.log("X: " + _event.clientX + "\nY: " + _event.clientY);
        let normal: fc.Vector3 = floor.mtxWorld.getZ();
        let mousePosWorld: fc.Vector3 = viewport.getRayFromClient(mousePosClient).intersectPlane(mousePos3DClient, normal);

        avatar.rotateTo(mousePosWorld);

    }

    function setDifficulty(): void {
        let difficulty: number = controlDifficulty.getOutput();
        switch (difficulty) {
            case 1:
                enemySpawnTime = 5000;
                gameState.enemyDamage = 5;
                break;
            case 2:
                enemySpawnTime = 3500;
                gameState.enemyDamage = 20;
                break;
            case 3:
                enemySpawnTime = 1000;
                gameState.enemyDamage = 50;
                break;
            default:
                break;
        }
    }

    function increaseEnemys(): void {

        if (timer) {
            timer = false;
            fc.Time.game.setTimer(enemySpawnTime, 1, (_event: fc.EventTimer) => {
                spawnEnemy();
                if (enemySpawnTime > 1000) {
                    enemySpawnTime -= 100;
                }
                timer = true;
            });
        }
    }

    function spawnEnemy(): void {
        let txtZombie2: fc.TextureImage = new fc.TextureImage("../Assets/zombie.png");
        let mtrZombie2: fc.Material = new fc.Material("MaterialEnemy", fc.ShaderTexture, new fc.CoatTextured(fc.Color.CSS("WHITE"), txtZombie2));
        enemies.appendChild(new Enemy("Enemy", new fc.Vector3(4, 4, 2), new fc.Vector3(fc.Random.default.getRange(-10, 16), fc.Random.default.getRange(-8, 8), 0), mtrZombie2));
    }

    function setupLevel(): void {
        level = new fc.Node("Level");
        root.appendChild(level);

        // Avatar
        avatar = new Avatar("Avatar", new fc.Vector3(1, 1, 2), new fc.Vector3(-15, 0, 0));
        level.appendChild(avatar);

        //Floor
        floor = createFloor();
        level.appendChild(floor);

        // Walls
        walls = createWalls();
        level.appendChild(walls);

        //Enemy
        enemies = createEnemies(10);
        level.appendChild(enemies);

        //Audio
        setupAudio();

        // Setup Camera
        cmpCamera = new fc.ComponentCamera();
        cmpCamera.pivot.translateZ(18);
        cmpCamera.pivot.rotateY(180);
        cmpCamera.backgroundColor = fc.Color.CSS("black");
        avatar.addComponent(cmpCamera);
    }

    function newLevel(): void {
        root.removeAllChildren();
        avatar.removeAllChildren();

        setupLevel();
        gameState.health = 100;
        gameState.ammo = 15;
        gameState.score = 0;
        enemySpawnTime = 5000;

        viewport = new fc.Viewport();
        viewport.initialize("Viewport", root, cmpCamera, canvas);
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
        controlShoot.setInput(
            fc.Keyboard.mapToValue(1, 0, [fc.KEYBOARD_CODE.SPACE])
        );

        controlReload.setInput(
            fc.Keyboard.mapToValue(1, 0, [fc.KEYBOARD_CODE.R])
        );

        controlDifficulty.setInput(
            fc.Keyboard.mapToValue(1, 0, [fc.KEYBOARD_CODE.ONE])
            + fc.Keyboard.mapToValue(2, 0, [fc.KEYBOARD_CODE.TWO])
            + fc.Keyboard.mapToValue(3, 0, [fc.KEYBOARD_CODE.THREE])
        );
    }

    function hndCollision(): void {
        for (let wall of walls.getChildren() as Wall[]) {
            avatar.checkCollision(wall, "avatar");
        }
    }

    function createWalls(): fc.Node {
        let walls: fc.Node = new fc.Node("Walls");

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

    function createEnemies(_number: number): fc.Node {
        let enemies: fc.Node = new fc.Node("Enemies");
        let txtZombie2: fc.TextureImage = new fc.TextureImage("../Assets/zombie.png");
        let mtrZombie2: fc.Material = new fc.Material("MaterialEnemy", fc.ShaderTexture, new fc.CoatTextured(fc.Color.CSS("WHITE"), txtZombie2));

        for (let index: number = 0; index < _number; index++) {
            enemies.appendChild(new Enemy("Enemy" + index, new fc.Vector3(4, 4, 2), new fc.Vector3(fc.Random.default.getRange(-10, 16), fc.Random.default.getRange(-8, 8), 0), mtrZombie2));
        }
        return enemies;
    }

    function setupAudio(): void {
        let audioShoot: fc.Audio = new fc.Audio("../Assets/Audio/12-Gauge-Pump-Action-Shotgun.mp3");
        cmpAudioShoot = new fc.ComponentAudio(audioShoot, false);
        level.addComponent(cmpAudioShoot);

        let audioReload: fc.Audio = new fc.Audio("../Assets/Audio/Reloading-Magazine.mp3");
        cmpAudioReload = new fc.ComponentAudio(audioReload, false);
        level.addComponent(cmpAudioReload);

        let audioEmptyGun: fc.Audio = new fc.Audio("../Assets/Audio/empty-gun.mp3");
        cmpAudioEmptyGun = new fc.ComponentAudio(audioEmptyGun, false);
        level.addComponent(cmpAudioEmptyGun);

        let audioAmbience: fc.Audio = new fc.Audio("../Assets/Audio/zombie-ambience-background.mp3");
        cmpAudioAmbience = new fc.ComponentAudio(audioAmbience, true);
        level.addComponent(cmpAudioAmbience);
        cmpAudioAmbience.play(true);

        let audioZombie1: fc.Audio = new fc.Audio("../Assets/Audio/zombie-bite-1.mp3");
        cmpAudioZombie1 = new fc.ComponentAudio(audioZombie1, false);
        level.addComponent(cmpAudioZombie1);

        let audioZombie2: fc.Audio = new fc.Audio("../Assets/Audio/zombie-bite-2.mp3");
        cmpAudioZombie2 = new fc.ComponentAudio(audioZombie2, false);
        level.addComponent(cmpAudioZombie2);
    }


}

