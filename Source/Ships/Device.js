"use strict";
class Device //
 {
    constructor(defn) {
        this.defn = defn;
    }
    updateForTurn(universe, world, place, entity) {
        this.defn.updateForTurn(universe, world, place, entity, this);
    }
    use(universe, world, place, entity) {
        this.defn.use(universe, world, place, entity, this);
    }
}
