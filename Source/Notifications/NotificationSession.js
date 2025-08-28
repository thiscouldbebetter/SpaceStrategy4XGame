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
        var faction = world.factionPlayer();
        var notificationSession = faction.notificationSession;
        var notification = notificationSession.notificationSelected;
        notificationSession.notificationDismiss(notification);
        var areThereAnyMoreNotifications = notificationSession.notificationsExist();
        if (areThereAnyMoreNotifications == false) {
            var venueNext = world.toVenue();
            universe.venueJumpTo(venueNext);
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
    toControl(universe, containerSize, fontHeightInPixels) {
        return this.toControl_Single(universe, containerSize, fontHeightInPixels);
    }
    toControl_Multiple(universe, containerSize, fontHeightInPixels) {
        var notificationSession = this;
        fontHeightInPixels = fontHeightInPixels || universe.display.fontNameAndHeight.heightInPixels;
        var controlHeight = containerSize.y / 16;
        var margin = fontHeightInPixels;
        var columnWidth = containerSize.x - margin * 2;
        var buttonCount = 3;
        var buttonWidth = (containerSize.x - margin * 4) / buttonCount;
        var fontNameAndHeight = FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);
        var listHeight = controlHeight * 8;
        var buttonPosY = containerSize.y - margin * 2 - controlHeight * 2;
        var labelNotifications = ControlLabel.fromPosSizeTextFontUncentered(Coords.fromXY(margin, margin), // pos
        Coords.fromXY(columnWidth, controlHeight), // size
        DataBinding.fromContext("Notifications:"), fontNameAndHeight);
        var listNotifications = ControlList.fromNamePosSizeItemsTextFontSelectedValue("listNotifications", Coords.fromXY(margin, margin + controlHeight), // pos
        Coords.fromXY(columnWidth, listHeight), // size
        DataBinding.fromContextAndGet(this, (c) => c.notifications()), DataBinding.fromGet((c) => c.toString()), // bindingForItemText
        fontNameAndHeight, 
        // bindingForItemSelected
        new DataBinding(this, (c) => c.notificationSelected, (c, v) => c.notificationSelected = v), DataBinding.fromContext(null) // bindingForItemValue
        );
        var labelSelected = ControlLabel.fromPosSizeTextFontUncentered(Coords.fromXY(margin, margin * 2 + controlHeight + listHeight), // pos
        Coords.fromXY(columnWidth, controlHeight), // size
        DataBinding.fromContext("Selected:"), fontNameAndHeight);
        var textNotificationSelected = ControlLabel.fromPosSizeTextFontUncentered(Coords.fromXY(margin, margin * 2 + controlHeight * 2 + listHeight), // pos
        Coords.fromXY(columnWidth, controlHeight), // size
        DataBinding.fromContextAndGet(this, (c) => (c.notificationSelected == null ? "[none]" : c.notificationSelected.message)), fontNameAndHeight);
        var dataBindingIsEnabled = DataBinding.fromContextAndGet(this, (c) => (c.notificationSelected != null));
        var buttonGoToSelected = ControlButton.fromNamePosSizeTextFontBorderEnabledClick("buttonGoToSelected", Coords.fromXY(margin, buttonPosY), // pos
        Coords.fromXY(buttonWidth, controlHeight), // size
        "Go To Selected", fontNameAndHeight, true, // hasBorder
        dataBindingIsEnabled, () => notificationSession.notificationSelectedGoTo(universe) // click
        );
        var buttonDismissSelected = ControlButton.fromNamePosSizeTextFontBorderEnabledClick("buttonDismissSelected", Coords.fromXY(margin * 2 + buttonWidth * 1, buttonPosY), // pos
        Coords.fromXY(buttonWidth, controlHeight), // size
        "Dismiss Selected", fontNameAndHeight, true, // hasBorder
        dataBindingIsEnabled, () => notificationSession.notificationSelectedDismiss(universe) // click
        );
        var buttonDismissAll = ControlButton.from5(Coords.fromXY(margin * 3 + buttonWidth * 2, buttonPosY), // pos
        Coords.fromXY(buttonWidth, controlHeight), // size
        "Dismiss All", fontNameAndHeight, () => notificationSession.notificationsAllDismiss(universe) // click
        );
        var textMessage = ControlLabel.fromPosSizeTextFontUncentered(Coords.fromXY(margin, containerSize.y - margin - controlHeight), // pos
        Coords.fromXY(columnWidth, controlHeight), // size
        DataBinding.fromContext("All notifications must be handled before the round can be ended."), fontNameAndHeight);
        var returnValue = ControlContainer.fromNamePosSizeAndChildren("Alerts", Coords.fromXY(0, 0), // pos
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
    toControl_Single(universe, containerSize, fontHeightInPixels) {
        fontHeightInPixels = fontHeightInPixels || universe.display.fontNameAndHeight.heightInPixels;
        var notificationSession = this;
        var notifications = notificationSession.notifications();
        this.notificationSelected = notifications[0];
        var margin = fontHeightInPixels;
        var marginAsCoords = Coords.fromXY(1, 1).multiplyScalar(margin);
        var containerSizeMinusMargins = containerSize.clone().subtract(marginAsCoords).subtract(marginAsCoords);
        var buttonCount = 2;
        var buttonWidth = (containerSizeMinusMargins.x - margin) / buttonCount;
        var buttonHeight = margin * 2;
        var buttonSize = Coords.fromXY(buttonWidth, buttonHeight);
        var textNotificationSingleSize = Coords.fromXY(containerSizeMinusMargins.x, containerSizeMinusMargins.y - margin - buttonHeight);
        var fontNameAndHeight = FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);
        var buttonPosY = containerSize.y - margin - buttonHeight;
        var textNotificationSingle = ControlLabel.fromPosSizeTextFontCentered(Coords.fromXY(margin, margin), // pos
        textNotificationSingleSize, DataBinding.fromContextAndGet(this, (c) => (c.notificationSelected == null ? "[none]" : c.notificationSelected.message)), fontNameAndHeight);
        var buttonGoTo = ControlButton.from5(Coords.fromXY(margin, buttonPosY), // pos
        buttonSize, "Go To", fontNameAndHeight, () => notificationSession.notificationSelectedGoTo(universe) // click
        );
        var buttonDismiss = ControlButton.from5(Coords.fromXY(margin * 2 + buttonWidth * 1, buttonPosY), // pos
        buttonSize, "Dismiss", fontNameAndHeight, () => notificationSession.notificationSelectedDismiss(universe) // click
        );
        var containerPos = universe.display.sizeInPixels.clone().subtract(containerSize).half();
        var returnValue = ControlContainer.fromNamePosSizeAndChildren("containerNotificationSingle", containerPos, containerSize, 
        // children
        [
            textNotificationSingle,
            buttonGoTo,
            buttonDismiss
        ]);
        return returnValue;
    }
}
