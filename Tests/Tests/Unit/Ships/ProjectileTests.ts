
class ProjectileTests extends TestFixture
{
	constructor()
	{
		super(ProjectileTests.name);
	}

	tests(): ( () => void )[]
	{
		var returnTests = [ this.bodyDefnBuild ];

		return returnTests;
	}

	// Tests.

	bodyDefnBuild(): void
	{
		var bodyDefn = Projectile.bodyDefnBuild();
		Assert.isNotNull(bodyDefn);
	}
}

