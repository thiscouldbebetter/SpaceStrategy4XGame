"use strict";
class NotificationSessionTests extends TestFixture {
    constructor() {
        super(NotificationSessionTests.name);
    }
    // Setup.
    notificationBuild(universe) {
        var world = universe.world;
        var locus = world.network.nodes[0].starsystem.planets[0];
        return new Notification2(NotificationType.Instances()._All[0].name, 0, // turnCreated
        "[messsage]", locus);
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
            this.notificationGoTo,
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
        var notification = session.notifications[0];
        session.notificationDismiss(notification);
    }
    notificationGoTo() {
        var universe = this.universeBuild();
        var session = this.sessionBuild();
        var notification = session.notifications[0];
        session.notificationGoTo(universe, notification);
    }
    // Controls.
    toControl() {
        var session = this.sessionBuild();
        var universe = this.universeBuild();
        var sessionAsControl = session.toControl(universe, Coords.zeroes());
        Assert.isNotNull(sessionAsControl);
    }
}
