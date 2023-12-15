
class WorldExtended extends World
{
	buildableDefns: BuildableDefn[];
	deviceDefns: DeviceDefn[];
	technologyGraph: TechnologyGraph;
	network: Network2;
	factions: Faction[];
	ships: Ship[];
	camera: Camera;

	private buildableDefnsByName: Map<string, BuildableDefn>;
	private deviceDefnsByName: Map<string, DeviceDefn>;
	private factionsByName: Map<string, Faction>;

	factionIndexCurrent: number;
	roundsSoFar: number;

	places: Place[];

	shouldDrawOnlyWhenUpdated: boolean;

	constructor
	(
		name: string,
		dateCreated: DateTime,
		activityDefns: ActivityDefn[],
		buildableDefns: BuildableDefn[],
		deviceDefns: DeviceDefn[],
		technologyGraph: TechnologyGraph,
		network: Network2,
		factions: Faction[],
		ships: Ship[],
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
			(network == null ? "dummy" : network.name)
		);

		this.buildableDefns = buildableDefns;
		this.deviceDefns = deviceDefns;
		this.technologyGraph = technologyGraph;
		this.network = network;
		this.factions = factions;
		this.ships = ships;
		this.camera = camera;

		this.dateSaved = this.dateCreated;

		this.buildableDefnsByName = ArrayHelper.addLookupsByName(this.buildableDefns);
		this.deviceDefnsByName = ArrayHelper.addLookupsByName(this.deviceDefns);
		this.factionsByName = ArrayHelper.addLookupsByName(this.factions);
		//this.shipsByName = ArrayHelper.addLookupsByName(this.ships);

		this.defn.itemDefnsInitialize([]);
		// this.defn.itemDefns.push(...deviceDefns);
		var buildableDefnsNonDevice = this.buildableDefns.filter(
			x => this.deviceDefnsByName.has(x.name) == false
		);
		var itemDefns = buildableDefnsNonDevice.map(x => ItemDefn.fromName(x.name) );
		this.defn.itemDefns.push(...itemDefns);
		this.defn.itemDefnsByName = ArrayHelper.addLookupsByName(this.defn.itemDefns);

		this.roundsSoFar = 0;
		this._isAdvancingThroughRoundsUntilNotification = false;
		this.factionIndexCurrent = 0;

		this.places = [];
		this.places.push(this.network);
		this.places.push(...this.network.nodes.map(x => x.starsystem) );

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

	deviceDefnByName(deviceDefnName: string): DeviceDefn
	{
		return this.deviceDefnsByName.get(deviceDefnName);
	}

	factionAdd(faction: Faction): void
	{
		this.factions.push(faction);
		this.factionsByName.set(faction.name, faction);
	}

	factionByName(factionName: string): Faction
	{
		return this.factionsByName.get(factionName);
	}

	factionCurrent(): Faction
	{
		return this.factions[this.factionIndexCurrent];
	}

	factionsOtherThanCurrent(): Faction[]
	{
		return this.factionsOtherThan(this.factionCurrent());
	}

	factionsOtherThan(faction: Faction): Faction[]
	{
		return this.factions.filter
		(
			x => x.name != faction.name
		);
	}

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		// Do nothing.
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
		return this.network.placeForEntityLocatable(entityLocatable);
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
		return new VenueWorldExtended(this);
	}

	updateForRound(uwpe: UniverseWorldPlaceEntities): void
	{
		var universe = uwpe.universe;

		var factionCurrent = this.factionCurrent();
		var notificationsBlocking = factionCurrent.notificationsForRoundAddToArray(universe, []);

		if (notificationsBlocking.length > 0)
		{
			this.roundAdvanceUntilNotificationDisable();

			factionCurrent.notificationsAdd(notificationsBlocking);
			factionCurrent.notificationSessionStart(universe);
		}
		else
		{
			uwpe.world = this;
			var world = universe.world as WorldExtended;

			this.network.updateForRound(universe, world);
			this.factions.forEach(x => x.updateForRound(universe, world) );

			this.roundsSoFar++;
		}
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
				factionCurrent.notificationSessionStart(uwpe.universe);
			}
			else
			{
				world.updateForRound(uwpe);
			}
		}

		this.timerTicksSoFar++;
	}
}