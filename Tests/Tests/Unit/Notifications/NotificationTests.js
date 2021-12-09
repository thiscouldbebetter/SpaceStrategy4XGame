"use strict";
class Notification2Tests extends TestFixture {
    constructor() {
        super(Notification2Tests.name);
    }
    tests() {
        var returnValues = [
            this.defn,
            this.toString
        ];
        return returnValues;
    }
    notificationBuild() {
        return new Notification2(NotificationType.Instances()._All[0].name, 0, // turnCreated
        "[messsage]", "[locus]");
    }
    // Tests.
    defn() {
        var notification = this.notificationBuild();
        var notificationDefn = notification.defn();
        Assert.isNotNull(notificationDefn);
    }
    toString() {
        var notification = this.notificationBuild();
        var notificationAsString = notification.toString();
        Assert.isNotNull(notificationAsString);
    }
}
