
class Planet extends EntityProperty
{
	name: string;
	factionName: string;
	pos: Coords;
	demographics: PlanetDemographics;
	industry: PlanetIndustry;
	layout: Layout;
	resourcesAccumulated: Resource[];
	ships: Ship[];

	bodyDefn: BodyDefn;
	_locatable: Locatable;
	_resourcesPerTurn: Resource[];
	_resourcesPerTurnByName: Map<string,Resource>;

	constructor
	(
		name: string,
		bodyDefn: BodyDefn,
		pos: Coords,
		factionName: string,
		demographics: PlanetDemographics,
		industry: PlanetIndustry,
		layout: Layout
	)
	{
		super();
		this.name = name;
		this.bodyDefn = bodyDefn;
		this.factionName = factionName;
		var loc = Disposition.fromPos(pos);
		this._locatable = new Locatable(loc);
		this.demographics = demographics;
		this.industry = industry;
		this.layout = layout;

		this.ships = [];

		this.resourcesAccumulated = [];
	}

	static fromNameBodyDefnAndPos(name: string, bodyDefn: BodyDefn, pos: Coords)
	{
		return new Planet(name, bodyDefn, pos, null, null, null, null);
	}

	// constants

	static _bodyDefnPlanet: BodyDefn;
	static bodyDefnPlanet()
	{
		if (Planet._bodyDefnPlanet == null)
		{
			Planet._bodyDefnPlanet = new BodyDefn
			(
				"Planet",
				Coords.fromXY(10, 10), // size
				new VisualGroup
				([
					new VisualCircleGradient
					(
						10, // radius
						new ValueBreakGroup
						(
							[
								new ValueBreak(0, Color.byName("White")),
								new ValueBreak(.2, Color.byName("White")),
								new ValueBreak(.3, Color.byName("Cyan")),
								new ValueBreak(.75, Color.byName("Cyan")),
								new ValueBreak(1, Color.byName("Black")),
							],
							null
						)
					),
					new VisualDynamic // todo - VisualDynamic2?
					(
						(u: Universe, w: World, d: Display, e: Entity) =>
						{
							var factionName = "todo"; // todo
							var returnValue: Visual = null;
							if (factionName == null)
							{
								returnValue = new VisualNone();
							}
							else
							{
								returnValue = new VisualOffset
								(
									VisualText.fromTextAndColor
									(
										factionName, Color.byName("White"),
									),
									Coords.fromXY(0, 16)
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
	static bodyDefnStar()
	{
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
						VisualText.fromTextAndColor(name, Color.byName("Gray"))
					])
				);
		}

		return Planet._bodyDefnStar;
	}

	// instance methods

	faction(world: WorldExtended)
	{
		return (this.factionName == null ? null : world.factionByName(this.factionName));
	}

	locatable()
	{
		return this._locatable;
	}

	_entity: Entity;
	toEntity()
	{
		if (this._entity == null)
		{
			var body = new Body(this.name, this.bodyDefn, this.pos); 
			this._entity = new Entity(this.name, [ this, this.locatable(), body ] );
		}
		return this._entity;
	}

	shipAdd(shipToAdd: Ship)
	{
		this.ships.push(shipToAdd);
	}

	shipRemove(shipToRemove: Ship)
	{
		ArrayHelper.remove(this.ships, shipToRemove);
	}

	// controls

	toControl(universe: Universe, size: Coords)
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
					false, // isTextCentered
					DataBinding.fromContext(this.name),
					10 // fontHeightInPixels
				)
			]
		);

		return returnValue;
	}

	// diplomacy

	strength(world: WorldExtended)
	{
		return 1; // todo
	}

	// turns

	updateForTurn(universe: Universe, world: WorldExtended, faction: Faction)
	{
		this._resourcesPerTurn = null;
		this.layout.updateForTurn(universe, world, faction, null);
		this.industry.updateForTurn(universe, world, faction, this);
		this.demographics.updateForTurn(universe, world, faction, this);
	}

	// resources

	buildableInProgress()
	{
		var returnValue = null;

		var buildables = this.layout.map.bodies;
		for (var i = 0; i < buildables.length; i++)
		{
			var buildable = EntityExtensions.buildable(buildables[i]);
			if (buildable.isComplete == false)
			{
				returnValue = buildable;
				break;
			}
		}

		return returnValue;
	}

	industryPerTurn(universe: Universe, world: WorldExtended, faction: Faction)
	{
		return this.resourcesPerTurnByName(universe, world, faction).get("Industry");
	}

	prosperityPerTurn(universe: Universe, world: WorldExtended, faction: Faction)
	{
		return this.resourcesPerTurnByName(universe, world, faction).get("Prosperity");
	}

	researchPerTurn(universe: Universe, world: WorldExtended, faction: Faction)
	{
		return this.resourcesPerTurnByName(universe, world, faction).get("Research");
	}

	resourcesPerTurn(universe: Universe, world: WorldExtended, faction: Faction)
	{
		if (this._resourcesPerTurn == null)
		{
			var resourcesSoFar = new Array<Resource>();

			var layout = this.layout;
			var facilities = layout.facilities();
			for (var f = 0; f < facilities.length; f++)
			{
				var facility = EntityExtensions.buildable(facilities[f]);
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

	resourcesPerTurnByName(universe: Universe, world: WorldExtended, faction: Faction)
	{
		if (this._resourcesPerTurnByName == null)
		{
			var resourcesPerTurn = this.resourcesPerTurn(universe, world, faction);
			this._resourcesPerTurnByName =
				ArrayHelper.addLookups(resourcesPerTurn, (x:Resource) => x.defnName);
		}

		return this._resourcesPerTurnByName;
	}
}
