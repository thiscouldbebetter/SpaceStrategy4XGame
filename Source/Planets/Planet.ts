
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

	_resourcesPerTurn: Resource[];
	_resourcesPerTurnByName: Map<string, Resource>;

	constructor
	(
		name: string,
		planetType: PlanetType,
		pos: Coords,
		factionName: string,
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
				new Factionable(factionName),
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

	static fromNameTypeAndPos(name: string, planetType: PlanetType, pos: Coords)
	{
		return new Planet
		(
			name,
			planetType,
			pos,
			null, // factionName
			null, // demographics
			null, // industry
			null // layout
		);
	}

	// instance methods

	cellPositionsAvailableToBuildOnSurface(universe: Universe): Coords[]
	{
		var returnValues = new Array<Coords>();

		var layout = this.layout(universe);
		var layoutMap = layout.map;
		var mapSizeInCells = layoutMap.sizeInCells;
		var cellPosInCells = Coords.create();

		var terrainSurface = layoutMap.terrainByName("Surface");

		for (var y = 0; y < mapSizeInCells.y; y++)
		{
			cellPosInCells.y = y;

			for (var x = 0; x < mapSizeInCells.x; x++)
			{
				cellPosInCells.x = x;

				var terrainAtPos = layoutMap.terrainAtPosInCells(cellPosInCells);
				var isSurface = (terrainAtPos == terrainSurface);

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

				if (isOrbit == false)
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

	faction(world: WorldExtended): Faction
	{
		return this.factionable().faction(world);
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

	shipAdd(shipToAdd: Ship): void
	{
		this.ships.push(shipToAdd);
		shipToAdd.locatable().loc.placeName = Planet.name + ":" + this.name;
	}

	shipRemove(shipToRemove: Ship): void
	{
		ArrayHelper.remove(this.ships, shipToRemove);
	}

	starsystem(world: WorldExtended): Starsystem
	{
		var networkNodeFound = world.network.nodes.find
		(
			x => (x.starsystem.planets.indexOf(this) >= 0)
		);

		var starsystemFound =
		(
			networkNodeFound == null ? null : networkNodeFound.starsystem
		);
		return starsystemFound;
	}

	toEntity(): Entity
	{
		return this;
	}

	toStringDescription(universe: Universe, world: WorldExtended): string
	{
		var resourcesPerTurnAsString =
			this.resourcesPerTurn(universe, world).join(", ");

		var returnValue =
			this.name
			+ " - " + this.demographics.toStringDescription()
			+ " - " + resourcesPerTurnAsString
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

	// Demographics.

	populationIncrement(universe: Universe): void
	{
		this.demographics.populationIncrement(universe, this);
	}
	
	prosperityAccumulated(): number
	{
		return this.resourcesAccumulated.find(x => x.defnName == "Prosperity").quantity;
	}

	prosperityNetWithNeededToGrow(universe: Universe): string
	{
		var prosperityNet = this.prosperityPerTurn
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

	populationIdle(universe: Universe): number
	{
		return this.demographics.populationIdle(universe, this);
	}

	populationIdleExists(universe: Universe): boolean
	{
		return this.populationIdle(universe) > 0;
	}

	populationMax(): number
	{
		return this.planetType.size.populationMax();
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
			"" + populationCurrent + "/" + this.populationMax() + " (Idle: " + populationIdle + ")";
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
			this.resourcesPerTurnReset();

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
		var industryPerTurn = this.industryPerTurn(universe, world);
		
		var buildable = this.buildableInProgress(universe);

		var buildableAndProgress: string;

		if (buildable == null)
		{
			buildableAndProgress = "(building nothing)"
		}
		else
		{
			var buildableDefn = buildable.defn(world);
			var industryAccumulated = this.industryAccumulatedQuantity();
			var industryRequired = buildableDefn.industryToBuild;
			buildableAndProgress =
				"(" + industryAccumulated
				+ "/" + industryRequired
				+ " for " + buildableDefn.name + ")";
		}

		var returnValue =
			industryPerTurn
			+ " " + buildableAndProgress

		return returnValue;
	}
	
	industryPerTurn
	(
		universe: Universe, world: WorldExtended
	): number
	{
		var resource = this.resourcesPerTurnByName
		(
			universe, world
		).get("Industry");
		return (resource == null ? 0: resource.quantity);
	}
	
	prosperityPerTurn
	(
		universe: Universe, world: WorldExtended, faction: Faction
	): number
	{
		var prosperityGross = this.resourcesPerTurnByName
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

	researchPerTurn
	(
		universe: Universe, world: WorldExtended, faction: Faction
	): number
	{
		var resource = this.resourcesPerTurnByName
		(
			universe, world
		).get("Research");
		return (resource == null ? 0: resource.quantity);
	}

	resourcesPerTurn(universe: Universe, world: WorldExtended): Resource[]
	{
		if (this._resourcesPerTurn == null)
		{
			this._resourcesPerTurn = new Array<Resource>();

			var uwpe = new UniverseWorldPlaceEntities(universe, world, null, this, null);

			var layout = this.layout(universe);
			var facilities = layout.facilities();
			for (var f = 0; f < facilities.length; f++)
			{
				var facilityAsEntity = facilities[f];
				var facility = Buildable.ofEntity(facilityAsEntity);
				if (facility.isComplete)
				{
					uwpe.entity2Set(facilityAsEntity);
					facility.effectApply(uwpe);
				}
			}

			this._resourcesPerTurnByName = null;
		}
		return this._resourcesPerTurn;
	}

	resourcesPerTurnByName(universe: Universe, world: WorldExtended): Map<string,Resource>
	{
		if (this._resourcesPerTurnByName == null)
		{
			var resourcesPerTurn =
				this.resourcesPerTurn(universe, world);

			this._resourcesPerTurnByName = ArrayHelper.addLookups
			(
				resourcesPerTurn, (x: Resource) => x.defnName
			);
		}

		return this._resourcesPerTurnByName;
	}

	resourcesPerTurnAdd(resourcesToAdd: Resource[])
	{
		Resource.addManyToMany(resourcesToAdd, this._resourcesPerTurn);
	}

	resourcesPerTurnReset(): void
	{
		this._resourcesPerTurn = null;
		this._resourcesPerTurnByName = null;
	}
}
