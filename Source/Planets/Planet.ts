
class Planet extends Entity
{
	defnName: string;
	planetType: PlanetType;
	demographics: PlanetDemographics;
	industry: PlanetIndustry;
	private _layout: Layout;
	resourcesAccumulated: Resource[];
	ships: Ship[];

	deviceSelected: Device;

	_resourcesThisRound: Resource[];
	_resourcesThisRoundByName: Map<string, Resource>;

	constructor
	(
		name: string,
		planetType: PlanetType,
		pos: Coords,
		faction: Faction,
		demographics: PlanetDemographics,
		industry: PlanetIndustry,
		layout: Layout
	)
	{
		super
		(
			name,
			[
				planetType.bodyDefn(),
				Collidable.fromCollider
				(
					Sphere.fromRadiusAndCenter
					(
						VisualStar.radiusActual(), pos
					)
				),
				new Controllable(Planet.toControl),
				new DeviceUser(),
				new Factionable(faction),
				ItemHolder.create(),
				Locatable.fromPos(pos)
			]
		);

		this.planetType = planetType;
		this.demographics = demographics;
		this.industry = industry;
		this._layout = layout;

		this.ships = [];

		this.resourcesAccumulated =
		[
			new Resource("Industry", 0),
			new Resource("Prosperity", 0)
		];
	}

	static fromNameTypeAndPos(name: string, planetType: PlanetType, pos: Coords): Planet
	{
		return new Planet
		(
			name,
			planetType,
			pos,
			null, // faction
			null, // demographics
			null, // industry
			null // layout
		);
	}

	// instance methods

	cellPositionsAvailableToBuildBuildableDefn
	(
		universe: Universe,
		buildableDefn: BuildableDefn
	): Coords[]
	{
		var returnValues = new Array<Coords>();

		var layout = this.layout(universe);
		var layoutMap = layout.map;
		var mapSizeInCells = layoutMap.sizeInCells;
		var cellPosInCells = Coords.create();

		for (var y = 0; y < mapSizeInCells.y; y++)
		{
			cellPosInCells.y = y;

			for (var x = 0; x < mapSizeInCells.x; x++)
			{
				cellPosInCells.x = x;

				var canBuildableBeBuiltOnTerrain =
					buildableDefn.canBeBuiltOnMapAtPosInCells(layoutMap, cellPosInCells);

				if (canBuildableBeBuiltOnTerrain)
				{
					var bodyAtPos = layoutMap.bodyAtPosInCells(cellPosInCells);

					var isVacant = (bodyAtPos == null);

					if (isVacant)
					{
						var bodiesNeighboring =
							layoutMap.bodiesNeighboringPosInCells(cellPosInCells);
						if (bodiesNeighboring.length > 0)
						{
							returnValues.push(cellPosInCells.clone());
						}
					}
				}
			}
		}

		return returnValues;
	}

	cellPositionsAvailableToBuildOnSurface(universe: Universe): Coords[]
	{
		var returnValues = new Array<Coords>();

		var layout = this.layout(universe);
		var layoutMap = layout.map;
		var mapSizeInCells = layoutMap.sizeInCells;
		var cellPosInCells = Coords.create();

		for (var y = 0; y < mapSizeInCells.y; y++)
		{
			cellPosInCells.y = y;

			for (var x = 0; x < mapSizeInCells.x; x++)
			{
				cellPosInCells.x = x;

				var terrainAtPos = layoutMap.terrainAtPosInCells(cellPosInCells);
				var isSurface = terrainAtPos.isSurface();

				if (isSurface)
				{
					var bodyAtPos = layoutMap.bodyAtPosInCells(cellPosInCells);

					var isVacant = (bodyAtPos == null);

					if (isVacant)
					{
						var bodiesNeighboring =
							layoutMap.bodiesNeighboringPosInCells(cellPosInCells);
						if (bodiesNeighboring.length > 0)
						{
							returnValues.push(cellPosInCells.clone());
						}
					}
				}
			}
		}

		return returnValues;
	}

