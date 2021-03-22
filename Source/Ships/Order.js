"use strict";
class Order {
    constructor(defnName, target) {
        this.defnName = defnName;
        this.target = target;
        this.isComplete = false;
    }
    defn() {
        return OrderDefn.Instances()._AllByName.get(this.defnName);
    }
    obey(universe, actor) {
        if (this.isComplete) {
            actor.order = null;
        }
        else {
            this.defn().obey(universe, actor, this);
        }
    }
}
