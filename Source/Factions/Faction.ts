
class Faction
{
	name: string;
	homeStarsystemName: string;
	homePlanetName: string;
	color: Color;
	relationships: DiplomaticRelationship[];
	technologyResearcher: TechnologyResearcher;
	planets: Planet[];
	ships: Ship[];
	knowledge: FactionKnowledge;
	intelligence: FactionIntelligence;

	notificationSession: NotificationSession;
	relationshipsByFactionName: Map<string,DiplomaticRelationship>;

	planetSelected: Planet;
	shipSelected: Ship;

	shipsBuiltSoFarCount: number;

	constructor
	(
		name: string,
		homeStarsystemName: string,
		homePlanetName: string,
		color: Color,
		relationships: DiplomaticRelationship[],
		technologyResearcher: TechnologyResearcher,
		planets: Planet[],
		ships: Ship[],
		knowledge: FactionKnowledge,
		intelligence: FactionIntelligence
	)
	{
		this.name = name;
		this.homeStarsystemName = homeStarsystemName;
		this.homePlanetName = homePlanetName;
		this.color = color;
		this.relationships = relationships;
		this.technologyResearcher = technologyResearcher;
		this.planets = planets;
		this.ships = ships;
		this.knowledge = knowledge;
		this.intelligence = intelligence;

		this.notificationSession = new NotificationSession(this.name, []);
		this.relationshipsByFactionName = ArrayHelper.addLookups
		(
			this.relationships,
			(x: DiplomaticRelationship) => x.factionNameOther
		);

		this.shipsBuiltSoFarCount = 0;
	}

	static fromName(name: string): Faction
	{
		return new Faction
		(
			name,
			null, // homeStarsystemName,
			null, // homePlanetName,
			Color.Instances().Red,
			new Array<DiplomaticRelationship>(),
			TechnologyResearcher.default(),
			new Array<Planet>(),
			new Array<Ship>(),
			FactionKnowledge.default(),
			null // intelligence
		);
	}

	detailsView(universe: Universe): void
	{
		var factionDetailsAsControl = this.toControl_Details(universe);
		var venueNext = new VenueControls(factionDetailsAsControl, false);
		universe.venueTransitionTo(venueNext);
	}

