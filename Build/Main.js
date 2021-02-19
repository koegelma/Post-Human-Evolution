"use strict";
var PHE;
(function (PHE) {
    var fc = FudgeCore;
    class GameObject extends fc.Node {
        constructor(_name, _size, _position) {
            super(_name);
            this.addComponent(new fc.ComponentTransform(fc.Matrix4x4.TRANSLATION(_position)));
            this.rect = new fc.Rectangle(_position.x, _position.y, _size.x, _size.y, fc.ORIGIN2D.CENTER);
            let cmpQuad = new fc.ComponentMesh(GameObject.meshQuad);
            this.addComponent(cmpQuad);
            cmpQuad.pivot.scale(_size);
            this.mtxLocal.translation = _position;
            this.mtxPivot = this.getComponent(fc.ComponentMesh).pivot;
        }
    }
    GameObject.meshQuad = new fc.MeshSprite();
    PHE.GameObject = GameObject;
})(PHE || (PHE = {}));
var PHE;
(function (PHE) {
    var fc = FudgeCore;
    let Axis;
    (function (Axis) {
        Axis[Axis["XAXIS"] = 0] = "XAXIS";
        Axis[Axis["YAXIS"] = 1] = "YAXIS";
    })(Axis || (Axis = {}));
    class Moveable extends PHE.GameObject {
        constructor(_name, _size, _position) {
            super(_name, _size, _position);
            this.velocity = fc.Vector3.ZERO();
            this.velocity = fc.Vector3.ZERO();
        }
        move() {
            let frameTime = fc.Loop.timeFrameGame / 1000;
            let distance = fc.Vector3.SCALE(this.velocity, frameTime);
            this.translate(distance);
        }
        translate(_distance) {
            this.mtxLocal.translate(_distance);
            this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
            this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
        }
        checkCollision(_target, _name) {
            let intersection = this.rect.getIntersection(_target.rect);
            if (intersection == null)
                return false;
            if (_name === "avatar") {
                if (intersection.size.x < intersection.size.y) {
                    this.hndCollisionAvatar(_target, Axis.XAXIS);
                }
                else {
                    this.hndCollisionAvatar(_target, Axis.YAXIS);
                }
            }
            return true;
        }
        hndCollisionAvatar(_target, _axis) {
            let buffer = 0.5;
            if (_axis == Axis.XAXIS) {
                if (this.mtxLocal.translation.x < _target.mtxLocal.translation.x) {
                    this.velocity.x = 0;
                    this.mtxLocal.translation = new fc.Vector3(_target.mtxLocal.translation.x - buffer * (this.getComponent(fc.ComponentMesh).pivot.scaling.x + _target.getComponent(fc.ComponentMesh).pivot.scaling.x), this.mtxLocal.translation.y, 0);
                }
                else {
                    this.velocity.x = 0;
                    this.mtxLocal.translation = new fc.Vector3(_target.mtxLocal.translation.x + buffer * (this.getComponent(fc.ComponentMesh).pivot.scaling.x + _target.getComponent(fc.ComponentMesh).pivot.scaling.x), this.mtxLocal.translation.y, 0);
                }
            }
            else if (_axis == Axis.YAXIS) {
                if (this.mtxLocal.translation.y > _target.mtxLocal.translation.y) {
                    this.velocity.y = 0;
                    this.mtxLocal.translation = new fc.Vector3(this.mtxLocal.translation.x, _target.mtxLocal.translation.y + buffer * (this.getComponent(fc.ComponentMesh).pivot.scaling.y + _target.getComponent(fc.ComponentMesh).pivot.scaling.y), 0);
                }
                else {
                    this.velocity.y = 0;
                    this.mtxLocal.translation = new fc.Vector3(this.mtxLocal.translation.x, _target.mtxLocal.translation.y - buffer * (this.getComponent(fc.ComponentMesh).pivot.scaling.y + _target.getComponent(fc.ComponentMesh).pivot.scaling.y), 0);
                }
            }
        }
    }
    PHE.Moveable = Moveable;
})(PHE || (PHE = {}));
///<reference path="GameObject.ts"/>
///<reference path="Moveable.ts"/>
var PHE;
///<reference path="GameObject.ts"/>
///<reference path="Moveable.ts"/>
(function (PHE) {
    var fc = FudgeCore;
    var fcaid = FudgeAid;
    class Avatar extends PHE.Moveable {
        constructor(_name, _size, _position) {
            super(_name, _size, _position);
            this.clrWhite = fc.Color.CSS("white");
            this.meshQuad = new fc.MeshQuad();
            this.txtAvatar = new fc.TextureImage("../Assets/avatar.png");
            this.mtrAvatar = new fc.Material("MaterialAvatar", fc.ShaderTexture, new fc.CoatTextured(this.clrWhite, this.txtAvatar));
            this.usedDash = false;
            this.shotReady = true;
            this.red = new fc.Material("Red", fc.ShaderUniColor, new fc.CoatColored(fc.Color.CSS("RED")));
            this.animation = new fcaid.Node("Animation", fc.Matrix4x4.IDENTITY());
            this.appendChild(this.animation);
            this.animation.addComponent(new fc.ComponentMaterial(this.mtrAvatar));
            this.animation.addComponent(new fc.ComponentMesh(this.meshQuad));
            this.animation.mtxLocal.translateZ(0.01);
            this.mtxLocal.translation = _position;
            this.lasersight = new fcaid.Node("Laser", fc.Matrix4x4.IDENTITY());
            this.animation.appendChild(this.lasersight);
            let cmpMaterial = new fc.ComponentMaterial(this.red);
            this.lasersight.addComponent(new fc.ComponentMesh(this.meshQuad));
            this.lasersight.addComponent(cmpMaterial);
            this.lasersight.mtxLocal.scale(new fc.Vector3(6, 0.01, 0));
            this.lasersight.mtxLocal.translateX(0.5);
            this.lasersight.mtxLocal.translateY(-24);
        }
        moveAvatar(_translationY, _translationX, _dash, _rotation, _shoot, _reload) {
            let speedX = _translationX * 0.08;
            let speedY = _translationY * 0.08;
            if (_dash == 1 && !this.usedDash) {
                let dashSpeed = 15;
                speedX *= dashSpeed;
                speedY *= dashSpeed;
                this.usedDash = true;
                console.log("Dash was just used");
                fc.Time.game.setTimer(3000, 1, (_event) => {
                    this.usedDash = false;
                    console.log("Dash can be used again");
                });
            }
            else {
                speedX *= 1;
                speedY *= 1;
            }
            if (_reload == 1) {
                PHE.gameState.ammo = 15;
                PHE.cmpAudioReload.play(true);
            }
            this.mtxLocal.translateX(speedX);
            this.mtxLocal.translateY(speedY);
            this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
            this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
            this.animation.mtxLocal.rotateZ(_rotation);
        }
        shoot() {
            if (this.shotReady && PHE.gameState.ammo > 0) {
                let shotDirection = this.animation.mtxWorld.getX();
                let bulletPosition = new fc.Vector3(this.mtxWorld.translation.x, this.mtxWorld.translation.y - 0.24, 1);
                PHE.bullet = new PHE.Bullet("Bullet", new fc.Vector3(0.1, 0.1, 1), bulletPosition);
                PHE.level.appendChild(PHE.bullet);
                PHE.cmpAudioShoot.play(true);
                PHE.bullet.shoot(shotDirection);
                PHE.gameState.ammo--;
                this.shotReady = false;
                fc.Time.game.setTimer(800, 1, (_event) => {
                    this.shotReady = true;
                });
            }
            else if (this.shotReady && PHE.gameState.ammo == 0) {
                PHE.cmpAudioEmptyGun.play(true);
            }
        }
        rotateTo(_mousePos) {
            let newMousePos = fc.Vector3.DIFFERENCE(_mousePos, this.mtxWorld.translation);
            let lookDirection = this.animation.mtxWorld.getX();
            let angleRotation = this.calcAngleBetweenVectors(newMousePos, lookDirection);
            let newLookDirection = this.rotateVector(lookDirection, angleRotation);
            if (this.calcAngleBetweenVectors(newLookDirection, newMousePos) > 0.1) {
                angleRotation = angleRotation * -1;
            }
            PHE.controlRotation.setInput(angleRotation);
        }
        calcAngleBetweenVectors(_vector1, _vector2) {
            let angle;
            angle = fc.Vector3.DOT(_vector1, _vector2) / (this.vectorAmount(_vector1) * this.vectorAmount(_vector2));
            angle = Math.acos(angle) * 180 / Math.PI;
            return angle;
        }
        vectorAmount(_vector) {
            return Math.sqrt(Math.pow(_vector.x, 2) + Math.pow(_vector.y, 2) + Math.pow(_vector.z, 2));
        }
        rotateVector(_vector, _angle) {
            let _rotatedVector = new fc.Vector3;
            let xCoord;
            let yCoord;
            let cosAngle = Math.cos(_angle * Math.PI / 180);
            let sinAngle = Math.sin(_angle * Math.PI / 180);
            xCoord = (_vector.x * cosAngle) - (_vector.y * sinAngle);
            yCoord = (_vector.x * sinAngle) + (_vector.y * cosAngle);
            _rotatedVector = new fc.Vector3(xCoord, yCoord, 0);
            return _rotatedVector;
        }
    }
    PHE.Avatar = Avatar;
})(PHE || (PHE = {}));
var PHE;
(function (PHE) {
    var fc = FudgeCore;
    class Bullet extends PHE.Moveable {
        //public grey: fc.Material = new fc.Material("Grey", fc.ShaderUniColor, new fc.CoatColored(fc.Color.CSS("GREY")));
        constructor(_name, _size, _position) {
            super("Bullet", _size, _position);
            this.velocity = fc.Vector3.ZERO();
            //let cmpMaterial: fc.ComponentMaterial = new fc.ComponentMaterial(this.grey);
            //this.addComponent(cmpMaterial); 
        }
        shoot(_velocity) {
            this.velocity = _velocity;
            for (let speed = 1; speed <= 1.05; speed += 0.01) {
                let distance = fc.Vector3.SCALE(this.velocity, speed);
                this.translate(distance);
                for (let enemy of PHE.enemies.getChildren()) {
                    if (this.checkCollision(enemy, null)) {
                        PHE.enemies.removeChild(enemy);
                        PHE.level.removeChild(PHE.bullet);
                        PHE.gameState.score += 50;
                        return true;
                    }
                }
            }
            PHE.level.removeChild(PHE.bullet);
            return false;
        }
        translate(_distance) {
            this.mtxLocal.translate(_distance);
            this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
            this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
        }
    }
    PHE.Bullet = Bullet;
})(PHE || (PHE = {}));
///<reference path="GameObject.ts"/>
///<reference path="Moveable.ts"/>
var PHE;
///<reference path="GameObject.ts"/>
///<reference path="Moveable.ts"/>
(function (PHE) {
    var fc = FudgeCore;
    //import fcaid = FudgeAid;
    let JOB;
    (function (JOB) {
        JOB[JOB["IDLE"] = 0] = "IDLE";
        JOB[JOB["PATROL"] = 1] = "PATROL";
        JOB[JOB["Hunt"] = 2] = "Hunt";
    })(JOB = PHE.JOB || (PHE.JOB = {}));
    class Enemy extends PHE.Moveable {
        // private animation: fc.Node;
        //private rotateNow: boolean = false;
        /*  private red: fc.Material = new fc.Material("Red", fc.ShaderUniColor, new fc.CoatColored(fc.Color.CSS("RED")));
         private hitBox: fc.Node;
         private meshQuad: fc.MeshQuad = new fc.MeshQuad(); */
        constructor(_name, _size, _position, _material) {
            super(_name, _size, _position);
            this.speed = 3;
            let cmpMaterial = new fc.ComponentMaterial(_material);
            this.addComponent(cmpMaterial);
            this.mtxLocal.rotateZ(fc.Random.default.getRange(0, 359));
            this.mtxLocal.translation = _position;
            this.mtxLocal.translateZ(0.01);
            this.rect = new fc.Rectangle(_position.x, _position.y, _size.x / 4, _size.y / 4, fc.ORIGIN2D.CENTER);
            /*  this.hitBox = new fcaid.Node("Laser", fc.Matrix4x4.IDENTITY());
             this.appendChild(this.hitBox);
             let cmpMaterialred: fc.ComponentMaterial = new fc.ComponentMaterial(this.red);
             this.hitBox.addComponent(new fc.ComponentMesh(this.meshQuad));
             this.hitBox.addComponent(cmpMaterialred);
             this.hitBox.mtxLocal.scaleX(this.rect.size.x);
             this.hitBox.mtxLocal.scaleY(this.rect.size.y);
             this.hitBox.mtxLocal.scaleZ(0); */
        }
        update() {
            this.moveEnemy();
            if (this.checkCollision(PHE.avatar, null) && PHE.gameState.health > 0) {
                PHE.gameState.health -= PHE.gameState.enemyDamage;
                this.mtxLocal.translateX(-2);
                this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
                this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
                let zombieSound = Math.round(fc.random.getRange(1, 3));
                switch (zombieSound) {
                    case 1:
                        PHE.cmpAudioZombie1.play(true);
                        break;
                    case 2:
                        PHE.cmpAudioZombie2.play(true);
                        break;
                    default:
                        PHE.cmpAudioZombie1.play(true);
                }
            }
        }
        moveEnemy() {
            // check if avatar is in range, then rotate and move enemy
            if (this.vectorAmount(fc.Vector3.DIFFERENCE(PHE.avatar.mtxLocal.translation, this.mtxLocal.translation)) < 10 && this.vectorAmount(fc.Vector3.DIFFERENCE(PHE.avatar.mtxLocal.translation, this.mtxLocal.translation)) > 1) {
                this.rotateToAvatar();
                this.mtxLocal.translateX(this.speed * fc.Loop.timeFrameGame / 1000);
                this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
                this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
            }
        }
        rotateToAvatar() {
            // calculate rotation angle via unit circle
            let vectorAnimation = fc.Vector3.DIFFERENCE(PHE.avatar.mtxLocal.translation, this.mtxLocal.translation);
            vectorAnimation = new fc.Vector3(vectorAnimation.x, vectorAnimation.y, 0);
            let yCoordNorm = (1 / this.vectorAmount(vectorAnimation)) * vectorAnimation.y;
            let angle;
            angle = Math.acos(yCoordNorm) * 180 / Math.PI;
            angle += 90;
            if (this.mtxLocal.translation.x < PHE.avatar.mtxLocal.translation.x) {
                angle = 180 - angle;
            }
            this.mtxLocal.rotateZ(this.mtxLocal.rotation.z * -1);
            this.mtxLocal.rotateZ(angle);
        }
        vectorAmount(_vector) {
            return Math.sqrt(Math.pow(_vector.x, 2) + Math.pow(_vector.y, 2) + Math.pow(_vector.z, 2));
        }
    }
    PHE.Enemy = Enemy;
})(PHE || (PHE = {}));
var PHE;
(function (PHE) {
    var fc = FudgeCore;
    class Floor extends PHE.GameObject {
        constructor(_size, _position, _material) {
            super("Floor", _size, _position);
            let cmpMaterial = new fc.ComponentMaterial(_material);
            this.addComponent(cmpMaterial);
        }
    }
    PHE.Floor = Floor;
})(PHE || (PHE = {}));
var PHE;
(function (PHE) {
    var fcui = FudgeUserInterface;
    var fc = FudgeCore;
    class GameState extends fc.Mutable {
        constructor() {
            super(...arguments);
            this.health = 100;
            this.score = 0;
            this.ammo = 15;
            this.highscore = 0;
            this.enemyDamage = 5;
        }
        reduceMutator(_mutator) { }
    }
    PHE.GameState = GameState;
    PHE.gameState = new GameState();
    class Hud {
        static start() {
            let domHud = document.querySelector("div#hud");
            Hud.controller = new fcui.Controller(PHE.gameState, domHud);
            Hud.controller.updateUserInterface();
        }
    }
    PHE.Hud = Hud;
})(PHE || (PHE = {}));
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
    let controlDifficulty = new fc.Control("ControlDifficulty", 1, 0 /* PROPORTIONAL */);
    let cmpAudioSoundtrack;
    let cmpAudioAmbience;
    /*  export let adShoot: fc.Audio;
     export let adReload: fc.Audio;
     export let adEmptyGun: fc.Audio;
     export let adZombie1: fc.Audio;
     export let adZombie2: fc.Audio;
     export let adSoundtrack: fc.Audio;
     export let audioAmbience: fc.Audio; */
    let canvas;
    let cmpCamera;
    let timer = true;
    let enemySpawnTime = 5000;
    window.addEventListener("load", start);
    async function start(_event) {
        PHE.root = new fc.Node("Root");
        PHE.root.addComponent(new fc.ComponentTransform());
        //await loadSound();
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
    /* async function loadSound(): Promise<void> {
        adShoot = await new fc.Audio("../Assets/Audio/soundtrack.mp3");
        adReload = await new fc.Audio("../Assets/Audio/Reloading-Magazine.mp3");
        adEmptyGun = await new fc.Audio("../Assets/Audio/empty-gun.mp3");
        adZombie1 = await fc.Audio.load("");
        adZombie2 = await fc.Audio.load("");
        adSoundtrack = await new fc.Audio("../Assets/Audio/soundtrack.mp3");
        //audioAmbience = await fc.Audio.load("");
    } */
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
        setDifficulty();
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
    function setDifficulty() {
        let difficulty = controlDifficulty.getOutput();
        switch (difficulty) {
            case 1:
                enemySpawnTime = 5000;
                PHE.gameState.enemyDamage = 5;
                break;
            case 2:
                enemySpawnTime = 3500;
                PHE.gameState.enemyDamage = 20;
                break;
            case 3:
                enemySpawnTime = 1000;
                PHE.gameState.enemyDamage = 50;
                break;
            default:
                break;
        }
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
        let txtZombie2 = new fc.TextureImage("../Assets/zombie.png");
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
        controlDifficulty.setInput(fc.Keyboard.mapToValue(1, 0, [fc.KEYBOARD_CODE.ONE])
            + fc.Keyboard.mapToValue(2, 0, [fc.KEYBOARD_CODE.TWO])
            + fc.Keyboard.mapToValue(3, 0, [fc.KEYBOARD_CODE.THREE]));
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
        let txtZombie2 = new fc.TextureImage("../Assets/zombie.png");
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
var PHE;
(function (PHE) {
    var fc = FudgeCore;
    class Wall extends PHE.GameObject {
        constructor(_size, _position, _material) {
            super("Wall", _size, _position);
            let cmpMaterial = new fc.ComponentMaterial(_material);
            this.addComponent(cmpMaterial);
        }
    }
    PHE.Wall = Wall;
})(PHE || (PHE = {}));
//# sourceMappingURL=Main.js.map