
class NotificationTypeTests extends TestFixture
{
	constructor()
	{
		super(NotificationTypeTests.name);
	}

	tests(): ( ()=>void )[]
	{
		return [ this.instances ];
	}

	instances(): void
	{
		var notificationTypes = NotificationType.Instances()._All;
		Assert.isNotNull(notificationTypes);
	}
}

