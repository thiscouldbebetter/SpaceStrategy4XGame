
class TechnologyResearchSession
{
	technologyGraph: TechnologyGraph;
	researcher: TechnologyResearcher;

	control: ControlBase;

	constructor(technologyGraph: TechnologyGraph, researcher: TechnologyResearcher)
	{
		this.technologyGraph = technologyGraph;
		this.researcher = researcher;
	}

	// instance methods

	isResearchNotInProgress(): boolean
	{
		var returnValue = (this.researcher.researchAccumulated == 0);
		return returnValue;
	}

	isTechnologyBeingResearched(): boolean
	{
		return (this.researcher.technologyBeingResearchedName != null);
	}

	researchAccumulatedIncrement
	(
		universe: Universe,
		world: WorldExtended,
		faction: Faction,
		amountToIncrement: number
	): void
	{
		this.researcher.researchAccumulatedIncrement(universe, world, faction, amountToIncrement);
	}

	researchAccumulatedOverRequired(): string
	{
		var tech = this.technologyBeingResearched();
		var returnValue =
			"" + this.researcher.researchAccumulated
			+ "/"
			+ (tech == null ? "-" : "" + tech.researchRequired);
		return returnValue;
	}

	researchRequired(): number
	{
		var technologyBeingResearched = this.technologyBeingResearched();
		var returnValue =
		(
			technologyBeingResearched == null
			? 0
			: technologyBeingResearched.researchRequired
		);
		return returnValue;
	}

	technologyBeingResearched(): Technology
	{
		var techName = this.researcher.technologyBeingResearchedName;
		var returnValue = this.technologyGraph.technologyByName(techName);

		return returnValue;
	}

	// controls

	toControl(universe: Universe, size: Coords): ControlBase
	{
		var world = universe.world as WorldExtended;

		var margin = size.x / 80;
		var fontHeightInPixels = margin * 1.5;
		var labelHeight = fontHeightInPixels;
		var buttonHeight = labelHeight * 2.5;
		var fontNameAndHeight = FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);
		var listSize = Coords.fromXY((size.x - margin * 3) / 2, size.y / 2);
		var columnWidth = margin * 16;
		var rowHeight = margin * 2;
		var listPosY = margin * 3 + rowHeight * 4;

		var researcher = this.researcher;

		var labelResearcher = ControlLabel.from4Uncentered
		(
			Coords.fromXY(margin, margin), // pos,
			Coords.fromXY(size.x - margin * 2, labelHeight), // size,
			DataBinding.fromContext("Researcher:"),
			fontNameAndHeight
		);

		var textResearcher = ControlLabel.from4Uncentered
		(
			Coords.fromXY(columnWidth * 1, margin), // pos,
			Coords.fromXY(size.x - margin * 2, labelHeight), // size,
			DataBinding.fromContext(this.researcher.name),
			fontNameAndHeight
		);

		var labelResearchPerDay = ControlLabel.from4Uncentered
		(
			Coords.fromXY(margin, margin + rowHeight), // pos,
			Coords.fromXY(size.x - margin * 2, labelHeight), // size,
			DataBinding.fromContext("Research per Turn:"), //text
			fontNameAndHeight
		);

		var textResearchPerTurn = ControlLabel.from4Uncentered
		(
			Coords.fromXY(columnWidth * 1, margin + rowHeight), // pos,
			Coords.fromXY(size.x - margin * 2, labelHeight), // size,
			DataBinding.fromContextAndGet
			(
				this.researcher,
				(c: TechnologyResearcher) => "" + c.researchPerTurn(universe, world)
			), //text
			fontNameAndHeight
		);

		var labelTechnologiesKnown = ControlLabel.from4Uncentered
		(
			Coords.fromXY(margin, margin * 2 + rowHeight * 3), // pos,
			Coords.fromXY(size.x - margin * 2, labelHeight), // size,
			DataBinding.fromContext("Technologies Known:"), //text
			fontNameAndHeight
		);

		var listTechnologiesKnown = ControlList.from6
		(
			"listTechnologiesKnown",
			Coords.fromXY(margin, listPosY), // pos
			listSize,
			// items
			DataBinding.fromContext
			(
				this.researcher.technologiesKnownNames
			),
			DataBinding.fromContext(null), // bindingForItemText
			FontNameAndHeight.fromHeightInPixels(labelHeight)
		);

		var labelTechnologiesAvailable = ControlLabel.from4Uncentered
		(
			Coords.fromXY(margin * 2 + listSize.x, margin * 2 + rowHeight * 3), // pos,
			Coords.fromXY(size.x - margin * 2, labelHeight), // size,
			DataBinding.fromContext("Technologies Available:"), // text
			fontNameAndHeight
		);

