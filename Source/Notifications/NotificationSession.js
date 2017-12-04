
function NotificationSession(notifications)
{
	this.notifications = notifications;
	this.notificationSelected = null;
}

{
	NotificationSession.prototype.controlBuild = function(universe)
	{
		var display = universe.display;
		var containerSize = display.sizeInPixels.clone();
		var controlHeight = containerSize.y / 12;
		var margin = 10;
		var columnWidth = containerSize.x - margin * 2;
		var buttonWidth = (containerSize.x - margin * 3) / 2;
		var fontHeightInPixels = display.fontHeightInPixels;

		var returnValue = new ControlContainer
		(
			"containerNotificationSession",
			new Coords(0, 0), // pos
			containerSize,
			// children
			[
				new ControlLabel
				(
					"labelNotifications",
					new Coords(margin, margin), // pos
					new Coords(columnWidth, controlHeight), // size
					false, // isTextCentered
					new DataBinding("Notifications:"),
					fontHeightInPixels
				),

				new ControlList
				(
					"listNotifications",
					new Coords(margin, margin + controlHeight), // pos
					new Coords(columnWidth, controlHeight * 4), // size
					new DataBinding(this.notifications),
					"toString()", // bindingExpressionForItemText
					fontHeightInPixels,
					// bindingForItemSelected
					new DataBinding(this, "notificationSelected"),
					null // bindingExpressionForItemValue
				),

				new ControlLabel
				(
					"labelMessage",
					new Coords(margin, margin * 2 + controlHeight * 5), // pos
					new Coords(columnWidth, controlHeight), // size
					false, // isTextCentered
					new DataBinding("Details:"),
					fontHeightInPixels
				),

				new ControlLabel
				(
					"textMessage",
					new Coords(margin, margin * 2 + controlHeight * 6), // pos
					new Coords(columnWidth, controlHeight), // size
					false, // isTextCentered
					new DataBinding(this, "notificationSelected.message"),
					fontHeightInPixels
				),

				new ControlButton
				(
					"buttonGoTo",
					new Coords(margin, margin * 2 + controlHeight * 7), // pos
					new Coords(buttonWidth, controlHeight), // size
					"Go To",
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						// todo
					}
				),

				new ControlButton
				(
					"buttonDismiss",
					new Coords(margin * 2 + buttonWidth, margin * 2 + controlHeight * 7), // pos
					new Coords(buttonWidth, controlHeight), // size
					"Dismiss",
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var session = universe.venueCurrent;
						var notification = session.notificationSelected;
						notification.hasBeenRead = true;
					}
				),

				new ControlButton
				(
					"buttonBack",
					new Coords(margin, containerSize.y - margin - controlHeight), // pos
					new Coords(columnWidth, controlHeight), // size
					"Back",
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var world = universe.world;
						var venueNext = new VenueWorld(world);
						venueNext = new VenueFader(venueNext, universe.venueCurrent);
						universe.venueNext = venueNext;
					}
				),
			]
		);

		return returnValue;
	}
}
