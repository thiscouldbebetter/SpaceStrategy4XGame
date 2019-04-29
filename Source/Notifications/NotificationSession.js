
function NotificationSession(factionName, notifications)
{
	this.factionName = factionName;
	this.notifications = notifications;

	this.notificationSelected = null;
}

{
	NotificationSession.prototype.notificationDismiss = function(notification)
	{
		var notificationIndex = this.notifications.indexOf(notification);
		this.notifications.remove(notification);
		this.notificationSelected = this.notifications[notificationIndex];
	};

	NotificationSession.prototype.notificationGoTo = function(universe, notification)
	{
		var notificationLoc = notification.loc;
		var notificationLocType = notificationLoc.constructor.name;
		if (notificationLocType == "TechnologyResearcher")
		{
			var factionName = notificationLoc.factionName;
			var faction = universe.world.factions[factionName];
			faction.researchSessionStart(universe);
		}
		else if (notificationLocType == "Starsystem")
		{
			alert("todo - Go to Starsystem");
		}
		else if (notificationLocType == "Planet")
		{
			var planet = notificationLoc;
			var venueCurrent = universe.venueCurrent;
			var venueNext = new VenueLayout(venueCurrent, planet, planet.layout);
			venueNext = new VenueFader(venueNext, venueCurrent);
			universe.venueNext = venueNext;
		}
		else
		{
			throw "Unrecognized notification type."
		}
	};

	// controls

	NotificationSession.prototype.controlBuild = function(universe)
	{
		var display = universe.display;
		var containerSize = display.sizeInPixels.clone();
		var controlHeight = containerSize.y / 12;
		var margin = 10;
		var columnWidth = containerSize.x - margin * 2;
		var buttonWidth = (containerSize.x - margin * 4) / 3;
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
						var world = universe.world;
						var faction = world.factions[0]; // hack
						var notificationSession = faction.notificationSession;
						var notification = notificationSession.notificationSelected;
						notificationSession.notificationGoTo(universe, notification);
					},
					universe // context
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
						var world = universe.world;
						var faction = world.factions[0]; // hack
						var notificationSession = faction.notificationSession;
						var notification = notificationSession.notificationSelected;
						notificationSession.notificationDismiss(notification);
					},
					universe // context
				),

				new ControlButton
				(
					"buttonDismissAll",
					new Coords(margin * 3 + buttonWidth * 2, margin * 2 + controlHeight * 7), // pos
					new Coords(buttonWidth, controlHeight), // size
					"Dismiss All",
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var world = universe.world;
						var faction = world.factions[0]; // hack
						var notificationSession = faction.notificationSession;
						var notifications = notificationSession.notifications;
						notifications.length = 0;
					},
					universe // context
				),

				new ControlLabel
				(
					"textMessage",
					new Coords(margin, containerSize.y - margin * 2 - controlHeight * 2), // pos
					new Coords(columnWidth, controlHeight), // size
					false, // isTextCentered
					"All notifications must be dismissed before turn can be ended.",
					fontHeightInPixels
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
					},
					universe // context
				),
			]
		);

		return returnValue;
	};
}
