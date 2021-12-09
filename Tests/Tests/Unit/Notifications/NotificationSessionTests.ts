
class NotificationSessionTests extends TestFixture
{
	constructor() // factionName: string, notifications: Notification2[])
	{
		super(NotificationSessionTests.name);
	}

	// Setup.

	notificationBuild(universe: Universe): Notification2
	{
		var world = universe.world as WorldExtended;
		var locus = world.network.nodes[0].starsystem.planets[0];

		return new Notification2
		(
			NotificationType.Instances()._All[0].name,
			0, // turnCreated
			"[messsage]",
			locus
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
			this.notificationGoTo,
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
		var notification = session.notifications[0];

		session.notificationDismiss(notification);
	}

	notificationGoTo(): void
	{
		var universe = this.universeBuild();

		var session = this.sessionBuild();
		var notification = session.notifications[0];
		session.notificationGoTo(universe, notification);
	}

	// Controls.

	toControl(): void // universe: Universe)
	{
		var session = this.sessionBuild();
		var universe = this.universeBuild();

		var sessionAsControl = session.toControl(universe);
		Assert.isNotNull(sessionAsControl);
	}
}
