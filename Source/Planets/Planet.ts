
class Planet extends Entity
{
	defnName: string;
	typeName: string;
	demographics: PlanetDemographics;
	industry: PlanetIndustry;
	layout: Layout;
	resourcesAccumulated: Resource[];
	ships: Ship[];

	bodyDefn: BodyDefn;
	deviceSelected: Device;

	_resourcesPerTurn: Resource[];
	_resourcesPerTurnByName: Map<string, Resource>;

	constructor
	(
		name: string,
		planetType: PlanetType,
		bodyDefn: BodyDefn,
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
				bodyDefn,
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

		this.typeName = planetType.name();
		this.bodyDefn = bodyDefn;
		this.demographics = demographics;
		this.industry = industry;
		this.layout = layout;

		this.ships = [];

		this.resourcesAccumulated = [];
	}

	static fromNameBodyDefnAndPos(name: string, bodyDefn: BodyDefn, pos: Coords)
	{
		return new Planet(name, PlanetType.Instances().Default, bodyDefn, pos, null, null, null, null);
	}

	// constants

	static _bodyDefnPlanet: BodyDefn;
	static bodyDefnPlanet(): BodyDefn
	{
		if (Planet._bodyDefnPlanet == null)
		{
			var planetDimension = 10;

			var visualForPlanetType = new VisualCircleGradient
			(
				planetDimension, // radius
				new ValueBreakGroup
				(
					[
						new ValueBreak(0, Color.byName("White")),
						new ValueBreak(.2, Color.byName("White")),
						new ValueBreak(.3, Color.byName("Cyan")),
						new ValueBreak(.75, Color.byName("Cyan")),
						new ValueBreak(1, Color.byName("Black")),
					],
					null // ?
				),
				null // colorBorder
			);

			Planet._bodyDefnPlanet = new BodyDefn
			(
				"Planet",
				Coords.fromXY(1, 1).multiplyScalar(planetDimension), // size
				new VisualGroup
				([
					visualForPlanetType,
					new VisualDynamic // todo - VisualDynamic2?
					(
						(uwpe: UniverseWorldPlaceEntities) =>
						{
							var planet = uwpe.entity as Planet;
							var factionName = planet.factionable().factionName; // todo
							var returnValue: VisualBase = null;
							if (factionName == null)
							{
								returnValue = new VisualNone();
							}
							else
							{
								returnValue = new VisualOffset
								(
									Coords.fromXY(0, 16),
									VisualText.fromTextHeightAndColor
									(
										factionName, planetDimension, Color.byName("White"),
									)
								)
							}
							return returnValue;
						}
					)
				])
			);
		}

		return Planet._bodyDefnPlanet;
	}

	static _bodyDefnStar: BodyDefn
	static bodyDefnStar(): BodyDefn
	{
		var starName = "Star";
		var starRadius = 30;
		var starColor = Color.Instances().Yellow;

		if (Planet._bodyDefnStar == null)
		{
			Planet._bodyDefnStar = 
				new BodyDefn
				(
					"Star",
					Coords.fromXY(1, 1).multiplyScalar(starRadius), // size
					new VisualGroup
					([
						new VisualCircle(starRadius, starColor, starColor, null),
						VisualText.fromTextHeightAndColor
						(
							starName, 10, Color.byName("Gray")
						)
					])
				);
		}

		return Planet._bodyDefnStar;
	}

	// instance methods

