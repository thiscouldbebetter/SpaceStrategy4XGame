
class NotificationSession
{
	factionName: string;
	_notifications: Notification2[];

	notificationSelected: Notification2;

	constructor(factionName: string, notifications: Notification2[])
	{
		this.factionName = factionName;
		this._notifications = notifications;

		this.notificationSelected = null;
	}

	clear(): void
	{
		this._notifications.length = 0;
	}

	notificationAdd(notification: Notification2): void
	{
		this._notifications.push(notification);
	}

	notificationDismiss(notification: Notification2): void
	{
		var notifications = this.notifications();
		var notificationIndex = notifications.indexOf(notification);
		ArrayHelper.remove(notifications, notification);
		this.notificationSelected = notifications[notificationIndex];
	}

	notificationGoTo(universe: Universe, notification: Notification2): void
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
			var venueCurrent = universe.venueCurrent();
			var venueNext =
				new VenueLayout(venueCurrent, planet, planetLayout);
			universe.venueTransitionTo(venueNext);
		}
		else
		{
			throw "Unrecognized notification type."
		}
	}

	notificationsDismissAll(): void
	{
		this.clear();
	}

	notifications(): Notification2[]
	{
		return this._notifications;
	}

	notificationsExist(): boolean
	{
		return this._notifications.length > 0;
	}

	// controls

	toControl
	(
		universe: Universe, containerSize: Coords
	): ControlBase
	{
		var notificationSession = this;

		var display = universe.display;
		var controlHeight = containerSize.y / 16;
		var margin = 10;
		var columnWidth = containerSize.x - margin * 2;
		var buttonCount = 4;
		var buttonWidth = (containerSize.x - margin * 5) / buttonCount;
		var fontHeightInPixels = display.fontNameAndHeight.heightInPixels;
		var fontNameAndHeight =
			FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);
		var listHeight = controlHeight * 8;
		var buttonPosY = containerSize.y - margin * 2 - controlHeight * 2;

		var labelNotifications = ControlLabel.from4Uncentered
		(
			Coords.fromXY(margin, margin), // pos
			Coords.fromXY(columnWidth, controlHeight), // size
			DataBinding.fromContext("Notifications:"),
			fontNameAndHeight
		);

		var listNotifications = ControlList.from8
		(
			"listNotifications",
			Coords.fromXY(margin, margin + controlHeight), // pos
			Coords.fromXY(columnWidth, listHeight), // size
			DataBinding.fromContextAndGet
			(
				this,
				(c: NotificationSession) => c.notifications()
			),
			DataBinding.fromGet
			(
				(c: Notification) => c.toString(),
			), // bindingForItemText
			fontNameAndHeight,
			// bindingForItemSelected
			new DataBinding
			(
				this,
				(c: NotificationSession) => c.notificationSelected,
				(c: NotificationSession, v: Notification2) => c.notificationSelected = v
			),
			DataBinding.fromContext(null) // bindingForItemValue
		);

		var labelSelected = ControlLabel.from4Uncentered
		(
			Coords.fromXY(margin, margin * 2 + controlHeight + listHeight), // pos
			Coords.fromXY(columnWidth, controlHeight), // size
			DataBinding.fromContext("Selected:"),
			fontNameAndHeight
		);

		var textNotificationSelected = ControlLabel.from4Uncentered
		(
			Coords.fromXY(margin, margin * 2 + controlHeight * 2 + listHeight), // pos
			Coords.fromXY(columnWidth, controlHeight), // size
			DataBinding.fromContextAndGet
			(
				this,
				(c: NotificationSession) =>
					(c.notificationSelected == null ? "[none]" : c.notificationSelected.message)
			),
			fontNameAndHeight
		);

		var buttonGoTo = ControlButton.from5
		(
			Coords.fromXY
			(
				margin, buttonPosY
			), // pos
			Coords.fromXY(buttonWidth, controlHeight), // size
			"Go To",
			fontNameAndHeight,
			() => // click
			{
				var notification = notificationSession.notificationSelected;
				notification.jumpTo(universe);
			}
		);

		var buttonGoToAndDismiss = ControlButton.from5
		(
			Coords.fromXY
			(
				margin * 2 + buttonWidth, buttonPosY
			), // pos
			Coords.fromXY(buttonWidth, controlHeight), // size
			"Go To + Dismiss",
			fontNameAndHeight,
			() => // click
			{
				var notification = notificationSession.notificationSelected;
				notificationSession.notificationDismiss(notification);
				notification.jumpTo(universe);
			}
		);

		var buttonDismiss = ControlButton.from5
		(
			Coords.fromXY
			(
				margin * 3 + buttonWidth * 2, buttonPosY
			), // pos
			Coords.fromXY(buttonWidth, controlHeight), // size
			"Dismiss",
			fontNameAndHeight,
			() => // click
			{
				var world = universe.world as WorldExtended;
				var faction = world.factions[0]; // hack
				var notificationSession = faction.notificationSession;
				var notification = notificationSession.notificationSelected;
				notificationSession.notificationDismiss(notification);
			}
		);

		var buttonDismissAll = ControlButton.from5
		(
			Coords.fromXY
			(
				margin * 4 + buttonWidth * 3, buttonPosY
			), // pos
			Coords.fromXY(buttonWidth, controlHeight), // size
			"Dismiss All",
			fontNameAndHeight,
			() => // click
			{
				var world = universe.world as WorldExtended;
				var faction = world.factions[0]; // hack
				var notificationSession = faction.notificationSession;
				notificationSession.notificationsDismissAll();
			}
		);

		var textMessage = ControlLabel.from4Uncentered
		(
			Coords.fromXY(margin, containerSize.y - margin - controlHeight), // pos
			Coords.fromXY(columnWidth, controlHeight), // size
			DataBinding.fromContext
			(
				"All notifications must be dismissed before turn can be ended."
			),
			fontNameAndHeight
		);

		var buttonBack = ControlButton.from5
		(
			Coords.fromXY
			(
				containerSize.x - margin - buttonWidth,
				containerSize.y - margin - controlHeight
			), // pos
			Coords.fromXY(buttonWidth, controlHeight), // size
			"Back",
			fontNameAndHeight,
			() => // click
			{
				var world = universe.world;
				var venueNext: Venue = world.toVenue();
				universe.venueTransitionTo(venueNext);
			}
		);

		var returnValue = ControlContainer.from4
		(
			"Alerts",
			Coords.fromXY(0, 0), // pos
			containerSize,
			// children
			[
				labelNotifications,
				listNotifications,
				labelSelected,
				textNotificationSelected,
				buttonGoTo,
				buttonGoToAndDismiss,
				buttonDismiss,
				buttonDismissAll,
				textMessage,
				buttonBack
			]
		);

		return returnValue;
	}
}
