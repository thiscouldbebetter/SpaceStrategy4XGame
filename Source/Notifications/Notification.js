"use strict";
class Notification2 {
    constructor(defnName, turnCreated, message, locus) {
        this.defnName = defnName;
        this.turnCreated = turnCreated;
        this.message = message;
        this.locus = locus;
    }
    defn() {
        return NotificationType.Instances()._AllByName.get(this.defnName);
    }
    toString() {
        var returnValue = this.turnCreated + " - "
            + this.locus.toString() + " - "
            + this.message;
        return returnValue;
    }
}
