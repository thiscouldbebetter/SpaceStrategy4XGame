
class VenueTalkSession
{
	venueParent: Venue;
	talkSession: TalkSession;

	venueControls: VenueControls;

	constructor(venueParent: Venue, talkSession: TalkSession)
	{
		this.venueParent = venueParent;
		this.talkSession = talkSession;
	}

	draw(universe: Universe)
	{
		this.venueControls.draw(universe);
	}

	finalize(universe: Universe)
	{
		// Do nothing.
	}

	initialize(universe: Universe)
	{
		var controlRoot = this.toControl(universe);
		this.venueControls = controlRoot.toVenue();
		this.talkSession.update();
	}

	updateForTimerTick(universe: Universe)
	{
		this.venueControls.updateForTimerTick(universe);
	}

	// controls

	toControl(universe: Universe)
	{
		var containerSize = universe.display.sizeInPixels.clone();
		var margin = 10;
		var controlHeight = 15;
		var fontHeightInPixels = margin;

		var returnValue = ControlContainer.from4
		(
			"containerConfigure",
			Coords.fromXY(0, 0), // pos
			containerSize,
			// children
			[
				ControlButton.from8
				(
					"buttonBack",
					Coords.fromXY(margin, margin), // pos
					Coords.fromXY(controlHeight, controlHeight), // size
					"<",
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					(universe: Universe) => // click
					{
						var venue = universe.venueCurrent as VenueTalkSession;
						var venueNext = venue.venueParent;
						venueNext = VenueFader.fromVenuesToAndFrom
						(
							venueNext, universe.venueCurrent
						);
						universe.venueNext = venueNext;
					}
				),

				ControlButton.from8
				(
					"buttonLog",
					Coords.fromXY
					(
						containerSize.x - margin - controlHeight * 2, margin
					), // pos
					Coords.fromXY
					(
						controlHeight * 2, controlHeight
					), // size
					"Log",
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					(universe: Universe) => // click
					{
						var venue = universe.venueCurrent as VenueTalkSession;
						var talkSession = venue.talkSession;
						alert(talkSession.log.join("\n"));
					}
				),

				new ControlLabel
				(
					"labelTalk",
					Coords.fromXY(margin, controlHeight + margin * 2), // pos
					Coords.fromXY
					(
						containerSize.x - margin * 2,
						controlHeight
					), // size
					false, // isTextCentered
					DataBinding.fromContextAndGet
					(
						this.talkSession, (c: TalkSession) => c.displayTextCurrent()
					),
					fontHeightInPixels
				),

				ControlList.from8
				(
					"listResponses",
					Coords.fromXY
					(
						margin, controlHeight * 2 + margin * 3
					), // pos
					Coords.fromXY
					(
						containerSize.x - margin * 2,
						controlHeight * 4
					), // size
					// options
					DataBinding.fromContextAndGet
					(
						this.talkSession, (c: TalkSession) => c.optionsAvailable()
					),
					DataBinding.fromGet
					(
						(c: TalkNode) => c.text()
					), // bindingForOptionText
					fontHeightInPixels,
					// dataBindingForValueSelected
					DataBinding.fromContextAndGet
					(
						this.talkSession,
						(c: TalkSession) => c.optionSelected
					),
					null
				),

				ControlButton.from8
				(
					"buttonContinue",
					Coords.fromXY
					(
						margin, controlHeight * 6 + margin * 4
					), // pos
					Coords.fromXY
					(
						containerSize.x - margin * 2,
						controlHeight
					), // size
					"Continue",
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					this.talkSession.respond.bind(this.talkSession, universe)
				),
			]
		);

		return returnValue;
	}
}
