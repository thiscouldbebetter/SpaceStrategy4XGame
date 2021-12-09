
class Notification2Tests extends TestFixture
{
	constructor()
	{
		super(Notification2Tests.name);
	}

	tests(): ( ()=>void )[]
	{
		var returnValues =
		[
			this.defn,
			this.toString
		];

		return returnValues;
	}

	notificationBuild(): Notification2
	{
		return new Notification2
		(
			NotificationType.Instances()._All[0].name,
			0, // turnCreated
			"[messsage]",
			"[locus]"
		);
	}

	// Tests.

	defn(): void
	{
		var notification = this.notificationBuild();
		var notificationDefn = notification.defn();
		Assert.isNotNull(notificationDefn);
	}

	toString(): void
	{
		var notification = this.notificationBuild();
		var notificationAsString = notification.toString();
		Assert.isNotNull(notificationAsString);
	}
}
