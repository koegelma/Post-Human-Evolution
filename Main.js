"use strict";
var PHE;
(function (PHE) {
    var fc = FudgeCore;
    let grey = new fc.Material("Grey", fc.ShaderUniColor, new fc.CoatColored(fc.Color.CSS("DarkGrey")));
    PHE.controlVertical = new fc.Control("AvatarControlVertical", 1, 0 /* PROPORTIONAL */);
    PHE.controlVertical.setDelay(80);
    PHE.controlHorizontal = new fc.Control("AvatarControlHorizontal", 1, 0 /* PROPORTIONAL */);
    PHE.controlHorizontal.setDelay(80);
    PHE.controlRotation = new fc.Control("AvatarControlRotation", 1, 0 /* PROPORTIONAL */);
    let controlDash = new fc.Control("AvatarControlDash", 1, 0 /* PROPORTIONAL */);
    let controlShoot = new fc.Control("AvatarControlShoot", 1, 0 /* PROPORTIONAL */);
    let controlReload = new fc.Control("AvatarControlReload", 1, 0 /* PROPORTIONAL */);
    let cmpAudioSoundtrack;
    let cmpAudioAmbience;
    let canvas;
    let cmpCamera;
    let timer = true;
    let enemySpawnTime = 5000;
    window.addEventListener("load", start);
    function start(_event) {
        PHE.root = new fc.Node("Root");
        PHE.root.addComponent(new fc.ComponentTransform());
        let listener = new ƒ.ComponentAudioListener();
        fc.AudioManager.default.listenTo(PHE.root);
        fc.AudioManager.default.listenWith(listener);
        let audioSoundtrack = new fc.Audio("../Assets/Audio/soundtrack.mp3");
        cmpAudioSoundtrack = new fc.ComponentAudio(audioSoundtrack, true);
        PHE.root.addComponent(cmpAudioSoundtrack);
        cmpAudioSoundtrack.play(true);
        let div = document.querySelector("div#StartScreen");
        div.addEventListener("click", () => {
            div.style.display = "none";
            //cmpAudioSoundtrack.play(false);
            hndLoad();
        });
    }
    function hndLoad() {
        canvas = document.querySelector("canvas");
        setupLevel();
        // Setup Viewport
        PHE.viewport = new fc.Viewport();
        PHE.viewport.initialize("Viewport", PHE.root, cmpCamera, canvas);
        PHE.Hud.start();
        canvas.addEventListener("mousemove", hndMouse);
        canvas.addEventListener("click", shoot);
        fc.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, hndLoop);
        fc.Loop.start(fc.LOOP_MODE.TIME_GAME, 60);
    }
    function hndLoop(_event) {
        setControlInput();
        PHE.avatar.moveAvatar(PHE.controlVertical.getOutput(), PHE.controlHorizontal.getOutput(), controlDash.getOutput(), PHE.controlRotation.getOutput(), controlShoot.getOutput(), controlReload.getOutput());
        PHE.controlRotation.setInput(0);
        hndCollision();
        for (let enemy of PHE.enemies.getChildren()) {
            enemy.update();
        }
        increaseEnemys();
        if (PHE.gameState.health <= 0) {
            PHE.level.removeChild(PHE.enemies);
            if (PHE.gameState.highscore < PHE.gameState.score) {
                PHE.gameState.highscore = PHE.gameState.score;
            }
            newLevel();
        }
        PHE.viewport.draw();
    }
    function shoot() {
        PHE.avatar.shoot();
    }
    function hndMouse(_event) {
        let mousePosClient = new fc.Vector2(_event.clientX, _event.clientY);
        let mousePos3DClient = new fc.Vector3(_event.clientX, _event.clientY, 0);
        //console.log("X: " + _event.clientX + "\nY: " + _event.clientY);
        let normal = PHE.floor.mtxWorld.getZ();
        let mousePosWorld = PHE.viewport.getRayFromClient(mousePosClient).intersectPlane(mousePos3DClient, normal);
        PHE.avatar.rotateTo(mousePosWorld);
    }
    function increaseEnemys() {
        if (timer) {
            timer = false;
            fc.Time.game.setTimer(enemySpawnTime, 1, (_event) => {
                spawnEnemy();
                if (enemySpawnTime > 1000) {
                    enemySpawnTime -= 100;
                }
                timer = true;
            });
        }
    }
    function spawnEnemy() {
        let txtZombie2 = new fc.TextureImage("../Assets/Zombie/attack01/attack01_0000.png");
        let mtrZombie2 = new fc.Material("MaterialEnemy", fc.ShaderTexture, new fc.CoatTextured(fc.Color.CSS("WHITE"), txtZombie2));
        PHE.enemies.appendChild(new PHE.Enemy("Enemy", new fc.Vector3(4, 4, 2), new fc.Vector3(fc.Random.default.getRange(-10, 16), fc.Random.default.getRange(-8, 8), 0), mtrZombie2));
    }
    function setupLevel() {
        PHE.level = new fc.Node("Level");
        PHE.root.appendChild(PHE.level);
        // Avatar
        PHE.avatar = new PHE.Avatar("Avatar", new fc.Vector3(1, 1, 2), new fc.Vector3(-15, 0, 0));
        PHE.level.appendChild(PHE.avatar);
        //Floor
        PHE.floor = createFloor();
        PHE.level.appendChild(PHE.floor);
        // Walls
        PHE.walls = createWalls();
        PHE.level.appendChild(PHE.walls);
        //Enemy
        PHE.enemies = createEnemies(10);
        PHE.level.appendChild(PHE.enemies);
        //Audio
        setupAudio();
        // Setup Camera
        cmpCamera = new fc.ComponentCamera();
        cmpCamera.pivot.translateZ(18);
        cmpCamera.pivot.rotateY(180);
        cmpCamera.backgroundColor = fc.Color.CSS("black");
        PHE.avatar.addComponent(cmpCamera);
    }
    function newLevel() {
        PHE.root.removeAllChildren();
        PHE.avatar.removeAllChildren();
        setupLevel();
        PHE.gameState.health = 100;
        PHE.gameState.ammo = 15;
        PHE.gameState.score = 0;
        enemySpawnTime = 5000;
        PHE.viewport = new fc.Viewport();
        PHE.viewport.initialize("Viewport", PHE.root, cmpCamera, canvas);
    }
    function setControlInput() {
        PHE.controlVertical.setInput(fc.Keyboard.mapToValue(1, 0, [fc.KEYBOARD_CODE.W])
            + fc.Keyboard.mapToValue(-1, 0, [fc.KEYBOARD_CODE.S]));
        PHE.controlHorizontal.setInput(fc.Keyboard.mapToValue(-1, 0, [fc.KEYBOARD_CODE.A])
            + fc.Keyboard.mapToValue(1, 0, [fc.KEYBOARD_CODE.D]));
        controlDash.setInput(fc.Keyboard.mapToValue(1, 0, [fc.KEYBOARD_CODE.SHIFT_LEFT]));
        controlShoot.setInput(fc.Keyboard.mapToValue(1, 0, [fc.KEYBOARD_CODE.SPACE]));
        controlReload.setInput(fc.Keyboard.mapToValue(1, 0, [fc.KEYBOARD_CODE.R]));
    }
    function hndCollision() {
        for (let wall of PHE.walls.getChildren()) {
            PHE.avatar.checkCollision(wall, "avatar");
        }
    }
    function createWalls() {
        let walls = new fc.Node("Walls");
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
    function createEnemies(_number) {
        let enemies = new fc.Node("Enemies");
        let txtZombie2 = new fc.TextureImage("../Assets/Zombie/attack01/attack01_0000.png");
        let mtrZombie2 = new fc.Material("MaterialEnemy", fc.ShaderTexture, new fc.CoatTextured(fc.Color.CSS("WHITE"), txtZombie2));
        for (let index = 0; index < _number; index++) {
            enemies.appendChild(new PHE.Enemy("Enemy" + index, new fc.Vector3(4, 4, 2), new fc.Vector3(fc.Random.default.getRange(-10, 16), fc.Random.default.getRange(-8, 8), 0), mtrZombie2));
        }
        return enemies;
    }
    function setupAudio() {
        let audioShoot = new fc.Audio("../Assets/Audio/12-Gauge-Pump-Action-Shotgun.mp3");
        PHE.cmpAudioShoot = new fc.ComponentAudio(audioShoot, false);
        PHE.level.addComponent(PHE.cmpAudioShoot);
        let audioReload = new fc.Audio("../Assets/Audio/Reloading-Magazine.mp3");
        PHE.cmpAudioReload = new fc.ComponentAudio(audioReload, false);
        PHE.level.addComponent(PHE.cmpAudioReload);
        let audioEmptyGun = new fc.Audio("../Assets/Audio/empty-gun.mp3");
        PHE.cmpAudioEmptyGun = new fc.ComponentAudio(audioEmptyGun, false);
        PHE.level.addComponent(PHE.cmpAudioEmptyGun);
        let audioAmbience = new fc.Audio("../Assets/Audio/zombie-ambience-background.mp3");
        cmpAudioAmbience = new fc.ComponentAudio(audioAmbience, true);
        PHE.level.addComponent(cmpAudioAmbience);
        cmpAudioAmbience.play(true);
        let audioZombie1 = new fc.Audio("../Assets/Audio/zombie-bite-1.mp3");
        PHE.cmpAudioZombie1 = new fc.ComponentAudio(audioZombie1, false);
        PHE.level.addComponent(PHE.cmpAudioZombie1);
        let audioZombie2 = new fc.Audio("../Assets/Audio/zombie-bite-2.mp3");
        PHE.cmpAudioZombie2 = new fc.ComponentAudio(audioZombie2, false);
        PHE.level.addComponent(PHE.cmpAudioZombie2);
    }
})(PHE || (PHE = {}));
//# sourceMappingURL=Main.js.map