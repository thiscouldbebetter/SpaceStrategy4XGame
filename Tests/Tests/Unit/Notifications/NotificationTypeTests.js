"use strict";
class NotificationTypeTests extends TestFixture {
    constructor() {
        super(NotificationTypeTests.name);
    }
    tests() {
        return [this.instances];
    }
    instances() {
        var notificationTypes = NotificationType.Instances()._All;
        Assert.isNotNull(notificationTypes);
    }
}
