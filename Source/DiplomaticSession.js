
function DiplomaticSession(diplomaticActions, factionActing, factions)
{
	this.diplomaticActions = diplomaticActions;
	this.diplomaticActions.addLookups("name");

	this.factionActing = factionActing;
	this.factions = factions;
	this.factions.addLookups("name");

	this.factionSelected = null;
}

{
	// static methods

	DiplomaticSession.buildExample = function(factionActing, factions)
	{
		var diplomaticActions = DiplomaticAction.Instances._All;

		var session = new DiplomaticSession
		(
			diplomaticActions,
			factionActing,
			factions
		);

		return session;
	}

	// instance methods

	DiplomaticSession.prototype.isFactionSelected = function()
	{
		return (this.factionSelected != null);
	}

	DiplomaticSession.prototype.talkSessionInitialize = function()
	{
		var universe = Globals.Instance.universe;
		var talkSession = TalkSession.buildExample
		(
			this.factionActing,
			this.factionSelected
		);
		var venueNext = new VenueTalkSession
		(
			universe.venueCurrent, talkSession
		);
		venueNext = new VenueFader(venueNext);
		universe.venueNext = venueNext;
	}

	// controls

	DiplomaticSession.prototype.controlBuild = function()
	{
		var containerSize = Globals.Instance.display.sizeInPixels.clone();
		var margin = 10;
		var controlHeight = 20;
		var listWidth = 100;

		var returnValue = new ControlContainer
		(
			"containerProfileSelect",
			new Coords(0, 0), // pos
			containerSize,
			// children
			[
				new ControlButton
				(
					"buttonDone",
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
					// click
					function ()
					{
						var universe = Globals.Instance.universe;
						var venueNext = universe.venueCurrent.venueParent;
						venueNext = new VenueFader(venueNext);
						universe.venueNext = venueNext;
					}
				),

				new ControlLabel
				(
					"labelFactions",
					new Coords(margin, margin * 2 + controlHeight), // pos
					new Coords(100, controlHeight), // size
					false, // isTextCentered
					new DataBinding("Factions:")
				),

				new ControlSelect
				(
					"listFactions",
					new Coords(margin, margin * 2 + controlHeight * 2), // pos
					new Coords(listWidth, controlHeight * 4), // size
					// dataBindingForValueSelected
					new DataBinding(this, "factionSelected"), 
					new DataBinding(this.factions), // options
					null, // bindingExpressionForOptionValues
					"name", // bindingExpressionForOptionText,
					new DataBinding(true), // isEnabled
					6 // numberOfItemsVisible
				),

				new ControlButton
				(
					"buttonTalk",
					new Coords(margin, margin * 3 + controlHeight * 6), // pos
					new Coords(listWidth, controlHeight), // size
					"Talk",
					// isEnabled
					new DataBinding(this, "isFactionSelected"), 
					// click
					this.talkSessionInitialize.bind(this)
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
	}
}
