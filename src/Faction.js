
function Faction(name, color, relationships, technology, planets, ships, knowledge)
{
	this.name = name;
	this.color = color;
	this.relationships = relationships;
	this.technology = technology;
	this.planets = planets;
	this.ships = ships;
	this.knowledge = knowledge;

	this.notifications = 
	[
		new Notification("Default", "This is a test."),
	];
}

{
	// static methods

	// controls

	Faction.controlBuild_Intelligence = function(diplomaticSession, pos, containerSize)
	{
		var margin = 10;
		var controlSpacing = 20;
		var listWidth = 100;
		var columnWidth = 60;

		var returnValue = new ControlContainer
		(
			"containerFactionIntelligence",
			ControlBuilder.ColorsForeAndBackDefault,
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
					new DataBinding("Faction:")
				),

				new ControlLabel
				(
					"textFaction",
					new Coords(margin + columnWidth, margin), // pos
					new Coords(columnWidth, controlSpacing), // size,
					false, // isTextCentered
					new DataBinding(diplomaticSession, "factionSelected.name")
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

				new ControlSelect
				(
					"listPlanets",
					new Coords(margin, margin + controlSpacing * 3), // pos
					new Coords(listWidth, controlSpacing * 4), // size
					// dataBindingForValueSelected
					new DataBinding(diplomaticSession, "factionSelected.planetSelected"), 
					new DataBinding(diplomaticSession, "factionSelected.planets"), // options
					null, // bindingExpressionForOptionValues
					"name", // bindingExpressionForOptionText,
					new DataBinding(true), // isEnabled
					6 // numberOfItemsVisible
				),

				new ControlLabel
				(
					"labelShips",
					new Coords(margin, margin + controlSpacing * 7), // pos
					new Coords(columnWidth, controlSpacing), // size
					false, // isTextCentered
					new DataBinding("Ships:")
				),

				new ControlSelect
				(
					"listShips",
					new Coords(margin, margin + controlSpacing * 8), // pos
					new Coords(listWidth, controlSpacing * 4), // size
					// dataBindingForValueSelected
					new DataBinding(diplomaticSession, "factionSelected.shipSelected"), 
					new DataBinding(diplomaticSession, "factionSelected.ships"), // options
					null, // bindingExpressionForOptionValues
					"name", // bindingExpressionForOptionText,
					new DataBinding(true), // isEnabled
					6 // numberOfItemsVisible
				),
			]
		);

		return returnValue;
	}

	// instance methods

	Faction.prototype.researchInitialize = function()
	{
		var researchSession = new TechnologyResearchSession
		(
			Globals.Instance.universe.technologyTree,
			this.technology
		);
		var venueNext = new VenueTechnologyResearchSession(researchSession);
		venueNext = new VenueFader(venueNext);
		var universe = Globals.Instance.universe;
		universe.venueNext = venueNext;
	}

	Faction.prototype.toString = function()
	{
		return this.name;
	}

	// controls

	Faction.prototype.controlBuild = function
	(
		containerMainSize,
		containerInnerSize, 
		margin, 
		controlHeight,
		buttonWidth
	)
	{
		var returnValue = new ControlContainer
		(
			"containerFaction",
			ControlBuilder.ColorsForeAndBackDefault,
			new Coords
			(
				containerMainSize.x 
					- margin 
					- containerInnerSize.x, 
				margin
			),
			containerInnerSize,
			// children
			[

				new ControlLabel
				(
					"textBoxFaction",
					new Coords(margin, 0),// pos
					new Coords
					(
						containerInnerSize.x 
							- 40 - margin * 3, 
						controlHeight
					), // size
					false, // isTextCentered
					new DataBinding(this.name)
				),

				new ControlButton
				(
					"buttonTechnology",
					new Coords(margin, controlHeight), // pos
					new Coords(buttonWidth, controlHeight), // size
					"Tech",
					null, // dataBindingForIsEnabled
					this.researchInitialize.bind(this)
				),

				new ControlButton
				(
					"buttonRelations",
					new Coords
					(
						margin * 2 + buttonWidth, 
						controlHeight
					), // pos
					new Coords(buttonWidth, controlHeight), // size
					"Others",
					null, // dataBindingForIsEnabled
					// click
					this.relationsInitialize.bind(this)
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
					null, // dataBindingForIsEnabled
					// click
					this.notificationSessionInitialize.bind(this)
				),
			]
		);

		return returnValue;
	}

	// diplomacy

	Faction.prototype.allianceProposalAcceptFrom = function(factionOther)	
	{
		return true;
	}

	Faction.prototype.allies = function()
	{
		return this.factionsMatchingRelationshipState
		(
			Relationship.States.Alliance
		);
	}

	Faction.prototype.enemies = function()
	{
		return this.factionsMatchingRelationshipState
		(
			Relationship.States.War
		);
	}

	Faction.prototype.factionsMatchingRelationshipState = function(stateToMatch)
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

	Faction.prototype.notificationSessionInitialize = function()
	{
		var universe = Globals.Instance.universe;
		var notificationSession = new NotificationSession(this.notifications);
		var notificationSessionAsControl = notificationSession.controlBuild();
		var venueNext = new VenueControls(notificationSessionAsControl);
		venueNext = new VenueFader(venueNext);
		universe.venueNext = venueNext;
	}

	Faction.prototype.peaceOfferAcceptFrom = function(factionOther)	
	{
		return true;
	}

	Faction.prototype.relationsInitialize = function()
	{
		var universe = Globals.Instance.universe;
		var world = universe.world;
		var factionCurrent = world.factionCurrent();
		var factionsOther = world.factionsOtherThanCurrent();
		var diplomaticSession = DiplomaticSession.buildExample
		(
			factionCurrent,
			factionsOther
		);
		var diplomaticSessionAsControl = diplomaticSession.controlBuild();
		var venueNext = new VenueControls(diplomaticSessionAsControl, universe.venueCurrent);
		venueNext = new VenueFader(venueNext);
		universe.venueNext = venueNext;
	}

	Faction.prototype.selfAndAllies = function()
	{
		var returnValues = this.factionsMatchingRelationshipState
		(
			Relationship.States.Alliance
		);

		returnValues.push(this);

		return returnValues;
	}

	Faction.prototype.strength = function()
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

	Faction.prototype.warThreatOfferConcessionsTo = function(factionOther)	
	{
		return true;
	}

	// turns

	Faction.prototype.updateForTurn = function()
	{
		for (var i = 0; i < this.planets.length; i++)
		{
			var planet = this.planets[i];
			planet.updateForTurn();
		}

		for (var i = 0; i < this.ships.length; i++)
		{
			var ship = this.ships[i];
			ship.updateForTurn();
		}

		this.technology.updateForTurn();
	}
}
