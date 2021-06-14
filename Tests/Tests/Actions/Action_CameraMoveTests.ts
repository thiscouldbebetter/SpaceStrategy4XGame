
class Action_CameraMoveTests extends TestFixture
{
	constructor()
	{
		super(Action_CameraMoveTests.name);
	}

	tests(): ( ()=>void )[]
	{
		return [ this.perform ];
	}

	perform(): void
	{
		var camera = Camera.default();

		var displacementsRightDown = [0, 0];
		var action = new Action_CameraMove(displacementsRightDown);
		action.perform(camera);
	}
}
