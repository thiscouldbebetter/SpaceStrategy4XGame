
function DiplomaticSession(diplomaticActions, factionActing, factions, venueParent)
{
	this.diplomaticActions = diplomaticActions;
	this.diplomaticActions.addLookupsByName();

	this.factionActing = factionActing;
	this.factions = factions;
	this.factions.addLookupsByName();

	this.venueParent = venueParent;

	this.factionSelected = null;
}

{
	// static methods

	DiplomaticSession.demo = function(factionActing, factions, venueParent)
	{
		var diplomaticActions = DiplomaticAction.Instances._All;

		var session = new DiplomaticSession
		(
			diplomaticActions,
			factionActing,
			factions,
			venueParent
		);

		return session;
	};

	// instance methods

	DiplomaticSession.prototype.isFactionSelected = function()
	{
		return (this.factionSelected != null);
	};

	DiplomaticSession.prototype.talkSessionInitialize = function(universe)
	{
		var talkSession = TalkSession.buildExample
		(
			this.factionActing,
			this.factionSelected
		);
		var venueNext = new VenueTalkSession
		(
			universe.venueCurrent, talkSession
		);
		venueNext = new VenueFader(venueNext, universe.venueCurrent);
		universe.venueNext = venueNext;
	};

	// controls

	DiplomaticSession.prototype.controlBuild = function(universe)
	{
		var containerSize = universe.display.sizeInPixels.clone();
		var margin = 10;
		var controlHeight = 20;
		var listWidth = 100;
		var fontHeightInPixels = margin;

		var returnValue = new ControlContainer
		(
			"containerProfileSelect",
			new Coords(0, 0), // pos
			containerSize,
			// children
			[
				new ControlButton
				(
					"buttonBack",
					new Coords
					(
						margin, margin
					), // pos
					new Coords
					(
						controlHeight, controlHeight
					), // size
					"<",
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var venueNext = new VenueWorld(universe.world);
						venueNext = new VenueFader(venueNext, universe.venueCurrent);
						universe.venueNext = venueNext;
					},
					universe // context
				),

				new ControlLabel
				(
					"labelFactions",
					new Coords(margin, margin * 2 + controlHeight), // pos
					new Coords(100, controlHeight), // size
					false, // isTextCentered
					new DataBinding("Factions:")
				),

				new ControlList
				(
					"listFactions",
					new Coords(margin, margin * 2 + controlHeight * 2), // pos
					new Coords(listWidth, controlHeight * 4), // size
					new DataBinding(this.factions), // items
					new DataBinding(null, function get(c) { return c.name; } ), // bindingForItemText,
					fontHeightInPixels,
					// bindingForItemSelected
					new DataBinding
					(
						this,
						function get(c) { return c.factionSelected; },
						function set(c, v) { c.factionSelected = v; }
					),
					new DataBinding() // bindingForItemValue
				),

				new ControlButton
				(
					"buttonTalk",
					new Coords(margin, margin * 3 + controlHeight * 6), // pos
					new Coords(listWidth, controlHeight), // size
					"Talk",
					fontHeightInPixels,
					true, // hasBorder
					new DataBinding(this, function get(c) { return c.isFactionSelected(); } ), // isEnabled
					this.talkSessionInitialize.bind(this, universe) // click
				),

				Faction.controlBuild_Intelligence
				(
					this,
					new Coords(margin * 2 + listWidth, 0), // pos
					new Coords
					(
						containerSize.x - listWidth - margin * 2,
						containerSize.y
					)
				),


			]
		);

		return returnValue;
	};
}
