
class EnvironmentMock
{
	universeBuild(): Universe
	{
		var timerHelper = new TimerHelper(0);
		var display = DisplayTest.default();
		var mediaLibrary = MediaLibrary.default();
		var controlBuilder = new ControlBuilderExtended();

		var universe = new Universe
		(
			"TestUniverse",
			"[version]",
			timerHelper,
			display,
			mediaLibrary,
			controlBuilder,
			(u: Universe) =>
				WorldExtended.create(u)
		);

		universe.initialize(() => {});
		var uwpe = UniverseWorldPlaceEntities.fromUniverse(universe);
		universe.worldCreate().initialize(uwpe);
		universe.updateForTimerTick();

		return universe;
	}
}
