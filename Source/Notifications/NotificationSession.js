"use strict";
class NotificationSession {
    constructor(factionName, notifications) {
        this.factionName = factionName;
        this._notifications = notifications;
        this.notificationSelected = null;
    }
    clear() {
        this._notifications.length = 0;
    }
    notificationAdd(notification) {
        this._notifications.push(notification);
    }
    notificationDismiss(notification) {
        var notifications = this.notifications();
        var notificationIndex = notifications.indexOf(notification);
        ArrayHelper.remove(notifications, notification);
        this.notificationSelected = notifications[notificationIndex];
    }
    notificationSelectedDismiss(universe) {
        var world = universe.world;
        var faction = world.factions[0]; // hack
        var notificationSession = faction.notificationSession;
        var notification = notificationSession.notificationSelected;
        notificationSession.notificationDismiss(notification);
        var areThereAnyMoreNotifications = notificationSession.notificationsExist();
        if (areThereAnyMoreNotifications == false) {
            var venueNext = world.toVenue();
            universe.venueTransitionTo(venueNext);
        }
    }
    notificationSelectedGoTo(universe) {
        var notification = this.notificationSelected;
        this.notificationDismiss(notification);
        if (this.notificationsExist() == false) {
            universe.venueCurrentRemove(); // Don't return to the notifications list if empty.
        }
        notification.jumpTo();
    }
    notificationsAllDismiss(universe) {
        var world = universe.world;
        // var faction = world.factions[0]; // hack
        // var notificationSession = faction.notificationSession;
        this.clear();
        var venueNext = world.toVenue();
        universe.venueTransitionTo(venueNext);
    }
    notifications() {
        return this._notifications;
    }
    notificationsExist() {
        return this._notifications.length > 0;
    }
    // controls
    toControl(universe, containerSize) {
        var notificationSession = this;
        var controlHeight = containerSize.y / 16;
        var margin = 10;
        var columnWidth = containerSize.x - margin * 2;
        var buttonCount = 3;
        var buttonWidth = (containerSize.x - margin * 4) / buttonCount;
        var fontHeightInPixels = controlHeight / 2;
        var fontNameAndHeight = FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);
        var listHeight = controlHeight * 8;
        var buttonPosY = containerSize.y - margin * 2 - controlHeight * 2;
        var labelNotifications = ControlLabel.from4Uncentered(Coords.fromXY(margin, margin), // pos
        Coords.fromXY(columnWidth, controlHeight), // size
        DataBinding.fromContext("Notifications:"), fontNameAndHeight);
        var listNotifications = ControlList.from8("listNotifications", Coords.fromXY(margin, margin + controlHeight), // pos
        Coords.fromXY(columnWidth, listHeight), // size
        DataBinding.fromContextAndGet(this, (c) => c.notifications()), DataBinding.fromGet((c) => c.toString()), // bindingForItemText
        fontNameAndHeight, 
        // bindingForItemSelected
        new DataBinding(this, (c) => c.notificationSelected, (c, v) => c.notificationSelected = v), DataBinding.fromContext(null) // bindingForItemValue
        );
        var labelSelected = ControlLabel.from4Uncentered(Coords.fromXY(margin, margin * 2 + controlHeight + listHeight), // pos
        Coords.fromXY(columnWidth, controlHeight), // size
        DataBinding.fromContext("Selected:"), fontNameAndHeight);
        var textNotificationSelected = ControlLabel.from4Uncentered(Coords.fromXY(margin, margin * 2 + controlHeight * 2 + listHeight), // pos
        Coords.fromXY(columnWidth, controlHeight), // size
        DataBinding.fromContextAndGet(this, (c) => (c.notificationSelected == null ? "[none]" : c.notificationSelected.message)), fontNameAndHeight);
        var dataBindingIsEnabled = DataBinding.fromContextAndGet(this, (c) => (c.notificationSelected != null));
        var buttonGoToSelected = ControlButton.from8("buttonGoToSelected", Coords.fromXY(margin, buttonPosY), // pos
        Coords.fromXY(buttonWidth, controlHeight), // size
        "Go To Selected", fontNameAndHeight, true, // hasBorder
        dataBindingIsEnabled, () => notificationSession.notificationSelectedGoTo(universe) // click
        );
        var buttonDismissSelected = ControlButton.from8("buttonDismissSelected", Coords.fromXY(margin * 2 + buttonWidth * 1, buttonPosY), // pos
        Coords.fromXY(buttonWidth, controlHeight), // size
        "Dismiss Selected", fontNameAndHeight, true, // hasBorder
        dataBindingIsEnabled, () => notificationSession.notificationSelectedDismiss(universe) // click
        );
        var buttonDismissAll = ControlButton.from5(Coords.fromXY(margin * 3 + buttonWidth * 2, buttonPosY), // pos
        Coords.fromXY(buttonWidth, controlHeight), // size
        "Dismiss All", fontNameAndHeight, () => notificationSession.notificationsAllDismiss(universe) // click
        );
        var textMessage = ControlLabel.from4Uncentered(Coords.fromXY(margin, containerSize.y - margin - controlHeight), // pos
        Coords.fromXY(columnWidth, controlHeight), // size
        DataBinding.fromContext("All notifications must be handled before the round can be ended."), fontNameAndHeight);
        var returnValue = ControlContainer.from4("Alerts", Coords.fromXY(0, 0), // pos
        containerSize, 
        // children
        [
            labelNotifications,
            listNotifications,
            labelSelected,
            textNotificationSelected,
            buttonGoToSelected,
            buttonDismissSelected,
            buttonDismissAll,
            textMessage
            //buttonBack
        ]);
        return returnValue;
    }
    toControl_Single(universe, containerSize) {
        var notificationSession = this;
        var notifications = notificationSession.notifications();
        this.notificationSelected = notifications[0];
        var controlHeight = containerSize.y / 16;
        var margin = 10;
        var columnWidth = containerSize.x - margin * 2;
        var buttonCount = 3;
        var buttonWidth = (containerSize.x - margin * 4) / buttonCount;
        var fontHeightInPixels = controlHeight / 2;
        var fontNameAndHeight = FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);
        var listHeight = controlHeight * 8;
        var buttonPosY = containerSize.y - margin * 2 - controlHeight * 2;
        var textNotificationSingle = ControlLabel.from4Uncentered(Coords.fromXY(margin, margin * 2 + controlHeight * 2 + listHeight), // pos
        Coords.fromXY(columnWidth, controlHeight), // size
        DataBinding.fromContextAndGet(this, (c) => c.notificationSelected.message), fontNameAndHeight);
        var dataBindingIsEnabled = DataBinding.fromContextAndGet(this, (c) => (c.notificationSelected != null));
        var buttonGoTo = ControlButton.from8("buttonGoTo", Coords.fromXY(margin, buttonPosY), // pos
        Coords.fromXY(buttonWidth, controlHeight), // size
        "Go To", fontNameAndHeight, true, // hasBorder
        dataBindingIsEnabled, () => notificationSession.notificationSelectedGoTo(universe) // click
        );
        var buttonDismiss = ControlButton.from8("buttonDismiss", Coords.fromXY(margin * 2 + buttonWidth * 1, buttonPosY), // pos
        Coords.fromXY(buttonWidth, controlHeight), // size
        "Dismiss Selected", fontNameAndHeight, true, // hasBorder
        dataBindingIsEnabled, () => notificationSession.notificationSelectedDismiss(universe) // click
        );
        var containerPos = universe.display.sizeInPixels.clone().subtract(containerSize).half();
        var returnValue = ControlContainer.from4("containerNotificationSingle", containerPos, containerSize, 
        // children
        [
            textNotificationSingle,
            buttonGoTo,
            buttonDismiss
        ]);
        return returnValue;
    }
}
