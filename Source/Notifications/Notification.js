"use strict";
class Notification2 {
    constructor(message, jumpTo) {
        this.message = message;
        this._jumpTo = jumpTo;
    }
    // static jumpTo(message: string, jumpTo: () => void): Notification2
    // {
    // return new Notification2(message, jumpTo);
    // }
    jumpTo() {
        this._jumpTo();
    }
    toString() {
        var returnValue = this.message;
        return returnValue;
    }
}
