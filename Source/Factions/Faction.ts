
class Faction extends EntityPropertyBase<Faction>
{
	defnName: string;
	homeStarsystemName: string;
	homePlanetName: string;
	color: Color;
	diplomacy: FactionDiplomacy;
	technologyResearcher: TechnologyResearcher;
	planets: Planet[];
	ships: Ship[];
	knowledge: FactionKnowledge;
	intelligence: FactionIntelligence;
	_visualsForShipsByHullSize: Map<ShipHullSize, VisualBase>;

	name: string;

	notificationSession: NotificationSession;

	planetSelected: Planet;
	shipSelected: Ship;

	shipsBuiltSoFarCount: number;

	constructor
	(
		defnName: string,
		homeStarsystemName: string,
		homePlanetName: string,
		color: Color,
		diplomacy: FactionDiplomacy,
		technologyResearcher: TechnologyResearcher,
		planets: Planet[],
		ships: Ship[],
		knowledge: FactionKnowledge,
		intelligence: FactionIntelligence,
		visualsForShipsByHullSize: Map<ShipHullSize, VisualBase>
	)
	{
		super();

		this.defnName = defnName;
		this.homeStarsystemName = homeStarsystemName;
		this.homePlanetName = homePlanetName;
		this.color = color;
		this.diplomacy = diplomacy;
		this.technologyResearcher = technologyResearcher;
		this.planets = planets || [];
		this.ships = ships || [];
		this.knowledge = knowledge;
		this.intelligence = intelligence;
		this._visualsForShipsByHullSize = visualsForShipsByHullSize; // todo

		this.name = this.defnName;

		this.notificationSession = new NotificationSession(this.name, []);

		this.shipsBuiltSoFarCount = this.ships.length;
	}

	static fromEntity(entity: Entity): Faction
	{
		return entity.propertyByName(Faction.name) as Faction;
	}

	static fromDefnName(defnName: string): Faction
	{
		var colorRed = Color.Instances().Red;
		var technologyResearcher = TechnologyResearcher.default();
		var factionKnowledge = FactionKnowledge.fromFactionSelfName(defnName);

		var faction = new Faction
		(
			defnName,
			null, // homeStarsystemName,
			null, // homePlanetName,
			colorRed,
			null, // diplomacy
			technologyResearcher,
			null, // planets
			null, // ships
			factionKnowledge,
			null, // intelligence
			null // visuals
		);

		var diplomacy = FactionDiplomacy.fromFactionSelf(faction);
		faction.diplomacy = diplomacy;

		return faction;
	}

	static _colors: Color[];
	static colors(): Color[]
	{
		if (Faction._colors == null)
		{
			var colors = Color.Instances();

			Faction._colors =
			[
				colors.Red,
				colors.Orange,
				colors.Yellow,
				colors.Green,
				colors.Blue,
				colors.Cyan,
				colors.Violet
			];
		}

		return Faction._colors;
	}

	abilityCanBeUsed(world: WorldExtended): boolean
	{
		var defn = this.defn();
		var ability = defn.ability;
		var returnValue = ability.isCharged(world);
		return returnValue;
	}

	defn(): FactionDefn
	{
		return FactionDefn.byName(this.defnName);
	}

	detailsView(universe: Universe): void
	{
		var factionDetailsAsControl = this.toControl_Details(universe);
		var venueNext = new VenueControls(factionDetailsAsControl, false);
		universe.venueTransitionTo(venueNext);
	}

	isControlledByHuman(): boolean
	{
		return (this.intelligence == FactionIntelligence.Instances().Human);
	}

	planetAdd(planet: Planet): void
	{
		this.planets.push(planet);
		planet.factionable().factionSet(this);
	}

	planetHome(world: WorldExtended): Planet
	{
		return this.starsystemHome(world).planets.find(x => x.name == this.homePlanetName);
	}

	researchSessionStart(universe: Universe): void
	{
		var researchSession = new TechnologyResearchSession
		(
			(universe.world as WorldExtended).technologyGraph,
			this.technologyResearcher
		);
		var venueNext: Venue = new VenueTechnologyResearchSession(researchSession);
		universe.venueTransitionTo(venueNext);
	}

	shipAdd(ship: Ship): void
	{
		this.ships.push(ship);
		ship.factionable().factionSet(this);
	}

	starsystemHome(world: WorldExtended): Starsystem
	{
		return world.starCluster.nodeByName(this.homeStarsystemName).starsystem;
	}

