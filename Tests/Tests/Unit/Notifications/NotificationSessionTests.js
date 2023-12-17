"use strict";
class NotificationSessionTests extends TestFixture {
    constructor() {
        super(NotificationSessionTests.name);
    }
    // Setup.
    notificationBuild(universe) {
        return new Notification2("[messsage]", () => { });
    }
    sessionBuild() {
        var factionName = "[factionName]";
        var notification = this.notificationBuild(this.universeBuild());
        var notifications = [notification];
        return new NotificationSession(factionName, notifications);
    }
    universeBuild() {
        return new EnvironmentMock().universeBuild();
    }
    // Tests.
    tests() {
        var returnValues = [
            this.notificationAdd,
            this.notificationDismiss,
            this.toControl
        ];
        return returnValues;
    }
    notificationAdd() {
        var session = this.sessionBuild();
        var notificationToAdd = this.notificationBuild(this.universeBuild());
        session.notificationAdd(notificationToAdd);
    }
    notificationDismiss() {
        var session = this.sessionBuild();
        var notificationsAll = session.notifications();
        var notification = notificationsAll[0];
        session.notificationDismiss(notification);
    }
    // Controls.
    toControl() {
        var session = this.sessionBuild();
        var universe = this.universeBuild();
        var sessionAsControl = session.toControl(universe, Coords.zeroes());
        Assert.isNotNull(sessionAsControl);
    }
}
