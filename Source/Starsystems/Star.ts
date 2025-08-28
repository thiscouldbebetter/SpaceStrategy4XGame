
class Star extends Entity
{
	defnName: string;
	starType: StarType;

	constructor
	(
		name: string,
		starType: StarType,
		pos: Coords
	)
	{
		super
		(
			name,
			[
				starType.bodyDefn(),
				new Controllable(Star.toControl),
				Drawable.fromVisual(starType.visualProjected() ),
				Locatable.fromPos(pos)
			]
		);

		this.starType = starType;
	}

	static fromNameStarTypeAndPos(name: string, starType: StarType, pos: Coords)
	{
		return new Star(name, starType, pos);
	}

	// instance methods

	starsystem(world: WorldExtended): Starsystem
	{
		var starClusterNodeFound = world.starCluster.nodes.find
		(
			x => (x.starsystem.star == this)
		);

		var starsystemFound =
		(
			starClusterNodeFound == null ? null : starClusterNodeFound.starsystem
		);
		return starsystemFound;
	}

	toEntity(): Entity
	{
		return this;
	}

	toStringDescription(world: WorldExtended): string
	{
		var returnValue =
			this.name;

		return returnValue;
	}

	// controls

	static toControl
	(
		uwpe: UniverseWorldPlaceEntities,
		size: Coords,
		controlTypeName: string
	): ControlBase
	{
		var universe = uwpe.universe;
		var star = uwpe.entity as Star;
		var returnValue =
			star.toControl(universe, size);
		return returnValue;
	}

	toControl(universe: Universe, size: Coords): ControlBase
	{
		var returnValue = ControlContainer.fromNamePosSizeAndChildren
		(
			"containerStar",
			Coords.fromXY(0, 0), // pos
			size,
			[
				new ControlLabel
				(
					"labelName",
					Coords.fromXY(0, 0), // pos
					Coords.fromXY(size.x, 0), // size
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext(this.name),
					FontNameAndHeight.fromHeightInPixels(10)
				)
			]
		);

		return returnValue;
	}
}
