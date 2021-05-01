
class Faction
{
	name: string;
	homestarsystemName: string;
	color: Color;
	relationships: DiplomaticRelationship[];
	technology: TechnologyResearcher;
	planets: Planet[];
	ships: Ship[];
	knowledge: FactionKnowledge

	notificationSession: NotificationSession;
	relationshipsByFactionName: Map<string,DiplomaticRelationship>;
	technologyResearcher: TechnologyResearcher;

	planetSelected: Planet;
	shipSelected: Ship;

	constructor
	(
		name: string,
		homestarsystemName: string,
		color: Color,
		relationships: DiplomaticRelationship[],
		technology: TechnologyResearcher,
		planets: Planet[],
		ships: Ship[],
		knowledge: FactionKnowledge
	)
	{
		this.name = name;
		this.homestarsystemName = homestarsystemName;
		this.color = color;
		this.relationships = relationships;
		this.technology = technology;
		this.planets = planets;
		this.ships = ships;
		this.knowledge = knowledge;

		this.notificationSession = new NotificationSession(this.name, []);
		this.relationshipsByFactionName = ArrayHelper.addLookups
		(
			this.relationships,
			(x: DiplomaticRelationship) => x.factionNameOther
		);
	}

	// static methods

	// controls

	static toControl_Intelligence
	(
		diplomaticSession: DiplomaticSession, pos: Coords, containerSize: Coords
	)
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
				ControlLabel.from5
				(
					"labelFaction",
					Coords.fromXY(margin, margin), // pos
					Coords.fromXY(columnWidth, controlSpacing), // size
					false, // isTextCentered
					"Faction:"
				),

