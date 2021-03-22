"use strict";
class Device {
    constructor(defn) {
        this.defn = defn;
    }
    updateForTurn(universe, actor) {
        this.defn.updateForTurn(universe, actor, this);
    }
    use(universe, place, actor) {
        this.defn.use(universe, place, actor, this);
    }
}
