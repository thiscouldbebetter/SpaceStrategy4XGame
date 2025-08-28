
class VisualElevationStem implements Visual<VisualElevationStem>
{
	drawPosTip: Coords;
	drawPosPlane: Coords;

	constructor()
	{
		// Helper variables.
		this.drawPosTip = Coords.create();
		this.drawPosPlane = Coords.create();
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display)
	{
		var universe = uwpe.universe;

		var starsystem = (universe.venueCurrent() as VenueStarsystem).starsystem;
		if (starsystem == null)
		{
			return;
		}
		var camera = starsystem.camera2(universe);

		var entity = uwpe.entity;

		var drawablePosWorld = Locatable.of(entity).loc.pos;

		var drawPosTip = camera.coordsTransformWorldToView
		(
			this.drawPosTip.overwriteWith(drawablePosWorld)
		);

		var drawPosPlane = camera.coordsTransformWorldToView
		(
			this.drawPosPlane.overwriteWith(drawablePosWorld).clearZ()
		);

		var colorName = (drawablePosWorld.z < 0 ? "Green" : "Red");

		display.drawLine
		(
			drawPosTip, drawPosPlane, Color.byName(colorName), null
		);
	}

	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	initializeIsComplete(): boolean { return true; }

	// Clonable.
	clone(): VisualElevationStem { return this; }
	overwriteWith(other: VisualBase): VisualElevationStem { return this; }
	
	// Transformable.
	transform(transform: TransformBase): VisualElevationStem { return this; }
}