				ControlLabel.from5
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
					)
				),

				ControlLabel.from5
				(
					"labelRelationship",
					Coords.fromXY(margin, margin + controlSpacing), // pos
					Coords.fromXY(columnWidth, controlSpacing), // size
					false, // isTextCentered
					DataBinding.fromContext("Relationship:")
				),

				ControlLabel.from5
				(
					"textRelationship",
					Coords.fromXY(margin + columnWidth, margin + controlSpacing), // pos
					Coords.fromXY(columnWidth, controlSpacing), // size,
					false, // isTextCentered
					DataBinding.fromContext("[relationship]")
				),

				ControlLabel.from5
				(
					"labelPlanets",
					Coords.fromXY(margin, margin + controlSpacing * 2), // pos
					Coords.fromXY(columnWidth, controlSpacing), // size
					false, // isTextCentered
					DataBinding.fromContext("Planets:")
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
						(c: DiplomaticSession) => "todo" // bindingForItemText,
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

				ControlLabel.from5
				(
					"labelShips",
					Coords.fromXY(margin, margin + controlSpacing * 7), // pos
					Coords.fromXY(columnWidth, controlSpacing), // size
					false, // isTextCentered
					DataBinding.fromContext("Ships:")
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
						(c: DiplomaticSession) => "todo"
					), // bindingForOptionText,
					null, // fontHeightInPixels
					// dataBindingForValueSelected
					new DataBinding
					(
						diplomaticSession,
						(c: DiplomaticSession) => c.factionSelected.shipSelected,
						(c: DiplomaticSession, v: Ship) => c.factionSelected.shipSelected = v
					)
				),
			]
		);

		return returnValue;
	}

	// instance methods

	researchSessionStart(universe: Universe)
	{
		var researchSession = new TechnologyResearchSession
		(
			(universe.world as WorldExtended).technologyTree,
			this.technology
		);
		var venueNext: Venue = new VenueTechnologyResearchSession(researchSession);
		venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
		universe.venueNext = venueNext;
	}

	toString()
	{
		return this.name;
	}

	// controls

	toControl
	(
		universe: Universe,
		containerMainSize: Coords,
		containerInnerSize: Coords,
		margin: number,
		controlHeight: number,
		buttonWidth: number
	)
	{
		var fontHeightInPixels = 10;

		var returnValue = ControlContainer.from4
		(
			"containerFaction",
			Coords.fromXY
			(
				containerMainSize.x
					- margin
					- containerInnerSize.x,
				margin
			),
			containerInnerSize.clone().multiply(Coords.fromXY(1, 1.25)),
			// children
			[

				ControlLabel.from5
				(
					"labelFaction",
					Coords.fromXY(margin, 0),// pos
					Coords.fromXY
					(
						containerInnerSize.x - margin * 3,
						controlHeight
					), // size
					false, // isTextCentered
					"Faction:"
				),

				ControlLabel.from5
				(
					"textBoxFaction",
					Coords.fromXY(margin * 2 + containerInnerSize.x * .3, 0), // pos
					Coords.fromXY
					(
						containerInnerSize.x - margin * 3,
						controlHeight
					), // size
					false, // isTextCentered
					this.name
				),

				ControlButton.from9
				(
					"buttonTechnology",
					Coords.fromXY(margin, controlHeight), // pos
					Coords.fromXY(buttonWidth, controlHeight), // size
					"Tech",
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					this.researchSessionStart.bind(this), // click
					universe // context
				),

				ControlButton.from9
				(
					"buttonNotifications",
					Coords.fromXY
					(
						margin,
						controlHeight * 2
					), // pos
					Coords.fromXY(buttonWidth, controlHeight), // size
					"Notes",
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					// click
					this.notificationSessionStart.bind(this),
					universe // context
				),

				ControlButton.from8
				(
					"buttonRelations",
					Coords.fromXY
					(
						margin,
						controlHeight * 3
					), // pos
					Coords.fromXY(buttonWidth, controlHeight), // size
					"Others",
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					// click
					this.relationsInitialize.bind(this, universe)
				),

				ControlButton.from8
				(
					"buttonPlanets",
					Coords.fromXY
					(
						margin * 2 + buttonWidth,
						controlHeight
					), // pos
					Coords.fromXY(buttonWidth, controlHeight), // size
					"Planets",
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					// click
					(universe: Universe) => { alert("todo"); } // click
				),

				ControlButton.from8
				(
					"buttonShips",
					Coords.fromXY
					(
						margin * 2 + buttonWidth,
						controlHeight * 2
					), // pos
					Coords.fromXY(buttonWidth, controlHeight), // size
					"Ships",
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					// click
					(universe: Universe) => { alert("todo"); } // click
				),
			]
		);

		return returnValue;
	}

	// diplomacy

	allianceProposalAcceptFrom(factionOther: Faction)
	{
		return true;
	}

	allies(world: WorldExtended)
	{
		return this.factionsMatchingRelationshipState
		(
			world, DiplomaticRelationship.States().Alliance
		);
	}

	enemies(world: WorldExtended)
	{
		return this.factionsMatchingRelationshipState
		(
			world, DiplomaticRelationship.States().War
		);
	}

	factionsMatchingRelationshipState(world: WorldExtended, stateToMatch: string)
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

	peaceOfferAcceptFrom(factionOther: Faction)
	{
		return true;
	}

	relationsInitialize(universe: Universe)
	{
		var world = universe.world as WorldExtended;
		var factionCurrent = world.factionCurrent();
		var factionsOther = world.factionsOtherThanCurrent();
		var diplomaticSession = DiplomaticSession.demo
		(
			factionCurrent,
			factionsOther,
			universe.venueCurrent
		);
		var diplomaticSessionAsControl =
			diplomaticSession.toControl(universe);
		var venueNext: Venue = diplomaticSessionAsControl.toVenue();
		venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
		universe.venueNext = venueNext;
	}

	relationshipByFactionName(factionName: string)
	{
		return this.relationshipsByFactionName.get(factionName);
	}

	selfAndAllies(world: WorldExtended)
	{
		var returnValues = this.factionsMatchingRelationshipState
		(
			world, DiplomaticRelationship.States().Alliance
		);

		returnValues.push(this);

		return returnValues;
	}

	strength(world: WorldExtended)
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

	warThreatOfferConcessionsTo(factionOther: Faction)
	{
		return true;
	}

	// notifications

	notificationSessionStart(universe: Universe)
	{
		var notificationSession = this.notificationSession;
		var notificationSessionAsControl = notificationSession.toControl(universe);
		var venueNext: Venue = notificationSessionAsControl.toVenue();
		venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
		universe.venueNext = venueNext;
	}

	// turns

	researchPerTurn(universe: Universe, world: WorldExtended)
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

	updateForTurn(universe: Universe, world: WorldExtended)
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

		this.technology.updateForTurn(universe, world, this);
	}
}
