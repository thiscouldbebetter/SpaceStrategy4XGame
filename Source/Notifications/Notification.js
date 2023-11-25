"use strict";
class Notification2 {
    constructor(defnName, turnCreated, message, locus) {
        this.defnName = defnName;
        this.turnCreated = turnCreated;
        this.message = message;
        this.locus = locus;
    }
    defn() {
        return (this.defnName == null ? null : NotificationType.byName(this.defnName));
    }
    jumpTo(universe) {
        this.locus.jumpTo(universe);
    }
    toString() {
        var returnValue = this.turnCreated + " - "
            + this.locus.name + " - "
            + this.message;
        return returnValue;
    }
}
