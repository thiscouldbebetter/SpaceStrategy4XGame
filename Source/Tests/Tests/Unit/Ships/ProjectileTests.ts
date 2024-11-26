
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
		var projectileDefn = ProjectileDefn.Instances().Default;
		var bodyDefn = Projectile.bodyDefnBuild(projectileDefn);
		Assert.isNotNull(bodyDefn);
	}
}

