"use strict";
class Notification2Tests extends TestFixture {
    constructor() {
        super(Notification2Tests.name);
    }
    tests() {
        var returnValues = [
            this.jumpTo,
            this.toString
        ];
        return returnValues;
    }
    notificationBuild() {
        return new Notification2("[messsage]", () => { } // jumpTo
        );
    }
    // Tests.
    jumpTo() {
        var notification = this.notificationBuild();
        notification.jumpTo();
    }
    toString() {
        var notification = this.notificationBuild();
        var notificationAsString = notification.toString();
        Assert.isNotNull(notificationAsString);
    }
}
