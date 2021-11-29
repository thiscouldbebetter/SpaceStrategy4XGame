
class NotificationSession
{
	factionName: string;
	notifications: Notification2[];

	notificationSelected: Notification2;

	constructor(factionName: string, notifications: Notification2[])
	{
		this.factionName = factionName;
		this.notifications = notifications;

		this.notificationSelected = null;
	}

	notificationAdd(notification: Notification2)
	{
		this.notifications.push(notification);
	}

	notificationDismiss(notification: Notification2)
	{
		var notificationIndex = this.notifications.indexOf(notification);
		ArrayHelper.remove(this.notifications, notification);
		this.notificationSelected = this.notifications[notificationIndex];
	}

	notificationGoTo(universe: Universe, notification: Notification2)
	{
		var notificationLoc = notification.locus;
		var notificationLocType = notificationLoc.constructor.name;
		if (notificationLocType == TechnologyResearcher.name)
		{
			var factionName = notificationLoc;
			var faction = (universe.world as WorldExtended).factionByName(factionName);
			faction.researchSessionStart(universe);
		}
		else if (notificationLocType == Starsystem.name)
		{
			alert("todo - Go to Starsystem");
		}
		else if (notificationLocType == Planet.name)
		{
			var planet = notificationLoc;
			var planetLayout = null; // todo
			var venueCurrent = universe.venueCurrent;
			var venueNext: Venue =
				new VenueLayout(venueCurrent, planet, planetLayout);
			venueNext = VenueFader.fromVenuesToAndFrom(venueNext, venueCurrent);
			universe.venueNext = venueNext;
		}
		else
		{
			throw "Unrecognized notification type."
		}
	}

	// controls

	toControl(universe: Universe)
	{
		var display = universe.display;
		var containerSize = display.sizeInPixels.clone();
		var controlHeight = containerSize.y / 12;
		var margin = 10;
		var columnWidth = containerSize.x - margin * 2;
		var buttonWidth = (containerSize.x - margin * 4) / 3;
		var fontHeightInPixels = display.fontHeightInPixels;

		var returnValue = ControlContainer.from4
		(
			"containerNotificationSession",
			Coords.fromXY(0, 0), // pos
			containerSize,
			// children
			[
				new ControlLabel
				(
					"labelNotifications",
					Coords.fromXY(margin, margin), // pos
					Coords.fromXY(columnWidth, controlHeight), // size
					false, // isTextCentered
					DataBinding.fromContext("Notifications:"),
					fontHeightInPixels
				),

				ControlList.from8
				(
					"listNotifications",
					Coords.fromXY(margin, margin + controlHeight), // pos
					Coords.fromXY(columnWidth, controlHeight * 4), // size
					DataBinding.fromContextAndGet
					(
						this,
						(c: NotificationSession) => c.notifications
					),
					DataBinding.fromGet
					(
						(c: Notification) => c.toString(),
					), // bindingForItemText
					fontHeightInPixels,
					// bindingForItemSelected
					new DataBinding
					(
						this,
						(c: NotificationSession) => c.notificationSelected,
						(c: NotificationSession, v: Notification2) => c.notificationSelected = v
					),
					DataBinding.fromContext(null) // bindingForItemValue
				),

				new ControlLabel
				(
					"labelMessage",
					Coords.fromXY(margin, margin * 2 + controlHeight * 5), // pos
					Coords.fromXY(columnWidth, controlHeight), // size
					false, // isTextCentered
					DataBinding.fromContext("Details:"),
					fontHeightInPixels
				),

				new ControlLabel
				(
					"textMessage",
					Coords.fromXY(margin, margin * 2 + controlHeight * 6), // pos
					Coords.fromXY(columnWidth, controlHeight), // size
					false, // isTextCentered
					DataBinding.fromContextAndGet
					(
						this,
						(c: NotificationSession) =>
							(c.notificationSelected == null ? "[none]" : c.notificationSelected.message)
					),
					fontHeightInPixels
				),

				ControlButton.from8
				(
					"buttonGoTo",
					Coords.fromXY(margin, margin * 2 + controlHeight * 7), // pos
					Coords.fromXY(buttonWidth, controlHeight), // size
					"Go To",
					fontHeightInPixels,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					() => // click
					{
						var world = universe.world as WorldExtended;
						var faction = world.factions[0]; // hack
						var notificationSession = faction.notificationSession;
						var notification = notificationSession.notificationSelected;
						notificationSession.notificationGoTo(universe, notification);
					}
				),

				ControlButton.from8
				(
					"buttonDismiss",
					Coords.fromXY(margin * 2 + buttonWidth, margin * 2 + controlHeight * 7), // pos
					Coords.fromXY(buttonWidth, controlHeight), // size
					"Dismiss",
					fontHeightInPixels,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					() => // click
					{
						var world = universe.world as WorldExtended;
						var faction = world.factions[0]; // hack
						var notificationSession = faction.notificationSession;
						var notification = notificationSession.notificationSelected;
						notificationSession.notificationDismiss(notification);
					}
				),

				ControlButton.from8
				(
					"buttonDismissAll",
					Coords.fromXY
					(
						margin * 3 + buttonWidth * 2,
						margin * 2 + controlHeight * 7
					), // pos
					Coords.fromXY(buttonWidth, controlHeight), // size
					"Dismiss All",
					fontHeightInPixels,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					() => // click
					{
						var world = universe.world as WorldExtended;
						var faction = world.factions[0]; // hack
						var notificationSession = faction.notificationSession;
						var notifications = notificationSession.notifications;
						notifications.length = 0;
					}
				),

				new ControlLabel
				(
					"textMessage",
					Coords.fromXY(margin, containerSize.y - margin * 2 - controlHeight * 2), // pos
					Coords.fromXY(columnWidth, controlHeight), // size
					false, // isTextCentered
					DataBinding.fromContext
					(
						"All notifications must be dismissed before turn can be ended."
					),
					fontHeightInPixels
				),

				ControlButton.from8
				(
					"buttonBack",
					Coords.fromXY(margin, containerSize.y - margin - controlHeight), // pos
					Coords.fromXY(columnWidth, controlHeight), // size
					"Back",
					fontHeightInPixels,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					() => // click
					{
						var world = universe.world;
						var venueNext: Venue = world.toVenue();
						venueNext = VenueFader.fromVenuesToAndFrom
						(
							venueNext, universe.venueCurrent
						);
						universe.venueNext = venueNext;
					}
				),
			]
		);

		return returnValue;
	}
}
