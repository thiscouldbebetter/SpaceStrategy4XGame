
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
			this.jumpTo,
			this.toString
		];

		return returnValues;
	}

	notificationBuild(): Notification2
	{
		return new Notification2
		(
			"[messsage]",
			() => {} // jumpTo
		);
	}

	// Tests.

	jumpTo(): void
	{
		var notification = this.notificationBuild();
		notification.jumpTo();
	}

	toString(): void
	{
		var notification = this.notificationBuild();
		var notificationAsString = notification.toString();
		Assert.isNotNull(notificationAsString);
	}
}
