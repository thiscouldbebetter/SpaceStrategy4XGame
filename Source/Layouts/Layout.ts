
class Layout
{
	sizeInPixels: Coords;
	map: MapLayout;

	constructor(sizeInPixels: Coords, map: MapLayout)
	{
		this.sizeInPixels = sizeInPixels;
		this.map = map;
	}

	// instance methods

	buildableEntitiesRemove(buildableEntitiesToRemove: Entity[]): void
	{
		buildableEntitiesToRemove.forEach(x => this.buildableEntityRemove(x));
	}

	buildableEntityBuild(buildableEntityToBuild: Entity): void
	{
		var buildableEntityInProgress = this.buildableEntityInProgress();
		if (buildableEntityInProgress != null)
		{
			if (buildableEntityInProgress != buildableEntityToBuild)
			{
				this.buildableEntityRemove(buildableEntityInProgress);
			}
		}

		var buildables = this.map.bodies;
		buildables.push(buildableEntityToBuild);
	}

	buildableEntityInProgress(): Entity
	{
		return this.map.bodies.find
		(
			x => Buildable.fromEntity(x).isComplete == false
		);
	}

	buildableEntityRemove(buildableEntityToRemove: Entity): void
	{
		var bodies = this.map.bodies;
		bodies.splice
		(
			bodies.indexOf(buildableEntityToRemove), 1
		);
	}

	// turnable

	facilities(): Entity[]
	{
		return this.map.bodies;
	}

	initialize(universe: Universe): void
	{
		// todo
	}

	updateForTurn(universe: Universe, world: World, faction: Faction, parentModel: Entity): void
	{
		// todo
	}

	// drawable

	draw(universe: Universe, display: Display): void
	{
		display.drawBackground(null, null);

		this.map.draw(universe, display);
	}
}