	starsystems(world: WorldExtended): Starsystem[]
	{
		var planets = this.planets;
		var starsystemsForPlanetsWithDuplicates =
			planets.map(p => p.starsystem(world));
		var starsystemsForPlanets =
			starsystemsForPlanetsWithDuplicates.filter
			(
				(value, index, all) => all.indexOf(value) == index
			);
		return starsystemsForPlanets;
	}

	toEntity(): Entity
	{
		return new Entity(Faction.name + "_" + this.name, [ this ]);
	}

	toString(): string
	{
		return this.name;
	}

	visualForShipWithHullSize(hullSize: ShipHullSize): VisualBase
	{
		return this._visualsForShipsByHullSize.get(hullSize);
	}

	// controls

	toControl_ClusterOverlay
	(
		universe: Universe,
		containerOuterSize: Coords,
		containerInnerSize: Coords,
		margin: number,
		controlHeight: number,
		buttonWidth: number,
		includeDetailsButton: boolean
	): ControlBase
	{
		var fontHeightInPixels = margin;
		var fontNameAndHeight =
			FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);

		var faction = this;

		var size = Coords.fromXY
		(
			containerInnerSize.x,
			controlHeight * 2 + margin * 3
		);

		var labelFaction = ControlLabel.fromPosSizeTextFontUncentered
		(
			Coords.fromXY(margin, margin),// pos
			Coords.fromXY
			(
				containerInnerSize.x - margin * 3,
				controlHeight
			), // size
			DataBinding.fromContext("Faction:"),
			fontNameAndHeight
		);

		var textFaction = ControlLabel.fromPosSizeTextFontUncentered
		(
			Coords.fromXY
			(
				margin * 2 + containerInnerSize.x * .3, margin
			), // pos
			Coords.fromXY
			(
				containerInnerSize.x - margin * 2,
				controlHeight
			), // size
			DataBinding.fromContext(faction.name),
			fontNameAndHeight
		);

		var childControls: Array<ControlBase> =
		[
			labelFaction,
			textFaction
		];

		if (includeDetailsButton)
		{
			var buttonDetails = ControlButton.fromNamePosSizeTextFontBorderEnabledClick
			(
				"buttonDetails",
				Coords.fromXY
				(
					margin, margin * 2 + controlHeight
				), // pos
				Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
				"Details",
				fontNameAndHeight,
				true, // hasBorder
				DataBinding.fromTrue(), // isEnabled
				// click
				() => faction.detailsView(universe) // click
			);

			childControls.push(buttonDetails);
		}

		var returnValue = ControlContainer.fromNamePosSizeAndChildren
		(
			"containerFaction",
			Coords.fromXY
			(
				containerOuterSize.x
					- margin
					- containerInnerSize.x,
				margin
			), // pos
			size,
			childControls
		);