	cellPositionsAvailableToOccupyInOrbit(universe: Universe): Coords[]
	{
		var returnValues = new Array<Coords>();

		var layout = this.layout(universe);
		var layoutMap = layout.map;
		var mapSizeInCells = layoutMap.sizeInCells;
		var cellPosInCells = Coords.create();

		var terrainOrbit = layoutMap.terrainByName("Orbit");

		for (var y = 0; y < mapSizeInCells.y; y++)
		{
			cellPosInCells.y = y;

			for (var x = 0; x < mapSizeInCells.x; x++)
			{
				cellPosInCells.x = x;

				var terrainAtPos = layoutMap.terrainAtPosInCells(cellPosInCells);
				var isOrbit = (terrainAtPos == terrainOrbit);

				if (isOrbit)
				{
					var bodyAtPos = layoutMap.bodyAtPosInCells(cellPosInCells);

					var isVacant = (bodyAtPos == null);

					if (isVacant)
					{
						returnValues.push(cellPosInCells.clone());
					}
				}
			}
		}

		return returnValues;
	}

	faction(): Faction
	{
		return this.factionable().faction();
	}

	factionable(): Factionable
	{
		return this.propertyByName(Factionable.name) as Factionable;
	}

	isAwaitingTarget(): boolean
	{
		return (this.deviceSelected != null);
	}

	jumpTo(universe: Universe): void
	{
		var venuePlanet = new VenueLayout
		(
			universe.venueCurrent(),
			this, // modelParent
			this.layout(universe)
		);
		universe.venueTransitionTo(venuePlanet);
	}

	layout(universe: Universe): Layout
	{
		if (this._layout == null)
		{
			this._layout = this.planetType.layoutCreate(universe);
		}

		return this._layout;
	}

	notificationsForRoundAddToArray
	(
		universe: Universe, world: WorldExtended, faction: Faction, notificationsSoFar: Notification2[]
	): Notification2[]
	{
		var layout = this.layout(universe);
		layout.notificationsForRoundAddToArray(universe, world, faction, this, notificationsSoFar);

		this.industry.notificationsForRoundAddToArray(universe, world, this, notificationsSoFar);

		this.demographics.notificationsForRoundAddToArray(notificationsSoFar);

		return notificationsSoFar;
	}

	shipAddToOrbit(shipToAdd: Ship): void
	{
		this.ships.push(shipToAdd);
		shipToAdd.locatable().loc.placeName = Planet.name + ":" + this.name;
	}

	shipLeaveOrbit(shipToLeaveOrbit: Ship, world: WorldExtended): void
	{
		ArrayHelper.remove(this.ships, shipToLeaveOrbit);
		var shipLoc = shipToLeaveOrbit.locatable().loc;
		var planetPos = this.locatable().loc.pos;
		var starsystem = this.starsystem(world);
		shipLoc.placeName = Starsystem.name + starsystem.name;
		shipLoc.pos.overwriteWith(planetPos); // todo - offset.
		starsystem.shipAdd(shipToLeaveOrbit, world);
	}

