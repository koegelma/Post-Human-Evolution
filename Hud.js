"use strict";
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
//# sourceMappingURL=Hud.js.map