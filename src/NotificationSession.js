
function NotificationSession(notifications)
{
	this.notifications = notifications;
	this.notificationSelected = null;
}

{
	NotificationSession.prototype.controlBuild = function()
	{
		var displayHelper = Globals.Instance.displayHelper;
		var containerSize = displayHelper.viewSize.clone();
		var controlHeight = containerSize.y / 12;
		var margin = 10;
		var columnWidth = containerSize.x - margin * 2;
		var buttonWidth = (columnWidth - margin) / 2;

		var returnValue = new ControlContainer
		(
			"containerNotificationSession",
			ControlBuilder.ColorsForeAndBackDefault,
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
					new DataBinding("Notifications:")
				),

				new ControlSelect
				(
					"listNotifications",
					new Coords(margin, margin + controlHeight), // pos
					new Coords(columnWidth, controlHeight * 4), // size
					// dataBindingForValueSelected
					new DataBinding(this, "notificationSelected"), 
					// dataBindingForOptions
					new DataBinding(this.notifications),
					null, // bindingExpressionForOptionValues
					"message", // bindingExpressionForOptionText
					new DataBinding(true), // dataBindingForIsEnabled
					4 // numberOfItemsVisible
				),

				new ControlLabel
				(
					"labelMessage",
					new Coords(margin, margin * 2 + controlHeight * 5), // pos
					new Coords(columnWidth, controlHeight), // size
					false, // isTextCentered
					new DataBinding("Details:")
				),

				new ControlLabel
				(
					"textMessage",
					new Coords(margin, margin * 2 + controlHeight * 6), // pos
					new Coords(columnWidth, controlHeight), // size
					false, // isTextCentered
					new DataBinding(this, "notificationSelected.message")
				),

				new ControlButton
				(
					"buttonGoTo",
					new Coords(margin, margin * 2 + controlHeight * 7), // pos
					new Coords(columnWidth, controlHeight), // size
					"Go To",
					null, // dataBindingForIsEnabled
					// click
					function()
					{
						alert("todo - goto");
					}
				),


				new ControlButton
				(
					"buttonDone",
					new Coords(margin, containerSize.y - margin - controlHeight), // pos
					new Coords(columnWidth, controlHeight), // size
					"Done",
					null, // dataBindingForIsEnabled
					// click
					function()
					{
						var universe = Globals.Instance.universe;
						var world = universe.world;
						var venueNext = new VenueWorld(world);
						venueNext = new VenueFader(venueNext);
						universe.venueNext = venueNext;
					}
				),
			]
		);

		return returnValue;
	}
}
