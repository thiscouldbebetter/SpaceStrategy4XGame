
class VisualElevationStem implements VisualBase
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

		var starsystem = (universe.venueCurrent as VenueStarsystem).starsystem;
		if (starsystem == null)
		{
			return;
		}
		var camera = starsystem.camera2(universe);

		var entity = uwpe.entity;
		var drawablePosWorld = entity.locatable().loc.pos;
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

	// Clonable.
	clone(): VisualBase { return this; }
	overwriteWith(other: VisualBase): VisualBase { return this; }
	
	// Transformable.
	transform(transform: TransformBase): VisualBase { return this; }
}
