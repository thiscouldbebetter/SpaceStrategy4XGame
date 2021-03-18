
class Planet
{
	constructor(name, factionName, pos, demographics, industry, layout)
	{
		this.name = name;
		this.factionName = factionName;
		var loc = new Disposition(pos);
		this._locatable = new Locatable(loc);
		this.demographics = demographics;
		this.industry = industry;
		this.layout = layout;

		this.defn = Planet.BodyDefn();

		this.ships = [];

		this.resourcesAccumulated = [];
	}

	// constants

	static BodyDefn()
	{
		if (Planet._bodyDefn == null)
		{
			Planet._bodyDefn = new BodyDefn
			(
				"Planet",
				new Coords(10, 10), // size
				new VisualGroup
				([
					new VisualCircleGradient
					(
						10, // radius
						new ValueBreakGroup
						([
							new ValueBreak(0, Color.byName("White")),
							new ValueBreak(.2, Color.byName("White")),
							new ValueBreak(.3, Color.byName("Cyan")),
							new ValueBreak(.75, Color.byName("Cyan")),
							new ValueBreak(1, Color.byName("Black")),
						])
					),
					new VisualDynamic
					(
						function visual(drawable)
						{
							var returnValue = null;
							if (drawable.factionName == null)
							{
								returnValue = new VisualNone();
							}
							else
							{
								returnValue = new VisualOffset
								(
									VisualText.fromTextAndColor
									(
										drawable.factionName, Color.byName("White"),
									),
									new Coords(0, 16)
								)
							}
							return returnValue;
						}
					)
				])
			);
		}

		return Planet._bodyDefn;
	}

	// instance methods

	faction(world)
	{
		return (this.factionName == null ? null : world.factionByName(this.factionName));
	}

	locatable()
	{
		return this._locatable;
	}

	// controls

	controlBuild(universe, size)
	{
		var returnValue = new ControlContainer
		(
			"containerPlanet",
			new Coords(0, 0), // pos
			size,
			[
				new ControlLabel
				(
					"labelName",
					new Coords(0, 0), // pos
					new Coords(size.x, 0), // size
					false, // isTextCentered
					new DataBinding(this.name),
					10 // fontHeightInPixels
				)
			]
		);

		return returnValue;
	}

	// diplomacy

	strength()
	{
		return 1;
	}

	// turns

	updateForTurn(universe, world, faction)
	{
		this.layout.updateForTurn(universe, world, faction, this);
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
			var buildable = buildables[i];
			if (buildable.isComplete == false)
			{
				returnValue = buildable;
				break;
			}
		}

		return returnValue;
	}

	industryPerTurn(universe, world, faction)
	{
		return this.resourcesPerTurn(universe, world, faction)["Industry"];
	}

	prosperityPerTurn(universe, world, faction)
	{
		return this.resourcesPerTurn(universe, world, faction)["Prosperity"];
	}

	researchPerTurn(universe, world, faction)
	{
		return this.resourcesPerTurn(universe, world, faction)["Research"];
	}

	resourcesPerTurn(universe, world, faction)
	{
		if (this._resourcesPerTurn == null)
		{
			var resourcesSoFar = [];

			var layout = this.layout;
			var facilities = layout.facilities();
			for (var f = 0; f < facilities.length; f++)
			{
				var facility = facilities[f];
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
}