	starsystem(world: WorldExtended): Starsystem
	{
		var starClusterNodeFound = world.starCluster.nodes.find
		(
			x => (x.starsystem.planets.indexOf(this) >= 0)
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

	toPlace(): Place
	{
		return new PlanetAsPlace(this);
	}
	
	toStringDescription(universe: Universe, world: WorldExtended): string
	{
		var resourcesThisRoundAsString =
			this.resourcesThisRound(universe, world).join(", ");

		var returnValue =
			this.name
			+ " - " + this.demographics.toStringDescription()
			+ " - " + resourcesThisRoundAsString
			+ " - " + this.industry.toStringDescription(universe, world, this)
			+ ".";

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
		var planet = uwpe.entity as Planet;
		var returnValue =
			planet.toControl_Starsystem(universe, size);
		return returnValue;
	}

	toControl_Starsystem(universe: Universe, size: Coords): ControlBase
	{
		var returnValue = ControlContainer.from4
		(
			"containerPlanet",
			Coords.fromXY(0, 0), // pos
			size,
			[
				ControlLabel.from4Uncentered
				(
					Coords.fromXY(0, 0), // pos
					Coords.fromXY(size.x, 0), // size
					DataBinding.fromContext(this.name),
					FontNameAndHeight.fromHeightInPixels(10)
				)
			]
		);

		return returnValue;
	}

	// Demographics.

	population(): number
	{
		return this.demographics.population;
	}

	populationAdd(universe: Universe, amountToAdd: number): void
	{
		this.demographics.populationAdd(universe, this, amountToAdd);
	}
	
	populationIncrement(universe: Universe): void
	{
		this.populationAdd(universe, 1);
	}

	populationIdle(universe: Universe): number
	{
		return this.demographics.populationIdle(universe, this);
	}

	populationIdleExists(universe: Universe): boolean
	{
		return this.populationIdle(universe) > 0;
	}

	private _populationMax: number;
	populationMax(): number
	{
		if (this._populationMax == null)
		{
			this._populationMax = this.planetType.size.populationMax();
		}
		return this._populationMax;
	}

	populationMaxAdd(populationToAdd: number): void
	{
		this._populationMax += populationToAdd;
	}

	populationOccupied(universe: Universe): number
	{
		return this.demographics.populationOccupied(universe, this);
	}

	populationOverMaxPlusIdle(universe: Universe): string
	{
		var populationCurrent = this.demographics.population;
		var populationIdle = this.populationIdle(universe);
		var returnValue =
			"" + populationCurrent + "/" + this.populationMax()
			+ " (Idle: " + populationIdle + ")";

		return returnValue;
	}

	prosperityAccumulated(): number
	{
		return this.resourcesAccumulated.find(x => x.defnName == "Prosperity").quantity;
	}

	prosperityNetWithNeededToGrow(universe: Universe): string
	{
		var prosperityNet = this.prosperityThisRound
		(
			universe, universe.world as WorldExtended, null
		);
		var prosperityAccumulated = this.prosperityAccumulated();
		var prosperityNeededToGrow =
			this.demographics.prosperityNeededToGrow();
		var returnValue =
			"+" + prosperityNet + "(" + prosperityAccumulated + "/" + prosperityNeededToGrow + " to grow)";
		return returnValue;
	}

	// diplomacy

	strategicValue(world: WorldExtended): number
	{
		return 1; // todo
	}

	// turns

	updateForRound
	(
		universe: Universe, world: WorldExtended, faction: Faction
	): void
	{
		if (faction != null)
		{
			this.resourcesThisRoundReset();

			var layout = this.layout(universe);
			layout.updateForRound(universe, world, faction, null);
			this.demographics.updateForRound(universe, world, faction, this);
			this.industry.updateForRound(universe, world, faction, this);
		}
	}

	// resources

	buildableEntitiesRemove(universe: Universe, entities: Entity[]): void
	{
		this.layout(universe).buildableEntitiesRemove(entities);
	}

	buildableEntityBuild(universe: Universe, entity: Entity): void
	{
		this.layout(universe).buildableEntityBuild(entity);
	}

	buildableEntityInProgress(universe: Universe): Entity
	{
		return this.layout(universe).buildableEntityInProgress();
	}

	buildableInProgress(universe: Universe): Buildable
	{
		var buildableEntityInProgress = this.buildableEntityInProgress(universe);

		var returnValue =
		(
			buildableEntityInProgress == null
			? null
			: Buildable.ofEntity(buildableEntityInProgress)
		);

		return returnValue;
	}

	industryAccumulatedQuantity(): number
	{
		return this.industry.planetIndustryAccumulated(this).quantity;
	}

	industryAndBuildableInProgress(universe: Universe, world: WorldExtended): string
	{
		var industryThisRound = this.industryThisRound(universe, world);

		var buildableAndProgress =
			this.industryBuildableAndProgress(universe);

		var returnValue =
			industryThisRound
			+ " " + buildableAndProgress;

		return returnValue;
	}

	industryBuildableAndProgress(universe: Universe): string
	{
		var buildable = this.buildableInProgress(universe);

		var buildableAndProgress: string;

		if (buildable == null)
		{
			buildableAndProgress = "(building nothing)"
		}
		else
		{
			var buildableDefn = buildable.defn;
			var industryAccumulated = this.industryAccumulatedQuantity();
			var industryRequired = buildableDefn.industryToBuild;
			buildableAndProgress =
				"(" + industryAccumulated
				+ "/" + industryRequired
				+ " for " + buildableDefn.name + ")";
		}

		return buildableAndProgress;
	}

	industryBuildableProgress(universe: Universe): string
	{
		var buildable = this.buildableInProgress(universe);

		var buildableProgress: string;

		if (buildable == null)
		{
			buildableProgress = "(-/-)"
		}
		else
		{
			var buildableDefn = buildable.defn;
			var industryAccumulated = this.industryAccumulatedQuantity();
			var industryRequired = buildableDefn.industryToBuild;
			buildableProgress =
				"(" + industryAccumulated + "/" + industryRequired+ ")";
		}

		return buildableProgress;
	}

	private _industryThisRound: number;

	industryThisRound
	(
		universe: Universe, world: WorldExtended
	): number
	{
		if (this._industryThisRound != null)
		{
			var resource = this.resourcesThisRoundByName
			(
				universe, world
			).get("Industry");
			return (resource == null ? 0: resource.quantity);
		}

		return this._industryThisRound;
	}

	industryThisRoundClear(): void
	{
		this._industryThisRound = 0;
	}

	industryThisRoundAdd(amount: number): void
	{
		this._industryThisRound += amount;
	}

	prosperityThisRound
	(
		universe: Universe, world: WorldExtended, faction: Faction
	): number
	{
		var prosperityGross = this.resourcesThisRoundByName
		(
			universe, world
		).get("Prosperity").quantity;

		var prosperityConsumed = Math.floor(this.demographics.population / 4);

		var prosperityNet = prosperityGross - prosperityConsumed;

		var inefficiencyExponent = 0.85;
		prosperityNet = Math.pow(prosperityNet, inefficiencyExponent);

		prosperityNet = Math.round(prosperityNet);

		return prosperityNet;
	}

	researchThisRound
	(
		universe: Universe, world: WorldExtended, faction: Faction
	): number
	{
		var resource = this.resourcesThisRoundByName
		(
			universe, world
		).get("Research");
		return (resource == null ? 0: resource.quantity);
	}

	resourcesThisRound(universe: Universe, world: WorldExtended): Resource[]
	{
		if (this._resourcesThisRound == null)
		{
			this._resourcesThisRound = new Array<Resource>();

			var thisAsPlace = this.toPlace();
			var uwpe = new UniverseWorldPlaceEntities(universe, world, thisAsPlace, null, null);

			var layout = this.layout(universe);
			var facilities = layout.facilities();
			for (var f = 0; f < facilities.length; f++)
			{
				var facilityAsEntity = facilities[f];
				var facility = Buildable.ofEntity(facilityAsEntity);
				if (facility.isComplete)
				{
					uwpe.entitySet(facilityAsEntity);
					facility.effectPerRoundApply(uwpe);
				}
			}

			this._resourcesThisRoundByName = null;
		}
		return this._resourcesThisRound;
	}

	resourcesThisRoundByName(universe: Universe, world: WorldExtended): Map<string,Resource>
	{
		if (this._resourcesThisRoundByName == null)
		{
			var resourcesThisRound =
				this.resourcesThisRound(universe, world);

			this._resourcesThisRoundByName = ArrayHelper.addLookups
			(
				resourcesThisRound, (x: Resource) => x.defnName
			);
		}

		return this._resourcesThisRoundByName;
	}

	resourcesThisRoundAdd(resourcesToAdd: Resource[])
	{
		Resource.addManyToMany(resourcesToAdd, this._resourcesThisRound);
	}

	resourcesThisRoundReset(): void
	{
		this._resourcesThisRound = null;
		this._resourcesThisRoundByName = null;
	}
}
