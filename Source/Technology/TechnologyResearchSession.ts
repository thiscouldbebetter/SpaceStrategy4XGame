
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
		return (this.researcher.nameOfTechnologyBeingResearched != null);
	}

	researchAccumulatedIncrement
	(
		world: WorldExtended, faction: Faction, amountToIncrement: number
	): void
	{
		this.researcher.researchAccumulatedIncrement(world, faction, amountToIncrement);
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
		var techName = this.researcher.nameOfTechnologyBeingResearched;
		var returnValue = this.technologyGraph.technologyByName(techName);

		return returnValue;
	}

	// controls

	toControl(universe: Universe, size: Coords): ControlBase
	{
		var world = universe.world as WorldExtended;

		var display = universe.display;
		var fontHeightInPixels = display.fontNameAndHeight.heightInPixels;
		var margin = fontHeightInPixels;
		var labelHeight = fontHeightInPixels;
		var buttonHeight = labelHeight * 2.5;
		var fontHeightInPixels = margin;
		var fontNameAndHeight = FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);
		var listSize = Coords.fromXY((size.x - margin * 3) / 2, 150);
		var listPosY = 55;

		var researcher = this.researcher;

		var returnValue = ControlContainer.from4
		(
			"Research", // name,
			Coords.fromXY(0, 0), // pos,
			size,
			// children
			[
				new ControlLabel
				(
					"labelResearcher", // name,
					Coords.fromXY(margin, margin), // pos,
					Coords.fromXY(size.x - margin * 2, labelHeight), // size,
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext("Researcher:"), //text
					fontNameAndHeight
				),

				new ControlLabel
				(
					"textResearcher", // name,
					Coords.fromXY(100, margin), // pos,
					Coords.fromXY(size.x - margin * 2, labelHeight), // size,
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext(this.researcher.name), //text
					fontNameAndHeight
				),

				new ControlLabel
				(
					"labelResearchPerDay", // name,
					Coords.fromXY(margin, 25), // pos,
					Coords.fromXY(size.x - margin * 2, labelHeight), // size,
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext("Research per Turn:"), //text
					fontNameAndHeight
				),

				new ControlLabel
				(
					"textResearchPerTurn", // name,
					Coords.fromXY(100, 25), // pos,
					Coords.fromXY(size.x - margin * 2, labelHeight), // size,
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContextAndGet
					(
						this.researcher,
						(c: TechnologyResearcher) => "" + c.researchPerTurn(universe, world)
					), //text
					fontNameAndHeight
				),

				new ControlLabel
				(
					"labelTechnologiesKnown", // name,
					Coords.fromXY(margin, 40), // pos,
					Coords.fromXY(size.x - margin * 2, labelHeight), // size,
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext("Technologies Known:"), //text
					fontNameAndHeight
				),

				ControlList.from6
				(
					"listTechnologiesKnown",
					Coords.fromXY(margin, listPosY), // pos
					listSize,
					// items
					DataBinding.fromContext
					(
						this.researcher.namesOfTechnologiesKnown
					),
					DataBinding.fromContext(null), // bindingForItemText
					FontNameAndHeight.fromHeightInPixels(labelHeight)
				),

				new ControlLabel
				(
					"labelTechnologiesAvailable", // name,
					Coords.fromXY(margin * 2 + listSize.x, 40), // pos,
					Coords.fromXY(size.x - margin * 2, labelHeight), // size,
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext("Technologies Available:"), // text
					fontNameAndHeight
				),

				ControlList.from8
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
				),

				new ControlLabel
				(
					"labelTechnologyBeingResearched", // name,
					Coords.fromXY(margin, listPosY + listSize.y + margin), // pos,
					Coords.fromXY(size.x - margin * 2, labelHeight), // size,
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext("Technology Being Researched:"), // text
					fontNameAndHeight
				),

				new ControlLabel
				(
					"textTechnologyBeingResearched", // name,
					Coords.fromXY(140, listPosY + listSize.y + margin), // pos,
					Coords.fromXY(size.x - margin * 2, labelHeight), // size,
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContextAndGet
					(
						this.researcher,
						(c: TechnologyResearcher) => c.nameOfTechnologyBeingResearched
					),
					fontNameAndHeight
				),

				new ControlLabel
				(
					"labelResearchAccumulated", // name,
					Coords.fromXY
					(
						margin,
						listPosY + listSize.y + margin + labelHeight
					), // pos,
					Coords.fromXY(size.x - margin * 2, labelHeight), // size,
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext("Research Accumulated:"), // text
					fontNameAndHeight
				),

				new ControlLabel
				(
					"textResearchAccumulatedOverRequired", // name,
					Coords.fromXY
					(
						110,
						listPosY + listSize.y + margin + labelHeight
					), // pos,
					Coords.fromXY(30, labelHeight), // size,
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContextAndGet
					(
						this,
						(c: TechnologyResearchSession) => c.researchAccumulatedOverRequired()
					), // text
					fontNameAndHeight
				),

				new ControlLabel
				(
					"labelGrants", // name,
					Coords.fromXY
					(
						margin,
						listPosY + listSize.y + margin + labelHeight * 2
					), // pos,
					Coords.fromXY(size.x - margin * 2, labelHeight), // size,
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext("Grants:"), // text
					fontNameAndHeight
				),

				new ControlLabel
				(
					"textGrants", // name,
					Coords.fromXY
					(
						110,
						listPosY + listSize.y + margin + labelHeight * 2
					), // pos,
					Coords.fromXY(size.x - margin * 2 - buttonHeight, labelHeight), // size,
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
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
				),

				ControlButton.from8
				(
					"buttonBack", //name,
					Coords.fromXY
					(
						size.x - margin - buttonHeight,
						size.y - margin - buttonHeight
					), //pos,
					Coords.fromXY(buttonHeight, buttonHeight), // size,
					"Back", // text,
					FontNameAndHeight.fromHeightInPixels(labelHeight),
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					() => // click
					{
						var venueNext = universe.world.toVenue();
						universe.venueTransitionTo(venueNext);
					}
				)

			]
		);

		this.control = returnValue;

		return returnValue;
	}
}
