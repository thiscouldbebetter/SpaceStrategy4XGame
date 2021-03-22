"use strict";
class Buildable extends EntityProperty {
    constructor(defnName, pos, isComplete) {
        super();
        this.defnName = defnName;
        var loc = Disposition.fromPos(pos);
        this._locatable = new Locatable(loc);
        this.isComplete = (isComplete || false);
    }
    defn(world) {
        return world.buildableDefnByName(this.defnName);
    }
    locatable() {
        return this._locatable;
    }
    visual(world) {
        if (this._visual == null) {
            var defnVisual = this.defn(world).visual;
            if (this.isComplete) {
                this._visual = defnVisual;
            }
            else {
                this._visual = new VisualGroup([
                    defnVisual,
                    VisualText.fromTextAndColor("X", Color.byName("White"))
                ]);
            }
        }
        return this._visual;
    }
}