	cellPositionsAvailableToBuildOnSurface(): Coords[]
	{
		var returnValues = new Array<Coords>();

		var map = this.layout.map;
		var mapSizeInCells = map.sizeInCells;
		var cellPosInCells = Coords.create();

		var terrainSurface = this.layout.map.terrainByName("Surface");

		for (var y = 0; y < mapSizeInCells.y; y++)
		{
			cellPosInCells.y = y;

			for (var x = 0; x < mapSizeInCells.x; x++)
			{
				cellPosInCells.x = x;

				var terrainAtPos = map.terrainAtPosInCells(cellPosInCells);
				var isSurface = (terrainAtPos == terrainSurface);

				if (isSurface)
				{
					var bodyAtPos = map.bodyAtPosInCells(cellPosInCells);

					var isVacant = (bodyAtPos == null);

					if (isVacant)
					{
						var bodiesNeighboring =
							map.bodiesNeighboringPosInCells(cellPosInCells);
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

	cellPositionsAvailableToOccupyInOrbit(): Coords[]
	{
		var returnValues = new Array<Coords>();

		var map = this.layout.map;
		var mapSizeInCells = map.sizeInCells;
		var cellPosInCells = Coords.create();

		var terrainOrbit = this.layout.map.terrainByName("Orbit");

		for (var y = 0; y < mapSizeInCells.y; y++)
		{
			cellPosInCells.y = y;

			for (var x = 0; x < mapSizeInCells.x; x++)
			{
				cellPosInCells.x = x;

				var terrainAtPos = map.terrainAtPosInCells(cellPosInCells);
				var isOrbit = (terrainAtPos == terrainOrbit);

				if (isOrbit == false)
				{
					var bodyAtPos = map.bodyAtPosInCells(cellPosInCells);

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
			universe.venueCurrent,
			this, // modelParent
			this.layout
		);
		universe.venueNext = venuePlanet;
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

	toStringDescription(world: WorldExtended): string
	{
		var resourcesPerTurnAsString =
			this.resourcesPerTurn(world).join(", ");

		var returnValue =
			this.name
			+ " - " + this.demographics.toStringDescription()
			+ " - " + resourcesPerTurnAsString
			+ " - " + this.industry.toStringDescription(world, this)
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

	// diplomacy

	strategicValue(world: WorldExtended): number
	{
		return 1; // todo
	}

	// turns

	updateForTurn
	(
		universe: Universe, world: WorldExtended, faction: Faction
	): void
	{
		if (faction != null)
		{
			this._resourcesPerTurn = null;
			this._resourcesPerTurnByName = null;

			this.layout.updateForTurn(universe, world, faction, null);
			this.industry.updateForTurn(universe, world, faction, this);
			this.demographics.updateForTurn(universe, world, faction, this);
		}
	}

	// resources

	buildableEntitiesRemove(entities: Entity[]): void
	{
		this.layout.buildableEntitiesRemove(entities);
	}

	buildableEntityBuild(entity: Entity): void
	{
		this.layout.buildableEntityBuild(entity);
	}

	buildableEntityInProgress(): Entity
	{
		return this.layout.buildableEntityInProgress();
	}

	buildableInProgress(): Buildable
	{
		var buildableEntityInProgress = this.buildableEntityInProgress();

		var returnValue =
		(
			buildableEntityInProgress == null
			? null
			: Buildable.fromEntity(buildableEntityInProgress)
		);

		return returnValue;
	}

	industryPerTurn
	(
		universe: Universe, world: WorldExtended, faction: Faction
	): number
	{
		var resource = this.resourcesPerTurnByName
		(
			world
		).get("Industry");
		return (resource == null ? 0: resource.quantity);
	}

	prosperityPerTurn
	(
		universe: Universe, world: WorldExtended, faction: Faction
	): number
	{
		var resource = this.resourcesPerTurnByName
		(
			world
		).get("Prosperity");
		return (resource == null ? 0: resource.quantity);
	}

	researchPerTurn
	(
		universe: Universe, world: WorldExtended, faction: Faction
	): number
	{
		var resource = this.resourcesPerTurnByName
		(
			world
		).get("Research");
		return (resource == null ? 0: resource.quantity);
	}

	resourcesPerTurn(world: WorldExtended): Resource[]
	{
		if (this._resourcesPerTurn == null)
		{
			var resourcesSoFar = new Array<Resource>();

			var layout = this.layout;
			var facilities = layout.facilities();
			for (var f = 0; f < facilities.length; f++)
			{
				var facility = Buildable.fromEntity(facilities[f]);
				if (facility.isComplete)
				{
					var facilityDefn = facility.defn(world);
					var facilityResources = facilityDefn.resourcesPerTurn;
					Resource.add(resourcesSoFar, facilityResources);
				}
			}

			this._resourcesPerTurn = resourcesSoFar;
		}
		return this._resourcesPerTurn;
	}

	resourcesPerTurnByName(world: WorldExtended): Map<string,Resource>
	{
		if (this._resourcesPerTurnByName == null)
		{
			var resourcesPerTurn =
				this.resourcesPerTurn(world);

			this._resourcesPerTurnByName = ArrayHelper.addLookups
			(
				resourcesPerTurn, (x: Resource) => x.defnName
			);
		}

		return this._resourcesPerTurnByName;
	}
}