		return returnValue;
	}

	toControl_Details(universe: Universe): ControlBase
	{
		var size = universe.display.sizeInPixels;
		var margin = 8;
		var fontHeightInPixels = 10;
		var fontNameAndHeight =
			FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);
		var controlHeight = 12;

		var tabButtonSize =
			Coords.fromXY(4, 2).multiplyScalar(controlHeight);

		var tabbedControlSize = Coords.fromXY
		(
			size.x,
			size.y - tabButtonSize.y - margin - 2 // hack - Why 2?
		);

		var faction = this;

		var controlSize = Coords.fromXY
		(
			margin * 16,
			controlHeight
		);

		var labelFaction = ControlLabel.fromPosSizeTextFontUncentered
		(
			Coords.fromXY(margin, margin),// pos
			controlSize,
			DataBinding.fromContext("Faction:"),
			fontNameAndHeight
		);

		var textFaction = ControlLabel.fromPosSizeTextFontUncentered
		(
			Coords.fromXY(margin * 8, margin), // pos
			controlSize,
			DataBinding.fromContext(faction.name),
			fontNameAndHeight
		);

		var labelFactionType = ControlLabel.fromPosSizeTextFontUncentered
		(
			Coords.fromXY(margin, margin * 2),// pos
			controlSize,
			DataBinding.fromContext("Type:"),
			fontNameAndHeight
		);

		var textFactionType = ControlLabel.fromPosSizeTextFontUncentered
		(
			Coords.fromXY(margin * 8, margin * 2), // pos
			controlSize,
			DataBinding.fromContext(faction.defnName),
			fontNameAndHeight
		);

		var labelAbility = ControlLabel.fromPosSizeTextFontUncentered
		(
			Coords.fromXY(margin, margin * 3),// pos
			controlSize,
			DataBinding.fromContext("Ability:"),
			fontNameAndHeight
		);

		var textAbility = ControlLabel.fromPosSizeTextFontUncentered
		(
			Coords.fromXY(margin * 8, margin * 3), // pos
			controlSize,
			DataBinding.fromContext(faction.defn().ability.toString(universe.world as WorldExtended)),
			fontNameAndHeight
		);

		var abilityUse = () =>
		{
			var world = universe.world as WorldExtended;
			var faction = world.factionCurrent();
			if (faction.abilityCanBeUsed(world) )
			{
				var factionDefn = faction.defn();
				var uwpe = new UniverseWorldPlaceEntities(universe, world, null, null, null);
				factionDefn.ability.perform(uwpe);
			}
			else
			{
				VenueMessage.fromText("todo - Can't use ability yet.");
			}
		};

		var buttonAbilityUse = ControlButton.fromNamePosSizeTextFontBorderEnabledClick
		(
			"buttonAbilityUse",
			Coords.fromXY(margin * 24, margin * 3), // pos
			controlSize,
			"Use",
			fontNameAndHeight,
			true, // hasBorder
			DataBinding.fromTrue(), // isEnabled
			abilityUse // click
		);

		var containerStatus = ControlContainer.fromNamePosSizeAndChildren
		(
			"Status",
			Coords.create(),
			tabbedControlSize,
			// children
			[
				labelFaction, textFaction,
				labelFactionType, textFactionType,
				labelAbility, textAbility, buttonAbilityUse
			]
		);

		var containerNotifications =
			this.notificationSession.toControl
			(
				universe, tabbedControlSize, null // fontHeightInPixels
			);

		var containerDiplomacy =
			this.toControl_Details_Diplomacy(universe, tabbedControlSize);

		var containerTechnology =
			this.toControl_Details_Technology(universe, tabbedControlSize);

		var containerPlanets = this.toControl_Details_Planets
		(
			universe, tabbedControlSize, margin, controlHeight, fontNameAndHeight
		);

		var containerShips = this.toControl_Details_Ships
		(
			universe, tabbedControlSize, margin, controlHeight, fontNameAndHeight
		);

		var controlsForTabs =
		[
			containerStatus,
			containerNotifications,
			containerDiplomacy,
			containerTechnology,
			containerPlanets,
			containerShips
		];

		var venueToReturnTo = universe.venueCurrent();
		var back = () => universe.venueTransitionTo(venueToReturnTo);

		var returnControl = new ControlTabbed<Faction>
		(
			"tabbedItems",
			Coords.create(), // pos
			size,
			tabButtonSize,
			controlsForTabs,
			fontNameAndHeight,
			back,
			faction // context
		);

		return returnControl;
	}

	toControl_Details_Diplomacy
	(
		universe: Universe, size: Coords
	): ControlBase
	{
		var factionCurrent = this;
		var diplomaticSession = DiplomaticSession.demo
		(
			factionCurrent,
			universe.venueCurrent()
		);
		var diplomaticSessionAsControl =
			diplomaticSession.toControl(universe, size);

		return diplomaticSessionAsControl;
	}

	toControl_Details_Planets
	(
		universe: Universe,
		size: Coords,
		margin: number,
		controlHeight: number,
		fontNameAndHeight: FontNameAndHeight
	): ControlBase
	{
		var world = universe.world as WorldExtended;
		var faction = this;

		var labelPlanets = ControlLabel.fromPosSizeTextFontUncentered
		(
			Coords.fromXY(margin, margin),// pos
			Coords.fromXY
			(
				size.x - margin * 2,
				controlHeight
			), // size
			DataBinding.fromContext("Planets:"),
			fontNameAndHeight
		);

		var textPlanetCount = ControlLabel.fromPosSizeTextFontUncentered
		(
			Coords.fromXY(margin * 8, margin), // pos
			Coords.fromXY
			(
				size.x - margin * 2,
				controlHeight
			), // size
			DataBinding.fromContextAndGet
			(
				faction,
				(c: Faction) => "" + c.planets.length
			),
			fontNameAndHeight
		);

		var listPlanets = ControlList.fromNamePosSizeItemsTextFontSelectedValue
		(
			"listPlanets",
			Coords.fromXY(margin, margin * 2 + controlHeight), // pos
			Coords.fromXY
			(
				size.x - margin * 2,
				size.y - margin * 4 - controlHeight * 2
			), // size
			DataBinding.fromContextAndGet
			(
				faction,
				(c: Faction) => faction.planets
			), // items
			DataBinding.fromGet
			(
				(c: Planet) => c.toStringDescription(universe, world)
			), // bindingForItemText
			fontNameAndHeight,
			// dataBindingForItemSelected
			new DataBinding
			(
				faction,
				(c: Faction) => c.planetSelected,
				(c: Faction, v: Planet) =>
				{
					c.planetSelected = v;
				}
			),
			null // bindingForItemValue
		);

		var buttonGoToSelected = ControlButton.fromNamePosSizeTextFontBorderEnabledClick
		(
			"buttonGoToSelected",
			Coords.fromXY(margin, size.y - margin - controlHeight), // pos
			Coords.fromXY(5, 1).multiplyScalar(controlHeight), // size
			"Go To",
			fontNameAndHeight,
			true, // hasBorder
			DataBinding.fromContextAndGet
			(
				faction, (c: Faction) => (c.planetSelected != null)
			), // isEnabled
			() => faction.planetSelected.jumpTo(universe) // click
		);

		var containerPlanets = ControlContainer.fromNamePosSizeAndChildren
		(
			"Planets",
			Coords.create(),
			size,
			// children
			[
				labelPlanets,
				textPlanetCount,
				listPlanets,
				buttonGoToSelected
			]
		);

		return containerPlanets;
	}

	toControl_Details_Ships
	(
		universe: Universe,
		size: Coords,
		margin: number,
		controlHeight: number,
		fontNameAndHeight: FontNameAndHeight
	): ControlBase
	{
		var faction = this;

		var labelShips = ControlLabel.fromPosSizeTextFontUncentered
		(
			Coords.fromXY(margin, margin),// pos
			Coords.fromXY
			(
				size.x - margin * 2,
				controlHeight
			), // size
			DataBinding.fromContext("Ships:"),
			fontNameAndHeight
		);

		var textShipCount = ControlLabel.fromPosSizeTextFontUncentered
		(
			Coords.fromXY(margin * 8, margin), // pos
			Coords.fromXY
			(
				size.x - margin * 2,
				controlHeight
			), // size
			DataBinding.fromContextAndGet
			(
				faction,
				(c: Faction) => "" + c.ships.length
			),
			fontNameAndHeight
		);

		var listShips = ControlList.fromNamePosSizeItemsTextFontSelectedValue
		(
			"listShips",
			Coords.fromXY(margin, margin * 2 + controlHeight), // pos
			Coords.fromXY
			(
				size.x - margin * 2,
				size.y - margin * 4 - controlHeight * 2
			), // size
			DataBinding.fromContextAndGet
			(
				faction,
				(c: Faction) => faction.ships
			), // items
			DataBinding.fromGet
			(
				(c: Ship) => c.toStringDescription()
			), // bindingForItemText
			fontNameAndHeight,
			// dataBindingForItemSelected
			new DataBinding
			(
				faction,
				(c: Faction) => c.shipSelected,
				(c: Faction, v: Ship) =>
				{
					c.shipSelected = v;
				}
			),
			null // bindingForItemValue
		);

		var buttonGoToSelected = ControlButton.fromNamePosSizeTextFontBorderEnabledClick
		(
			"buttonGoToSelected",
			Coords.fromXY(margin, size.y - margin - controlHeight), // pos
			Coords.fromXY(5, 1).multiplyScalar(controlHeight), // size
			"Go To",
			fontNameAndHeight,
			true, // hasBorder
			DataBinding.fromContextAndGet
			(
				faction, (c: Faction) => (c.shipSelected != null)
			), // isEnabled
			() => faction.shipSelected.jumpTo(universe) // click
		);

		var containerShips = ControlContainer.fromNamePosSizeAndChildren
		(
			"Ships",
			Coords.create(),
			size,
			// children
			[
				labelShips,
				textShipCount,
				listShips,
				buttonGoToSelected
			]
		);

		return containerShips;
	}

	toControl_Details_Technology
	(
		universe: Universe, size: Coords
	): ControlBase
	{
		var researchSession = new TechnologyResearchSession
		(
			(universe.world as WorldExtended).technologyGraph,
			this.technologyResearcher
		);

		var researchSessionAsControl =
			researchSession.toControl(universe, size);

		return researchSessionAsControl;
	}

	// diplomacy

	allies(world: WorldExtended): Faction[]
	{
		return this.factionsMatchingRelationshipState
		(
			world, DiplomaticRelationship.States().Alliance
		);
	}

	enemies(world: WorldExtended): Faction[]
	{
		return this.factionsMatchingRelationshipState
		(
			world, DiplomaticRelationship.States().War
		);
	}

	factionsMatchingRelationshipState
	(
		world: WorldExtended, stateToMatch: DiplomaticRelationshipState
	): Faction[]
	{
		var relationships = this.diplomacy.relationships;

		var relationshipsMatching = relationships.filter
		(
			x => x.state == stateToMatch
		);

		var returnValues =
			relationshipsMatching.map(x => x.factionOther() );

		return returnValues;
	}

	relationshipByFactionName(factionName: string): DiplomaticRelationship
	{
		var returnValue = this.diplomacy.relationships.find
		(
			x => x.factionOther().name == factionName
		);
		return returnValue;
	}

	selfAndAllies(world: WorldExtended): Faction[]
	{
		var returnValues = this.factionsMatchingRelationshipState
		(
			world, DiplomaticRelationship.States().Alliance
		);

		returnValues.push(this);

		return returnValues;
	}

	strategicValue(world: WorldExtended): number
	{
		var returnValue = 0;

		var ships = this.ships;
		for (var i = 0; i < ships.length; i++)
		{
			var ship = ships[i];
			returnValue += ship.strategicValue(world);
		}

		var planets = this.planets;
		for (var i = 0; i < planets.length; i++)
		{
			var planet = planets[i];
			returnValue += planet.strategicValue(world);
		}

		returnValue += this.technologyResearcher.strategicValue(world);

		return returnValue;
	}


	// notifications

	notificationAdd(notification: Notification2): void
	{
		this.notificationSession.notificationAdd(notification);
	}

	notificationSessionStart(universe: Universe, size: Coords): void
	{
		size = size || universe.display.sizeInPixels;

		var notificationSessionAsControl = this.notificationSession.toControl
		(
			universe, size, null // fontHeightInPixels
		);
		var venueNext: Venue = notificationSessionAsControl.toVenue();
		universe.venueJumpTo(venueNext);
	}

	notificationsAdd(notificationsToAdd: Notification2[]): void
	{
		notificationsToAdd.forEach(x => this.notificationAdd(x) );
	}

	notificationsExist(): boolean
	{
		return this.notificationSession.notificationsExist();
	}

	notificationsForRoundAddToArray
	(
		universe: Universe, notificationsSoFar: Notification2[]
	): Notification2[]
	{
		var world = universe.world as WorldExtended;

		this.planets.forEach
		(
			x => x.notificationsForRoundAddToArray(universe, world, this, notificationsSoFar)
		);

		this.ships.forEach
		(
			x => x.notificationsForRoundAddToArray(universe, world, this, notificationsSoFar)
		);

		var starsystems = this.starsystems(world);
		starsystems.forEach
		(
			x => x.notificationsForRoundAddToArray(universe, world, this, notificationsSoFar)
		);

		this.technologyResearcher.notificationsForRoundAddToArray
		(
			universe, notificationsSoFar
		);

		return notificationsSoFar;
	}

	// rounds

	researchThisRound(universe: Universe, world: WorldExtended): number
	{
		var returnValue = 0;

		for (var i = 0; i < this.planets.length; i++)
		{
			var planet = this.planets[i];
			var planetResearchThisRound = planet.researchThisRound
			(
				universe, world, this
			);
			returnValue += planetResearchThisRound;
		}

		return returnValue;
	}

	updateForRound(universe: Universe, world: WorldExtended): void
	{
		for (var i = 0; i < this.planets.length; i++)
		{
			var planet = this.planets[i];
			planet.updateForRound(universe, world, this);
		}

		for (var i = 0; i < this.ships.length; i++)
		{
			var ship = this.ships[i];
			ship.updateForRound(universe, world, this);
		}

		this.technologyResearcher.updateForRound
		(
			universe, world, this
		);
	}

	// EntityProperty.

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		this.ships.forEach(x => x.initialize(uwpe));
	}

	propertyName(): string { return Faction.name; }

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		var universe = uwpe.universe;
		var venueCurrent = universe.venueCurrent();
		if (venueCurrent.constructor.name == VenueStarsystem.name)
		{
			var world = universe.world as WorldExtended;
			var venueStarsystem = venueCurrent as VenueStarsystem;

			var noEntitiesAreMovingYet = (venueStarsystem.entityMoving == null);
			if (noEntitiesAreMovingYet)
			{
				var starsystem = venueStarsystem.starsystem;
				var factionToMove = starsystem.factionToMove(world);

				var isItThisFactionsTurnToMove = (factionToMove == this);

				if (isItThisFactionsTurnToMove && noEntitiesAreMovingYet)
				{
					this.intelligence.starsystemMoveChoose(uwpe);
				}
			}
		}
	}

	// Clonable.

	clone(): Faction
	{
		throw new Error("Not yet implemented.");
	}

	overwriteWith(other: Faction): Faction
	{
		throw new Error("Not yet implemented.");
	}

	// Equatable.

	equals(other: Faction): boolean
	{
		return (this.name == other.name);
	}

}
