
class TechnologyResearchSession
{
	technologyTree: TechnologyTree;
	researcher: TechnologyResearcher;

	control: ControlBase;

	constructor(technologyTree: TechnologyTree, researcher: TechnologyResearcher)
	{
		this.technologyTree = technologyTree;
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
		var returnValue = this.technologyTree.technologyByName(techName);

		return returnValue;
	}

	// controls

	toControl(universe: Universe): ControlBase
	{
		var world = universe.world as WorldExtended;

		var display = universe.display;
		var size = display.sizeInPixels;
		var margin = display.fontHeightInPixels;
		var labelHeight = display.fontHeightInPixels;
		var buttonHeight = labelHeight * 2.5;

		var researcher = this.researcher;

		var returnValue = ControlContainer.from4
		(
			"containerResearchSession", // name,
			Coords.fromXY(0, 0), // pos,
			size,
			// children
			[
				ControlLabel.from5
				(
					"labelResearcher", // name,
					Coords.fromXY(margin, margin), // pos,
					Coords.fromXY(size.x - margin * 2, labelHeight), // size,
					false, // isTextCentered,
					DataBinding.fromContext("Researcher:") //text
				),

				ControlLabel.from5
				(
					"textResearcher", // name,
					Coords.fromXY(100, margin), // pos,
					Coords.fromXY(size.x - margin * 2, labelHeight), // size,
					false, // isTextCentered,
					DataBinding.fromContext(this.researcher.name) //text
				),

				ControlLabel.from5
				(
					"labelResearchPerDay", // name,
					Coords.fromXY(margin, 25), // pos,
					Coords.fromXY(size.x - margin * 2, labelHeight), // size,
					false, // isTextCentered,
					DataBinding.fromContext("Research per Turn:") //text
				),

				ControlLabel.from5
				(
					"textResearchPerTurn", // name,
					Coords.fromXY(100, 25), // pos,
					Coords.fromXY(size.x - margin * 2, labelHeight), // size,
					false, // isTextCentered,
					DataBinding.fromContextAndGet
					(
						this.researcher,
						(c: TechnologyResearcher) => "" + c.researchPerTurn(universe, world)
					) //text
				),

				ControlLabel.from5
				(
					"labelTechnologiesKnown", // name,
					Coords.fromXY(margin, 40), // pos,
					Coords.fromXY(size.x - margin * 2, labelHeight), // size,
					false, // isTextCentered,
					DataBinding.fromContext("Technologies Known:") //text
				),

				ControlList.from6
				(
					"listTechnologiesKnown",
					Coords.fromXY(margin, 55), // pos
					Coords.fromXY(110, 50), // size
					// items
					DataBinding.fromContext
					(
						this.researcher.namesOfTechnologiesKnown
					),
					DataBinding.fromContext(null), // bindingForItemText
					labelHeight // fontHeightInPixels
				),

				ControlLabel.from5
				(
					"labelTechnologiesAvailable", // name,
					Coords.fromXY(140, 40), // pos,
					Coords.fromXY(size.x - margin * 2, labelHeight), // size,
					false, // isTextCentered,
					DataBinding.fromContext("Technologies Available:") // text
				),

				ControlList.from8
				(
					"listTechnologiesAvailable", // name,
					Coords.fromXY(140, 55), // pos,
					Coords.fromXY(110, 50), // size,
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
					labelHeight, // fontHeightInPixels
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

				ControlLabel.from5
				(
					"labelTechnologyBeingResearched", // name,
					Coords.fromXY(margin, 120), // pos,
					Coords.fromXY(size.x - margin * 2, labelHeight), // size,
					false, // isTextCentered,
					DataBinding.fromContext("Technology Being Researched:") // text
				),

				ControlLabel.from5
				(
					"textTechnologyBeingResearched", // name,
					Coords.fromXY(160, 120), // pos,
					Coords.fromXY(size.x - margin * 2, labelHeight), // size,
					false, // isTextCentered,
					DataBinding.fromContextAndGet
					(
						this.researcher,
						(c: TechnologyResearcher) => c.nameOfTechnologyBeingResearched
					)
				),

				ControlLabel.from5
				(
					"labelResearchAccumulated", // name,
					Coords.fromXY(margin, 135), // pos,
					Coords.fromXY(size.x - margin * 2, labelHeight), // size,
					false, // isTextCentered,
					DataBinding.fromContext("Research Accumulated:") // text
				),

				ControlLabel.from5
				(
					"textResearchAccumulated", // name,
					Coords.fromXY(120, 140), // pos,
					Coords.fromXY(30, labelHeight), // size,
					true, // isTextCentered,
					DataBinding.fromContextAndGet
					(
						this.researcher,
						(c: TechnologyResearcher) => "" + c.researchAccumulated
					) // text
				),

				ControlLabel.from5
				(
					"labelSlash", // name,
					Coords.fromXY(130, 140), // pos,
					Coords.fromXY(30, labelHeight), // size,
					true, // isTextCentered,
					DataBinding.fromContext("/") // text
				),

				ControlLabel.from5
				(
					"textResearchRequired", // name,
					Coords.fromXY(140, 140), // pos,
					Coords.fromXY(30, labelHeight), // size,
					true, // isTextCentered,
					DataBinding.fromContextAndGet
					(
						this,
						(c: TechnologyResearchSession) =>
						{
							var tech = c.technologyBeingResearched();
							return (tech == null ? "-" : "" + tech.researchRequired);
						}
					) // text
				),

				ControlButton.from8
				(
					"buttonBack", //name,
					Coords.fromXY(margin, size.y - margin - buttonHeight), //pos,
					Coords.fromXY(buttonHeight, buttonHeight), // size,
					"Back", // text,
					labelHeight, // fontHeightInPixels,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					() => // click
					{
						var venueNext: Venue = universe.world.toVenue();
						venueNext = VenueFader.fromVenuesToAndFrom
						(
							venueNext, universe.venueCurrent
							);
						universe.venueNext = venueNext;
					}
				)

			]
		);

		this.control = returnValue;

		return returnValue;
	}
}
