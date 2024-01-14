
class WorldExtended extends World
{
	buildableDefns: BuildableDefn[];
	technologyGraph: TechnologyGraph;
	starCluster: StarCluster;
	camera: Camera;

	private buildableDefnsByName: Map<string, BuildableDefn>;

	roundsSoFar: number;

	places: Place[];

	shouldDrawOnlyWhenUpdated: boolean;

	constructor
	(
		name: string,
		dateCreated: DateTime,
		activityDefns: ActivityDefn[],
		buildableDefns: BuildableDefn[],
		technologyGraph: TechnologyGraph,
		starCluster: StarCluster,
		camera: Camera
	)
	{
		super
		(
			name,
			dateCreated,
			new WorldDefn
			([
				activityDefns
			]), // worldDefn
			(placeName) =>
			{
				return this.places.find(x => x.name == placeName)
			}, // placeGetByName
			(starCluster == null ? "dummy" : starCluster.name)
		);

		this.buildableDefns = buildableDefns;
		this.technologyGraph = technologyGraph;
		this.starCluster = starCluster;
		this.camera = camera;

		this.dateSaved = this.dateCreated;

		this.buildableDefnsByName = ArrayHelper.addLookupsByName(this.buildableDefns);

		this.roundsSoFar = 0;
		this._isAdvancingThroughRoundsUntilNotification = false;

		this.places = [];
		this.places.push(this.starCluster);
		this.places.push(...this.starCluster.nodes.map(x => x.starsystem) );

		this.shouldDrawOnlyWhenUpdated = true;
	}

	// instance methods

	activityDefnByName(activityDefnName: string): ActivityDefn
	{
		return this.defn.activityDefnByName(activityDefnName);
	}

	buildableDefnAdd(buildableDefn: BuildableDefn): void
	{
		this.buildableDefns.push(buildableDefn);
		this.buildableDefnsByName.set(buildableDefn.name, buildableDefn);
	}

	buildableDefnByName(buildableDefnName: string): BuildableDefn
	{
		return this.buildableDefnsByName.get(buildableDefnName);
	}

	buildableDefnRemove(buildableDefn: BuildableDefn): void
	{
		this.buildableDefns.splice(this.buildableDefns.indexOf(buildableDefn), 1);
		this.buildableDefnsByName.delete(buildableDefn.name);
	}

	factionCurrent(): Faction
	{
		return this.starCluster.factionCurrent();
	}

	factionPlayer(): Faction
	{
		return this.starCluster.factionPlayer();
	}

	factions(): Faction[]
	{
		return this.starCluster.factions;
	}

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		this.starCluster.initialize(uwpe);
	}

	private _isAdvancingThroughRoundsUntilNotification: boolean;
	isAdvancingThroughRoundsUntilNotification(): boolean
	{
		return this._isAdvancingThroughRoundsUntilNotification;
	}

	private _mapCellSizeInPixels: Coords;
	mapCellSizeInPixels(universe: Universe)
	{
		if (this._mapCellSizeInPixels == null)
		{
			var viewSize = universe.display.sizeInPixels;
			this._mapCellSizeInPixels = viewSize.clone().divideScalar(16).zSet(0);
		}
		return this._mapCellSizeInPixels;
	}

	notificationsExist(): boolean
	{
		var faction = this.factionCurrent();
		var notificationSession = faction.notificationSession;
		var areThereAnyNotifications = notificationSession.notificationsExist();
		return areThereAnyNotifications;
	}

	placeForEntityLocatable(entityLocatable: Entity): any
	{
		return this.starCluster.placeForEntityLocatable(entityLocatable);
	}

	roundAdvanceUntilNotificationDisable(): void
	{
		this._isAdvancingThroughRoundsUntilNotification = false;
	}

	roundAdvanceUntilNotificationToggle(uwpe: UniverseWorldPlaceEntities): void
	{
		this._isAdvancingThroughRoundsUntilNotification =
			(this._isAdvancingThroughRoundsUntilNotification == false);
	}

	roundNumberCurrent(): number
	{
		return this.roundsSoFar + 1;
	}

	toVenue(): VenueWorld
	{
		return new VenueStarCluster(this);
	}

	updateForRound(uwpe: UniverseWorldPlaceEntities): void
	{
		var universe = uwpe.universe;

		var factionCurrent = this.factionCurrent();
		var notificationsBlocking =
			factionCurrent.notificationsForRoundAddToArray(universe, []);

		if (notificationsBlocking.length > 0)
		{
			this.roundAdvanceUntilNotificationDisable();

			factionCurrent.notificationsAdd(notificationsBlocking);
			factionCurrent.notificationSessionStart
			(
				universe, universe.display.sizeInPixels.clone().half()
			);
		}
		else 
		{
			this.updateForRound_IgnoringNotifications(uwpe);
		}
	}

	updateForRound_IgnoringNotifications(uwpe: UniverseWorldPlaceEntities): void
	{
		var universe = uwpe.universe;
		uwpe.world = this;
		var world = this as WorldExtended;

		this.starCluster.updateForRound(universe, world);

		this.roundsSoFar++;
	}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		var isFastForwarding = this.isAdvancingThroughRoundsUntilNotification();

		if (isFastForwarding)
		{
			var world = this;
			var factionCurrent = world.factionCurrent();
			var areThereAnyNotifications =
				factionCurrent.notificationsExist();

			if (areThereAnyNotifications)
			{
				this.roundAdvanceUntilNotificationToggle(uwpe);
				factionCurrent.notificationSessionStart
				(
					uwpe.universe,
					uwpe.universe.display.sizeInPixels.clone().half()
				);
			}
			else
			{
				world.updateForRound(uwpe);
			}
		}

		this.timerTicksSoFar++;
	}

	// Saving.

	toSaveState(universe: Universe): SaveStateBase
	{
		return super.toSaveState(universe); // todo
	}
}