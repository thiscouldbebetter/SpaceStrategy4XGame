
class Faction
{
	constructor(name, homestarsystemName, color, relationships, technology, planets, ships, knowledge)
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
	}

	// static methods

	// controls

	static controlBuild_Intelligence(diplomaticSession, pos, containerSize)
	{
		var margin = 10;
		var controlSpacing = 20;
		var listWidth = 100;
		var columnWidth = 60;
		var fontHeightInPixels = 10;

		var returnValue = new ControlContainer
		(
			"containerFactionIntelligence",
			pos,
			containerSize,
			// children
			[
				new ControlLabel
				(
					"labelFaction",
					new Coords(margin, margin), // pos
					new Coords(columnWidth, controlSpacing), // size
					false, // isTextCentered
					"Faction:"
				),

				new ControlLabel
				(
					"textFaction",
					new Coords(margin * 2 + columnWidth, margin), // pos
					new Coords(columnWidth, controlSpacing), // size,
					false, // isTextCentered
					new DataBinding
					(
						diplomaticSession,
						function get(c)
						{
							return (c.factionSelected == null ? "[none]" : c.factionSelected.name);
						}
					)
				),

				new ControlLabel
				(
					"labelRelationship",
					new Coords(margin, margin + controlSpacing), // pos
					new Coords(columnWidth, controlSpacing), // size
					false, // isTextCentered
					new DataBinding("Relationship:")
				),

				new ControlLabel
				(
					"textRelationship",
					new Coords(margin + columnWidth, margin + controlSpacing), // pos
					new Coords(columnWidth, controlSpacing), // size,
					false, // isTextCentered
					new DataBinding("[relationship]")
				),

				new ControlLabel
				(
					"labelPlanets",
					new Coords(margin, margin + controlSpacing * 2), // pos
					new Coords(columnWidth, controlSpacing), // size
					false, // isTextCentered
					new DataBinding("Planets:")
				),

				new ControlList
				(
					"listPlanets",
					new Coords(margin, margin + controlSpacing * 3), // pos
					new Coords(listWidth, controlSpacing * 4), // size
					new DataBinding
					(
						diplomaticSession,
						(c) => (c.factionSelected == null ? [] : c.factionSelected.planets),
						null
					), // items
					new DataBinding(null, function get(c) { return c.name; } ), // bindingForItemText,
					fontHeightInPixels,
					// dataBindingForItemSelected
					new DataBinding
					(
						diplomaticSession,
						(c) => (c.factionSelected == null ? null : c.factionSelected.planetSelected),
						(c, v) =>
						{
							if (c.factionSelected != null)
							{
								c.factionSelected.planetSelected = v;
							}
						}
					),
					new DataBinding() // bindingForItemValue
				),

				new ControlLabel
				(
					"labelShips",
					new Coords(margin, margin + controlSpacing * 7), // pos
					new Coords(columnWidth, controlSpacing), // size
					false, // isTextCentered
					new DataBinding("Ships:")
				),

				new ControlList
				(
					"listShips",
					new Coords(margin, margin + controlSpacing * 8), // pos
					new Coords(listWidth, controlSpacing * 4), // size
					new DataBinding
					(
						diplomaticSession,
						function get(c) { return (c.factionSelected == null ? [] : c.factionSelected.ships); }
					), // options
					new DataBinding(null, function get(c) { return c.name; } ), // bindingForOptionText,
					// dataBindingForValueSelected
					new DataBinding
					(
						diplomaticSession,
						function get(c) { return c.factionSelected.shipSelected; },
						function set(c, v) { c.factionSelected.shipSelected = v; }
					)
				),
			]
		);

		return returnValue;
	}

	// instance methods

	researchSessionStart(universe)
	{
		var researchSession = new TechnologyResearchSession
		(
			universe.world.technologyTree,
			this.technology
		);
		var venueNext = new VenueTechnologyResearchSession(researchSession);
		venueNext = new VenueFader(venueNext, universe.venueCurrent);
		universe.venueNext = venueNext;
	}

	toString()
	{
		return this.name;
	}

	// controls

	controlBuild
	(
		universe,
		containerMainSize,
		containerInnerSize,
		margin,
		controlHeight,
		buttonWidth
	)
	{
		var fontHeightInPixels = universe.fontHeightInPixels;

		var returnValue = new ControlContainer
		(
			"containerFaction",
			new Coords
			(
				containerMainSize.x
					- margin
					- containerInnerSize.x,
				margin
			),
			containerInnerSize.clone().multiply(new Coords(1, 1.25)),
			// children
			[

				new ControlLabel
				(
					"labelFaction",
					new Coords(margin, 0),// pos
					new Coords
					(
						containerInnerSize.x - margin * 3,
						controlHeight
					), // size
					false, // isTextCentered
					"Faction:"
				),

				new ControlLabel
				(
					"textBoxFaction",
					new Coords(margin * 2 + containerInnerSize.x * .3, 0), // pos
					new Coords
					(
						containerInnerSize.x - margin * 3,
						controlHeight
					), // size
					false, // isTextCentered
					this.name
				),

				new ControlButton
				(
					"buttonTechnology",
					new Coords(margin, controlHeight), // pos
					new Coords(buttonWidth, controlHeight), // size
					"Tech",
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					this.researchSessionStart.bind(this), // click
					universe // context
				),

				new ControlButton
				(
					"buttonNotifications",
					new Coords
					(
						margin,
						controlHeight * 2
					), // pos
					new Coords(buttonWidth, controlHeight), // size
					"Notes",
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					// click
					this.notificationSessionStart.bind(this),
					universe // context
				),

				new ControlButton
				(
					"buttonRelations",
					new Coords
					(
						margin,
						controlHeight * 3
					), // pos
					new Coords(buttonWidth, controlHeight), // size
					"Others",
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					// click
					this.relationsInitialize.bind(this, universe)
				),

				new ControlButton
				(
					"buttonPlanets",
					new Coords
					(
						margin * 2 + buttonWidth,
						controlHeight
					), // pos
					new Coords(buttonWidth, controlHeight), // size
					"Planets",
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					// click
					(universe) => { alert("todo"); } // click
				),

				new ControlButton
				(
					"buttonShips",
					new Coords
					(
						margin * 2 + buttonWidth,
						controlHeight * 2
					), // pos
					new Coords(buttonWidth, controlHeight), // size
					"Ships",
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					// click
					(universe) => { alert("todo"); } // click
				),
			]
		);

		return returnValue;
	}

	// diplomacy

	allianceProposalAcceptFrom(factionOther)
	{
		return true;
	}

	allies()
	{
		return this.factionsMatchingRelationshipState
		(
			Relationship.States.Alliance
		);
	}

	enemies()
	{
		return this.factionsMatchingRelationshipState
		(
			Relationship.States.War
		);
	}

	factionsMatchingRelationshipState(stateToMatch)
	{
		var returnValues = [];

		for (var i = 0; i < this.relationships.length; i++)
		{
			var relationship = this.relationships[i];
			if (relationship.state == stateToMatch)
			{
				var factionOther = relationship.factionOther();
				returnValues.push(factionOther);
			}
		}

		return returnValues;
	}

	peaceOfferAcceptFrom(factionOther)
	{
		return true;
	}

	relationsInitialize(universe)
	{
		var world = universe.world;
		var factionCurrent = world.factionCurrent();
		var factionsOther = world.factionsOtherThanCurrent();
		var diplomaticSession = DiplomaticSession.demo
		(
			factionCurrent,
			factionsOther,
			universe.venueCurrent
		);
		var diplomaticSessionAsControl = diplomaticSession.controlBuild(universe);
		var venueNext = new VenueControls(diplomaticSessionAsControl, universe.venueCurrent);
		venueNext = new VenueFader(venueNext, universe.venueCurrent);
		universe.venueNext = venueNext;
	}

	selfAndAllies()
	{
		var returnValues = this.factionsMatchingRelationshipState
		(
			Relationship.States.Alliance
		);

		returnValues.push(this);

		return returnValues;
	}

	strength()
	{
		var returnValue = 0;

		var ships = this.ships;
		for (var i = 0; i < ships.length; i++)
		{
			var ship = ships[i];
			returnValue += ship.strength();
		}

		var planets = this.planets;
		for (var i = 0; i < planets.length; i++)
		{
			var planet = planets[i];
			returnValue += planet.strength();
		}

		this.technologyResearcher.strength();

		return returnValue;
	}

	warThreatOfferConcessionsTo(factionOther)
	{
		return true;
	}

	// notifications

	notificationSessionStart(universe)
	{
		var notificationSession = this.notificationSession;
		var notificationSessionAsControl = notificationSession.controlBuild(universe);
		var venueNext = new VenueControls(notificationSessionAsControl);
		venueNext = new VenueFader(venueNext, universe.venueCurrent);
		universe.venueNext = venueNext;
	}

	// turns

	researchPerTurn(universe, world)
	{
		var returnValue = 0;

		for (var i = 0; i < this.planets.length; i++)
		{
			var planet = this.planets[i];
			var planetResearchThisTurn = planet.researchPerTurn
			(
				universe, world, this
			);
			if (planetResearchThisTurn != null)
			{
				returnValue += planetResearchThisTurn.quantity;
			}
		}

		return returnValue;
	}

	updateForTurn(universe, world)
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