		var listTechnologiesAvailable = ControlList.from8
		(
			"listTechnologiesAvailable", // name,
			Coords.fromXY
			(
				margin * 2 + listSize.x, listPosY
			), // pos,
			listSize,
			// items,
			DataBinding.fromContextAndGet
			(
				researcher,
				(c: TechnologyResearcher) =>
					c.technologiesAvailableForResearch(world)
			),
			DataBinding.fromGet
			(
				(c: Technology) => c.name
			), // bindingForItemText
			FontNameAndHeight.fromHeightInPixels(labelHeight), // fontHeightInPixels
			new DataBinding
			(
				researcher,
				(c: TechnologyResearcher) => c.technologyBeingResearched(world),
				(c: TechnologyResearcher, v: Technology) => c.technologyResearch(v)
			), // bindingForItemSelected
			DataBinding.fromGet
			(
				(c: Technology) => c.name
			) // bindingForItemValue
		);

		var labelTechnologyBeingResearched = ControlLabel.from4Uncentered
		(
			Coords.fromXY(margin, listPosY + listSize.y + margin), // pos,
			Coords.fromXY(size.x - margin * 2, labelHeight), // size,
			DataBinding.fromContext("Researching:"), // text
			fontNameAndHeight
		);

		var textTechnologyBeingResearched = ControlLabel.from4Uncentered
		(
			Coords.fromXY
			(
				margin + columnWidth * 1,
				listPosY + listSize.y + margin
			), // pos,
			Coords.fromXY(size.x - margin * 2, labelHeight), // size,
			DataBinding.fromContextAndGet
			(
				this.researcher,
				(c: TechnologyResearcher) => c.technologyBeingResearchedName
			),
			fontNameAndHeight
		);

		var labelResearchAccumulated = ControlLabel.from4Uncentered
		(
			Coords.fromXY
			(
				margin,
				listPosY + listSize.y + margin + labelHeight
			), // pos,
			Coords.fromXY(size.x - margin * 2, labelHeight), // size,
			DataBinding.fromContext("Research Accumulated:"), // text
			fontNameAndHeight
		);

		var textResearchAccumulatedOverRequired = ControlLabel.from4Uncentered
		(
			Coords.fromXY
			(
				margin + columnWidth * 1,
				listPosY + listSize.y + margin + labelHeight
			), // pos,
			Coords.fromXY(30, labelHeight), // size,
			DataBinding.fromContextAndGet
			(
				this,
				(c: TechnologyResearchSession) => c.researchAccumulatedOverRequired()
			), // text
			fontNameAndHeight
		);

		var labelGrants = ControlLabel.from4Uncentered
		(
			Coords.fromXY
			(
				margin,
				listPosY + listSize.y + margin + labelHeight * 2
			), // pos,
			Coords.fromXY(size.x - margin * 2, labelHeight), // size,
			DataBinding.fromContext("Grants:"), // text
			fontNameAndHeight
		);

		var textGrants = ControlLabel.from4Uncentered
		(
			Coords.fromXY
			(
				margin + columnWidth * 1,
				listPosY + listSize.y + margin + labelHeight * 2
			), // pos,
			Coords.fromXY(size.x - margin * 2 - buttonHeight, labelHeight), // size,
			DataBinding.fromContextAndGet
			(
				this,
				(c: TechnologyResearchSession) =>
				{
					var tech = c.technologyBeingResearched();
					return (tech == null ? "-" : tech.namesOfBuildablesEnabled.join("; ") );
				}
			), // text
			fontNameAndHeight
		);

		var buttonWidth = buttonHeight * 2;

		var buttonDone = ControlButton.from5
		(
			Coords.fromXY
			(
				size.x - margin - buttonWidth,
				size.y - margin - buttonHeight
			), //pos,
			Coords.fromXY(buttonWidth, buttonHeight), // size,
			"Done", // text,
			fontNameAndHeight,
			() => // click
			{
				var venueNext = universe.world.toVenue();
				universe.venueTransitionTo(venueNext);
			}
		);

		var returnValue = ControlContainer.from4
		(
			"Research", // name,
			Coords.fromXY(0, 0), // pos,
			size,
			// children
			[
				labelResearcher,
				textResearcher,
				labelResearchPerDay,
				textResearchPerTurn,
				labelTechnologiesKnown,
				listTechnologiesKnown,
				labelTechnologiesAvailable,
				listTechnologiesAvailable,
				labelTechnologyBeingResearched,
				textTechnologyBeingResearched,
				labelResearchAccumulated,
				textResearchAccumulatedOverRequired,
				labelGrants,
				textGrants,
				buttonDone
			]
		);

		this.control = returnValue;

		return returnValue;
	}
}
