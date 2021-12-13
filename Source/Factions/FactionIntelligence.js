"use strict";
class FactionIntelligence {
    constructor(name, chooseMove) {
        this.name = name;
        this.chooseMove = chooseMove;
    }
    static demo() {
        return new FactionIntelligence("Demo", FactionIntelligence.demoChooseMove);
    }
    static demoChooseMove(universe) {
        // todo
    }
}
