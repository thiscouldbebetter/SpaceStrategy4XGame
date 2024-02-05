"use strict";
class Notification2 {
    constructor(message, jumpTo) {
        this.message = message;
        this._jumpTo = jumpTo;
    }
    jumpTo() {
        this._jumpTo();
    }
    toString() {
        var returnValue = this.message;
        return returnValue;
    }
}
