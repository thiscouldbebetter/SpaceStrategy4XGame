
class WorldExtended extends World
{
	buildableDefns: BuildableDefn[];
	technologyGraph: TechnologyGraph;
	starCluster: StarCluster;
	camera: Camera;

	private buildableDefnsByName: Map<string, BuildableDefn>;

	places: Place[];

	shouldDrawOnlyWhenUpdated: boolean;

	constructor
	(
		name: string,
		dateCreated: DateTime,
		activityDefns: ActivityDefn[],
		buildableDefns: BuildableDefn[],
		technologyGraph: TechnologyGraph,
		camera: Camera,
		starCluster: StarCluster
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

		this.places = [];
		if (starCluster != null)
		{
			this.starClusterSet(starCluster);
		}

		this.shouldDrawOnlyWhenUpdated = true;
	}

	static blank(universe: Universe): WorldExtended
	{
		var activityDefns = ArrayHelper.flattenArrayOfArrays
		([
			new ActivityDefn_Instances2()._All,
			ActivityDefn.Instances()._All
		]);

		var viewSize = universe.display.sizeInPixels.clone();
		var mapCellSizeInPixels = viewSize.clone().divideScalar(16).zSet(0); // hack

		var buildableDefns =
			// new BuildableDefnsBasic(mapCellSizeInPixels)._All;
			BuildableDefnsLegacy.Instance(mapCellSizeInPixels);

		var technologyGraph =
			// TechnologyGraph.demo(mapCellSizeInPixels);
			TechnologyGraph.legacy(mapCellSizeInPixels, buildableDefns);

		var viewDimension = viewSize.y;
		var focalLength = viewDimension;
		viewSize.z = focalLength;

		var camera = new Camera
		(
			viewSize,
			focalLength,
			Disposition.fromPos
			(
				new Coords(-viewDimension, 0, 0), //pos,
			),
			null // entitiesInViewSort
		);

		var returnValue = new WorldExtended
		(
			null, // name,
			DateTime.now(),
			activityDefns,
			buildableDefns._All,
			technologyGraph,
			camera,
			null // starCluster
		);

		return returnValue;
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

	saveFileNameStem(): string
	{
		var returnValue = StringHelper.spacesToUnderscores
		(
			this.name + "-Round_" + this.starCluster.roundNumberCurrent()
		);
		return returnValue;
	}

	starClusterSet(value: StarCluster): void
	{
		this.starCluster = value;

		this.name = this.starCluster.name;
		this.places.push(this.starCluster);
		this.places.push(...this.starCluster.nodes.map(x => x.starsystem) );
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
			this.starCluster.roundAdvanceUntilNotificationDisable();

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
	}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		var isFastForwarding = this.starCluster.roundsAreAdvancingUntilNotification();

		if (isFastForwarding)
		{
			var world = this;
			var factionCurrent = world.factionCurrent();
			var areThereAnyNotifications =
				factionCurrent.notificationsExist();

			if (areThereAnyNotifications)
			{
				this.starCluster.roundAdvanceUntilNotificationToggle(uwpe);
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
		var returnValue = new SaveStateWorldExtended().fromWorld(this);
		return returnValue;
	}
}

class SaveStateWorldExtended extends SaveStateWorld
{
	starCluster: StarCluster;

	constructor()
	{
		super
		(
			"-", // name
			"-", // placeName
			"-", // timePlayingAsString
			DateTime.now(), // timeSaved
			null // imageSnapshot
		);
	}

	fromWorld(world: World): SaveStateBase
	{
		var worldExtended = world as WorldExtended;

		this.world = null; // Important to keep file size down.
		this.starCluster = worldExtended.starCluster;
		return this;
	}

	toWorld(universe: Universe): World
	{
		var world = WorldExtended.blank(universe);
		world.starClusterSet(this.starCluster);
		return world;
	}

	// Loadable.

	load(): void
	{
		// todo
	}

	unload(): void
	{
		this.world = null;
	}
}