"use strict";
class Body extends EntityProperty {
    constructor(name, defn, pos) {
        super();
        this.name = name;
        this.defn = defn;
        var loc = Disposition.fromPos(pos);
        this._locatable = new Locatable(loc);
    }
    locatable() {
        return this._locatable;
    }
}
