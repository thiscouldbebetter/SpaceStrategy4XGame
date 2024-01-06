
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

	buildableDefnStartBuildingAtPos
	(
		universe: Universe,
		buildableDefn: BuildableDefn,
		posToBuildAt: Coords
	): void
	{
		var buildable = Buildable.fromDefnAndPosIncomplete
		(
			buildableDefn, posToBuildAt
		);
		var world = universe.world as WorldExtended;
		var buildableEntity = buildable.toEntity(world);
		this.buildableEntityBuild(buildableEntity);
	}

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

		this.map.entityAdd(buildableEntityToBuild);
	}

	buildableEntityInProgress(): Entity
	{
		return this.map.entities().find
		(
			x => Buildable.ofEntity(x).isComplete == false
		);
	}

	buildableEntityRemove(buildableEntityToRemove: Entity): void
	{
		this.map.entityRemove(buildableEntityToRemove);
	}

	facilities(): Entity[]
	{
		return this.map.entities();
	}

	initialize(universe: Universe): void
	{
		// todo
	}

	notificationsForRoundAddToArray
	(
		universe: Universe,
		world: WorldExtended,
		faction: Faction,
		planet: Planet,
		notificationsSoFar: Notification2[]
	): Notification2[]
	{
		return notificationsSoFar; // todo
	}

	shieldsArePresentInOrbit(): boolean
	{
		var entities = this.map.entities();
		var areThereShieldsInOrbit = entities.some
		(
			x =>
			{
				var buildable = Buildable.ofEntity(x);
				var defn = buildable.defn;
				var isOrbitalShield =
					defn.categoryIsOrbital()
					&& defn.categoryIsShield();
				return isOrbitalShield;
			}
		);
		return areThereShieldsInOrbit;
	}

	updateForRound
	(
		universe: Universe,
		world: World,
		faction: Faction,
		parentModel: Entity
	): void
	{
		// todo
	}

	// drawable

	draw(universe: Universe, display: Display): void
	{
		this.map.draw(universe, display);
	}
}