	isControlledByUser(): boolean
	{
		return (this.intelligence == null)
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

	planetAdd(planet: Planet): void
	{
		this.planets.push(planet);
		planet.factionName = this.name;
	}

	planetHome(world: WorldExtended): Planet
	{
		return this.starsystemHome(world).planets.find(x => x.name == this.homePlanetName);
	}

	shipAdd(ship: Ship): void
	{
		this.ships.push(ship);
		ship.factionName = this.name;
	}

	starsystemHome(world: WorldExtended): Starsystem
	{
		return world.network.nodeByName(this.homeStarsystemName).starsystem;
	}

	toString(): string
	{
		return this.name;
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
		var fontHeightInPixels = 10;

		var faction = this;

		var size = Coords.fromXY
		(
			containerInnerSize.x,
			controlHeight * 2 + margin * 3
		);

		var childControls: Array<ControlBase> =
		[
			new ControlLabel
			(
				"labelFaction",
				Coords.fromXY(margin, margin),// pos
				Coords.fromXY
				(
					containerInnerSize.x - margin * 3,
					controlHeight
				), // size
				false, // isTextCentered
				DataBinding.fromContext("Faction:"),
				fontHeightInPixels
			),

			new ControlLabel
			(
				"textFaction",
				Coords.fromXY
				(
					margin * 2 + containerInnerSize.x * .3, margin
				), // pos
				Coords.fromXY
				(
					containerInnerSize.x - margin * 2,
					controlHeight
				), // size
				false, // isTextCentered
				DataBinding.fromContext(faction.name),
				fontHeightInPixels
			)
		];

		if (includeDetailsButton)
		{
			var buttonDetails = ControlButton.from8
			(
				"buttonDetails",
				Coords.fromXY
				(
					margin, margin * 2 + controlHeight
				), // pos
				Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
				"Details",
				fontHeightInPixels,
				true, // hasBorder
				DataBinding.fromTrue(), // isEnabled
				// click
				() => faction.detailsView(universe) // click
			);

			childControls.push(buttonDetails);
		}

		var returnValue = ControlContainer.from4
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

	static toControl_Intelligence
	(
		diplomaticSession: DiplomaticSession,
		pos: Coords,
		containerSize: Coords
	): ControlBase
	{
		var margin = 10;
		var controlSpacing = 20;
		var listWidth = 100;
		var columnWidth = 60;
		var fontHeightInPixels = 10;

		var returnValue = ControlContainer.from4
		(
			"containerFactionIntelligence",
			pos,
			containerSize,
			// children
			[
				new ControlLabel
				(
					"labelFaction",
					Coords.fromXY(margin, margin), // pos
					Coords.fromXY(columnWidth, controlSpacing), // size
					false, // isTextCentered
					DataBinding.fromContext("Faction:"),
					fontHeightInPixels
				),

				new ControlLabel
				(
					"textFaction",
					Coords.fromXY(margin * 2 + columnWidth, margin), // pos
					Coords.fromXY(columnWidth, controlSpacing), // size,
					false, // isTextCentered
					DataBinding.fromContextAndGet
					(
						diplomaticSession,
						(c: DiplomaticSession) =>
							(c.factionSelected == null ? "[none]" : c.factionSelected.name)
					),
					fontHeightInPixels
				),

				new ControlLabel
				(
					"labelRelationship",
					Coords.fromXY(margin, margin + controlSpacing), // pos
					Coords.fromXY(columnWidth, controlSpacing), // size
					false, // isTextCentered
					DataBinding.fromContext("Relationship:"),
					fontHeightInPixels
				),

				new ControlLabel
				(
					"textRelationship",
					Coords.fromXY(margin + columnWidth, margin + controlSpacing), // pos
					Coords.fromXY(columnWidth, controlSpacing), // size,
					false, // isTextCentered
					DataBinding.fromContext("[relationship]"),
					fontHeightInPixels
				),

				new ControlLabel
				(
					"labelPlanets",
					Coords.fromXY(margin, margin + controlSpacing * 2), // pos
					Coords.fromXY(columnWidth, controlSpacing), // size
					false, // isTextCentered
					DataBinding.fromContext("Planets:"),
					fontHeightInPixels
				),

				ControlList.from8
				(
					"listPlanets",
					Coords.fromXY(margin, margin + controlSpacing * 3), // pos
					Coords.fromXY(listWidth, controlSpacing * 4), // size
					new DataBinding
					(
						diplomaticSession,
						(c: DiplomaticSession) =>
							(c.factionSelected == null ? new Array<Planet>() : c.factionSelected.planets),
						null
					), // items
					DataBinding.fromGet
					(
						(c: Planet) => "todo" // bindingForItemText,
					),
					fontHeightInPixels,
					// dataBindingForItemSelected
					new DataBinding
					(
						diplomaticSession,
						(c: DiplomaticSession) =>
							(c.factionSelected == null ? null : c.factionSelected.planetSelected),
						(c: DiplomaticSession, v: Planet) =>
						{
							if (c.factionSelected != null)
							{
								c.factionSelected.planetSelected = v;
							}
						}
					),
					null // bindingForItemValue
				),

				new ControlLabel
				(
					"labelShips",
					Coords.fromXY(margin, margin + controlSpacing * 7), // pos
					Coords.fromXY(columnWidth, controlSpacing), // size
					false, // isTextCentered
					DataBinding.fromContext("Ships:"),
					fontHeightInPixels
				),

				ControlList.from7
				(
					"listShips",
					Coords.fromXY(margin, margin + controlSpacing * 8), // pos
					Coords.fromXY(listWidth, controlSpacing * 4), // size
					DataBinding.fromContextAndGet
					(
						diplomaticSession,
						(c: DiplomaticSession) => 
							(c.factionSelected == null ? new Array<Ship>() : c.factionSelected.ships)
					), // options
					DataBinding.fromGet
					(
						(c: Ship) => "todo"
					), // bindingForOptionText,
					null, // fontHeightInPixels
					// dataBindingForValueSelected
					new DataBinding
					(
						diplomaticSession,
						(c: DiplomaticSession) =>
							(c.factionSelected == null ? null : c.factionSelected.shipSelected),
						(c: DiplomaticSession, v: Ship) =>
						{
							if (c.factionSelected != null)
							{
								c.factionSelected.shipSelected = v;
							}
						}
					)
				),
			]
		);

		return returnValue;
	}

	toControl_Details(universe: Universe): ControlBase
	{
		var size = universe.display.sizeInPixels;
		var margin = 8;
		var fontHeightInPixels = 10;
		var controlHeight = 12;

		var tabButtonSize =
			Coords.fromXY(4, 2).multiplyScalar(controlHeight);

		var tabbedControlSize = Coords.fromXY
		(
			size.x,
			size.y - tabButtonSize.y - margin
		);

		var faction = this;

		var containerStatus = ControlContainer.from4
		(
			"Status",
			Coords.create(),
			tabbedControlSize,
			// children
			[
				new ControlLabel
				(
					"labelFaction",
					Coords.fromXY(margin, margin),// pos
					Coords.fromXY
					(
						tabbedControlSize.x - margin * 2,
						controlHeight
					), // size
					false, // isTextCentered
					DataBinding.fromContext("Faction:"),
					fontHeightInPixels
				),

				new ControlLabel
				(
					"textBoxFaction",
					Coords.fromXY(margin * 8, margin), // pos
					Coords.fromXY
					(
						tabbedControlSize.x - margin * 2,
						controlHeight
					), // size
					false, // isTextCentered
					DataBinding.fromContext(faction.name),
					fontHeightInPixels
				),

			]
		);

		var containerNotifications =
			this.toControl_Details_Notifications(universe, tabbedControlSize);

		var containerDiplomacy =
			this.toControl_Details_Diplomacy(universe, tabbedControlSize);

		var containerTechnology =
			this.toControl_Details_Technology(universe, tabbedControlSize);

		var containerPlanets = this.toControl_Details_Planets
		(
			universe, tabbedControlSize, margin, controlHeight, fontHeightInPixels
		);

		var containerShips = this.toControl_Details_Ships
		(
			universe, tabbedControlSize, margin, controlHeight, fontHeightInPixels
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

		var venueToReturnTo = universe.venueCurrent;
		var back = () => universe.venueNext = venueToReturnTo;

		var returnControl = new ControlTabbed<Faction>
		(
			"tabbedItems",
			Coords.create(), // pos
			size,
			tabButtonSize,
			controlsForTabs,
			fontHeightInPixels,
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
		var world = universe.world as WorldExtended;
		var factionCurrent = this;
		var factionsOther = world.factionsOtherThan(factionCurrent);
		var diplomaticSession = DiplomaticSession.demo
		(
			factionCurrent,
			factionsOther,
			universe.venueCurrent
		);
		var diplomaticSessionAsControl =
			diplomaticSession.toControl(universe, size);

		return diplomaticSessionAsControl;
	}

	toControl_Details_Notifications
	(
		universe: Universe, size: Coords
	): ControlBase
	{
		return this.notificationSession.toControl(universe, size);
	}

	toControl_Details_Planets
	(
		universe: Universe,
		size: Coords,
		margin: number,
		controlHeight: number,
		fontHeightInPixels: number
	): ControlBase
	{
		var world = universe.world as WorldExtended;
		var faction = this;

		var containerPlanets = ControlContainer.from4
		(
			"Planets",
			Coords.create(),
			size,
			// children
			[
				new ControlLabel
				(
					"labelPlanets",
					Coords.fromXY(margin, margin),// pos
					Coords.fromXY
					(
						size.x - margin * 2,
						controlHeight
					), // size
					false, // isTextCentered
					DataBinding.fromContext("Planets:"),
					fontHeightInPixels
				),

				new ControlLabel
				(
					"textPlanetCount",
					Coords.fromXY(margin * 8, margin), // pos
					Coords.fromXY
					(
						size.x - margin * 2,
						controlHeight
					), // size
					false, // isTextCentered
					DataBinding.fromContextAndGet
					(
						faction,
						(c: Faction) => "" + c.planets.length
					),
					fontHeightInPixels
				),

				ControlList.from8
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
						(c: Planet) => c.toStringDescription(world)
					), // bindingForItemText
					fontHeightInPixels,
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
				),

				ControlButton.from8
				(
					"buttonGoToSelected",
					Coords.fromXY(margin, size.y - margin - controlHeight), // pos
					Coords.fromXY(5, 1).multiplyScalar(controlHeight), // size
					"Go To",
					fontHeightInPixels,
					true, // hasBorder
					DataBinding.fromContextAndGet
					(
						faction, (c: Faction) => (c.planetSelected != null)
					), // isEnabled
					() => faction.planetSelected.jumpTo(universe) // click
				),

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
		fontHeightInPixels: number
	): ControlBase
	{
		var faction = this;

		var containerShips = ControlContainer.from4
		(
			"Ships",
			Coords.create(),
			size,
			// children
			[
				new ControlLabel
				(
					"labelShips",
					Coords.fromXY(margin, margin),// pos
					Coords.fromXY
					(
						size.x - margin * 2,
						controlHeight
					), // size
					false, // isTextCentered
					DataBinding.fromContext("Ships:"),
					fontHeightInPixels
				),

				new ControlLabel
				(
					"textShipCount",
					Coords.fromXY(margin * 8, margin), // pos
					Coords.fromXY
					(
						size.x - margin * 2,
						controlHeight
					), // size
					false, // isTextCentered
					DataBinding.fromContextAndGet
					(
						faction,
						(c: Faction) => "" + c.ships.length
					),
					fontHeightInPixels
				),

				ControlList.from8
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
					fontHeightInPixels,
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
				),

				ControlButton.from8
				(
					"buttonGoToSelected",
					Coords.fromXY(margin, size.y - margin - controlHeight), // pos
					Coords.fromXY(5, 1).multiplyScalar(controlHeight), // size
					"Go To",
					fontHeightInPixels,
					true, // hasBorder
					DataBinding.fromContextAndGet
					(
						faction, (c: Faction) => (c.shipSelected != null)
					), // isEnabled
					() => faction.shipSelected.jumpTo(universe) // click
				),

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

	allianceProposalAcceptFrom(factionOther: Faction): boolean
	{
		return true;
	}

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
		world: WorldExtended, stateToMatch: string
	): Faction[]
	{
		var returnValues = [];

		for (var i = 0; i < this.relationships.length; i++)
		{
			var relationship = this.relationships[i];
			if (relationship.state == stateToMatch)
			{
				var factionOther = relationship.factionOther(world);
				returnValues.push(factionOther);
			}
		}

		return returnValues;
	}

	peaceOfferAcceptFrom(factionOther: Faction): boolean
	{
		return true;
	}

	relationsInitialize(universe: Universe): void
	{
		var diplomaticSessionAsControl = this.toControl_Details_Diplomacy
		(
			universe, universe.display.sizeInPixels
		);
		var venueNext: Venue = diplomaticSessionAsControl.toVenue();
		universe.venueTransitionTo(venueNext);
	}

	relationshipByFactionName(factionName: string): DiplomaticRelationship
	{
		return this.relationshipsByFactionName.get(factionName);
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

	strength(world: WorldExtended): number
	{
		var returnValue = 0;

		var ships = this.ships;
		for (var i = 0; i < ships.length; i++)
		{
			var ship = ships[i];
			returnValue += ship.strength(world);
		}

		var planets = this.planets;
		for (var i = 0; i < planets.length; i++)
		{
			var planet = planets[i];
			returnValue += planet.strength(world);
		}

		returnValue += this.technologyResearcher.strength(world);

		return returnValue;
	}

	warThreatOfferConcessionsTo(factionOther: Faction): boolean
	{
		return true;
	}

	// notifications

	notificationSessionStart(universe: Universe): void
	{
		var notificationSessionAsControl =
			this.toControl_Details_Notifications
			(
				universe, universe.display.sizeInPixels
			);
		var venueNext: Venue = notificationSessionAsControl.toVenue();
		venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
		universe.venueNext = venueNext;
	}

	// turns

	researchPerTurn(universe: Universe, world: WorldExtended): number
	{
		var returnValue = 0;

		for (var i = 0; i < this.planets.length; i++)
		{
			var planet = this.planets[i];
			var planetResearchThisTurn = planet.researchPerTurn
			(
				universe, world, this
			);
			returnValue += planetResearchThisTurn;
		}

		return returnValue;
	}

	updateForTurn(universe: Universe, world: WorldExtended): void
	{
		for (var i = 0; i < this.planets.length; i++)
		{
			var planet = this.planets[i];
			planet.updateForTurn(universe, world, this);
		}

		for (var i = 0; i < this.ships.length; i++)
		{
			var ship = this.ships[i];
			ship.updateForTurn(universe, world, this);
		}

		this.technologyResearcher.updateForTurn
		(
			universe, world, this
		);
	}
}
