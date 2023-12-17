
class NotificationSessionTests extends TestFixture
{
	constructor() // factionName: string, notifications: Notification2[])
	{
		super(NotificationSessionTests.name);
	}

	// Setup.

	notificationBuild(universe: Universe): Notification2
	{
		return new Notification2
		(
			"[messsage]",
			() => {}
		);
	}

	sessionBuild(): NotificationSession
	{
		var factionName = "[factionName]";
		var notification = this.notificationBuild(this.universeBuild());
		var notifications = [ notification ];
		return new NotificationSession(factionName, notifications);
	}

	universeBuild(): Universe
	{
		return new EnvironmentMock().universeBuild();
	}

	// Tests.

	tests(): ( ()=>void )[]
	{
		var returnValues =
		[
			this.notificationAdd,
			this.notificationDismiss,
			this.toControl
		];

		return returnValues;
	}

	notificationAdd(): void
	{
		var session = this.sessionBuild();
		var notificationToAdd = this.notificationBuild(this.universeBuild());
		session.notificationAdd(notificationToAdd);
	}

	notificationDismiss(): void
	{
		var session = this.sessionBuild();
		var notificationsAll = session.notifications();
		var notification = notificationsAll[0];

		session.notificationDismiss(notification);
	}

	// Controls.

	toControl(): void // universe: Universe)
	{
		var session = this.sessionBuild();
		var universe = this.universeBuild();

		var sessionAsControl = session.toControl(universe, Coords.zeroes());
		Assert.isNotNull(sessionAsControl);
	}
}
