
class WorldGenerator
{
	starsystemCount: number;
	factionCount: number;

	starsystemCountsAvailable: number[];
	factionCountsAvailable: number[];

	constructor
	(
		starsystemCount: number,
		factionCount: number
	)
	{
		this.starsystemCount = starsystemCount;
		this.factionCount = factionCount;

		this.starsystemCountsAvailable = [ 2, 8, 32, 128, 256 ];
		this.factionCountsAvailable = [ 2, 3, 4, 5, 6, 7 ];
	}

	toControl(universe: Universe): ControlBase
	{
		var size = universe.display.sizeInPixels;

		var margin = 8;
		var controlHeight = 12;
		var fontHeightInPixels = 10;
		var buttonSize = Coords.fromXY(4, 1).multiplyScalar(controlHeight);
		var labelSize = Coords.fromXY(4, 1).multiplyScalar(controlHeight);
		var column1PosX = margin * 2 + labelSize.x;

		var childControls =
		[
			new ControlLabel
			(
				"labelWorldGenerationCriteria",
				Coords.fromXY(margin, margin), // pos
				Coords.fromXY(size.x - margin * 2, controlHeight), // size
				false, // isTextCenteredHorizontally
				false, // isTextCenteredVertically
				DataBinding.fromContext("World Generation Criteria:"), // text
				fontHeightInPixels
			),

			new ControlLabel
			(
				"labelStarsystemCount",
				Coords.fromXY(margin, margin * 2 + controlHeight), // pos
				Coords.fromXY(size.x - margin * 2, controlHeight), // size
				false, // isTextCenteredHorizontally
				false, // isTextCenteredVertically
				DataBinding.fromContext("Starsystems:"), // text
				fontHeightInPixels
			),

			new ControlSelect
			(
				"selectStarsystemCount",
				Coords.fromXY(column1PosX, margin * 2 + controlHeight), // pos
				buttonSize,
				new DataBinding
				(
					this,
					(c: WorldGenerator) => c.factionCount,
					(c: WorldGenerator, v: number) => c.factionCount = v
				), // valueSelected
				// options
				DataBinding.fromContextAndGet
				(
					this, (c: WorldGenerator) => c.starsystemCountsAvailable
				),
				DataBinding.fromGet( (c: number) => c ), // bindingForOptionValue
				DataBinding.fromGet( (c: number) => "" + c ), // bindingForOptionText
				fontHeightInPixels
			),

			new ControlLabel
			(
				"labelFactionCount",
				Coords.fromXY(margin, margin * 3 + controlHeight * 2), // pos
				Coords.fromXY(size.x - margin * 2, controlHeight), // size
				false, // isTextCenteredHorizontally
				false, // isTextCenteredVertically
				DataBinding.fromContext("Factions:"), // text
				fontHeightInPixels
			),

			new ControlSelect
			(
				"selectFactionCount",
				Coords.fromXY(column1PosX, margin * 3 + controlHeight * 2), // pos
				buttonSize,
				new DataBinding
				(
					this,
					(c: WorldGenerator) => c.factionCount,
					(c: WorldGenerator, v: number) => c.factionCount = v
				), // valueSelected
				// options
				DataBinding.fromContextAndGet
				(
					this, (c: WorldGenerator) => c.factionCountsAvailable
				),
				DataBinding.fromGet( (c: number) => c ), // bindingForOptionValue
				DataBinding.fromGet( (c: number) => "" + c ), // bindingForOptionText
				fontHeightInPixels
			),

			new ControlButton
			(
				"buttonGenerate",
				Coords.fromXY
				(
					size.x - margin - buttonSize.x,
					size.y - margin - buttonSize.y
				),
				buttonSize,
				"Generate",
				fontHeightInPixels,
				true, // hasBorder
				DataBinding.fromTrue(), // isEnabled,
				() => // click
				{
					alert("todo");
				},
				false // canBeHeldDown
			),

		]

		var returnValue = new ControlContainer
		(
			"containerCreate",
			Coords.zeroes(),
			size,
			childControls,
			[], // actions,
			null //?
		);

		return returnValue;
	}

}