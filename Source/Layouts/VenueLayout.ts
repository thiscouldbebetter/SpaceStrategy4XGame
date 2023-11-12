
class VenueLayout implements Venue
{
	venueParent: Venue;
	modelParent: any;
	layout: Layout;

	buildableDefnSelected: BuildableDefn;
	venueControls: VenueControls;

	constructor(venueParent: Venue, modelParent: any, layout: Layout)
	{
		this.venueParent = venueParent;
		this.modelParent = modelParent;
		this.layout = layout;
	}

	buildableDefnsAllowedOnTerrain
	(
		buildableDefnsToCheck: BuildableDefn[],
		terrain: MapTerrain
	): BuildableDefn[]
	{
		var returnValues = buildableDefnsToCheck.filter
		(
			x => x.isAllowedOnTerrain(terrain)
		);

		return returnValues;
	}

	finalize(universe: Universe): void
	{
		// Do nothing.
	}

	initialize(universe: Universe): void
	{
		var controlRoot = this.toControl(universe);
		this.venueControls = new VenueControls(controlRoot, null);

		this.layout.initialize(universe);
	}

	model(): any
	{
		return this.layout;
	}

	updateForTimerTick(universe: Universe): void
	{
		var venueLayout = this;

		this.venueControls.updateForTimerTick(universe);

		var inputHelper = universe.inputHelper;
		var planet = this.modelParent;
		var layout = this.layout;
		var map = layout.map;
		var cursor = map.cursor;
		var cursorPos = cursor.pos;

		cursorPos.overwriteWith
		(
			inputHelper.mouseMovePos
		).subtract
		(
			map.pos
		).divide
		(
			map.cellSizeInPixels
		).round();

		if (cursorPos.isInRangeMax(map.sizeInCellsMinusOnes))
		{
			if (inputHelper.isMouseClicked())
			{
				inputHelper.mouseClickedSet(false);

				var bodyAtCursor = this.layout.map.bodyAtCursor();

				if (bodyAtCursor == null)
				{
					var buildableEntityInProgress =
						planet.buildableEntityInProgress();
					var acknowledge = () => universe.venueNext = venueLayout;
					if (buildableEntityInProgress == null)
					{
						var canBuildAtCursor = false;

						var terrainAtCursor = this.layout.map.terrainAtCursor();

						var isSurface = (terrainAtCursor.name != "Orbit");
						if (isSurface)
						{
							var neighboringBodies = map.bodiesNeighboringCursor();
							if (neighboringBodies.length == 0)
							{
								universe.venueNext = VenueMessage.fromTextAndAcknowledge
								(
									"Must build near other facilities.", acknowledge
								);
							}
							else
							{
								canBuildAtCursor = true;
							}
						}
						else
						{
							canBuildAtCursor = true;
						}

						if (canBuildAtCursor)
						{
							var controlBuildables =
								this.controlBuildableSelectBuild(universe, cursorPos);
							universe.venueNext = new VenueControls(controlBuildables, null);
						}
					}
					else
					{
						universe.venueNext = VenueMessage.fromTextAndAcknowledge
						(
							"Already building something.", acknowledge
						);
					}
				}
				else
				{
					var controlBuildableDetails =
						this.controlBuildableDetailsBuild(universe);
					universe.venueNext = new VenueControls(controlBuildableDetails, null);
				}
			}
		}

		this.draw(universe);
	}

	// controls

	controlBuildableDetailsBuild(universe: Universe): ControlBase
	{
		var layout = this.layout;

		var buildableAtCursorEntity = this.layout.map.bodyAtCursor();
		var buildableAtCursor = Buildable.fromEntity(buildableAtCursorEntity);

		var displaySize = universe.display.sizeInPixels;
		var containerSize = displaySize.clone().half();
		var margin = Coords.fromXY(1, 1).multiplyScalar(8);
		var fontHeightInPixels = 10; // hack
		var fontNameAndHeight =
			FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);
		var listSize = containerSize.clone().subtract(margin).subtract(margin);
		var buttonSize = Coords.fromXY(listSize.x, fontHeightInPixels * 2);

		var venueThis = this; // hack

		var returnValue = ControlContainer.from4
		(
			"containerBuildableDetails",
			displaySize.clone().subtract(containerSize).half(), // pos
			containerSize,
			[
				new ControlLabel
				(
					"labelBuildableName",
					Coords.fromXY(1, 1).multiply(margin),
					listSize,
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext(buildableAtCursor.defnName), // text
					fontNameAndHeight
				),

				ControlButton.from8
				(
					"buttonDemolish",
					Coords.fromXY(margin.x, containerSize.y - margin.y * 2 - buttonSize.y * 2), //pos,
					buttonSize,
					"Demolish", // text,
					fontNameAndHeight,
					true, // hasBorder,
					DataBinding.fromTrue(), // isEnabled,
					() => // click
					{
						ArrayHelper.remove(layout.map.bodies, buildableAtCursorEntity);
						universe.venueNext = venueThis;
					}
				),

				ControlButton.from8
				(
					"buttonDone",
					Coords.fromXY(margin.x, containerSize.y - margin.y - buttonSize.y), //pos,
					buttonSize,
					"Done", // text,
					fontNameAndHeight,
					true, // hasBorder,
					DataBinding.fromTrue(), // isEnabled,
					() => universe.venueNext = venueThis // click
				),
			]
		);

		return returnValue;
	}

	controlBuildableSelectBuild
	(
		universe: Universe, cursorPos: Coords
	): ControlBase
	{
		var venueLayout = this;

		var world = universe.world as WorldExtended;
		var layout = this.layout;
		var map = layout.map;

		var faction = this.modelParent.faction(world);
		// todo - Allow ships to colonize planets with no faction.
		var buildableDefnsAvailable =
		(
			faction == null ? [] : faction.technologyResearcher.buildablesAvailable(world)
		);

		var terrain = map.terrainAtCursor();

		var displaySize = universe.display.sizeInPixels.clone().clearZ();
		var containerSize = displaySize.clone().half();
		var margin = Coords.fromXY(1, 1).multiplyScalar(8);
		var fontHeightInPixels = 10; // hack
		var fontNameAndHeight =
			FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);
		var columnWidth = containerSize.x - margin.x * 2;
		var buttonHeight = fontHeightInPixels * 2;
		var buttonSize = Coords.fromXY
		(
			(columnWidth - margin.x) / 2, buttonHeight
		);
		var listSize = Coords.fromXY
		(
			columnWidth,
			containerSize.y - buttonHeight * 2 - margin.y * 4
		);

		var listBuildables = ControlList.from8
		(
			"listBuildables",
			Coords.fromXY(margin.x, margin.y * 2 + buttonSize.y),
			listSize,
			DataBinding.fromContextAndGet
			(
				this,
				(c: VenueLayout) =>
					c.buildableDefnsAllowedOnTerrain(buildableDefnsAvailable, terrain)
			),
			DataBinding.fromGet
			(
				(c: BuildableDefn) => c.name
			), //bindingForItemText,
			fontNameAndHeight,
			new DataBinding
			(
				this,
				(c: VenueLayout) => c.buildableDefnSelected,
				(c: VenueLayout, v: BuildableDefn) => c.buildableDefnSelected = v
			), // bindingForItemSelected,
			DataBinding.fromGet( (c: BuildableDefn) => c.name) // bindingForItemValue
		);

		var buttonBuild_Clicked = () =>
		{
			var buildableDefnSelected = venueLayout.buildableDefnSelected;
			if (buildableDefnSelected != null)
			{
				var buildableDefnName = buildableDefnSelected.name;
				var layout = venueLayout.layout;
				var cursorPos = layout.map.cursor.pos;
				var buildable = new Buildable(buildableDefnName, cursorPos.clone(), false);
				var buildableEntity = buildable.toEntity(world);
				this.modelParent.buildableEntityBuild(buildableEntity)
			}
			universe.venueNext = venueLayout;
		}

		var buttonCancel_Clicked = () =>
		{
			universe.venueNext = venueLayout;
		}

		var returnValue = ControlContainer.from4
		(
			"containerBuild",
			displaySize.clone().subtract(containerSize).half(), // pos
			containerSize,
			[
				new ControlLabel
				(
					"labelFacilityToBuild",
					margin,
					listSize,
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext("Facility to Build:"), // text
					fontNameAndHeight
				),

				listBuildables,

				ControlButton.from8
				(
					"buttonBuild",
					Coords.fromXY(
						margin.x,
						containerSize.y - margin.y - buttonSize.y
					), //pos,
					buttonSize,
					"Build", // text,
					fontNameAndHeight,
					true, // hasBorder,
					DataBinding.fromContextAndGet
					(
						this,
						(c: VenueLayout) => (c.buildableDefnSelected != null)
					), // isEnabled,
					buttonBuild_Clicked
				),

				ControlButton.from8
				(
					"buttonCancel",
					Coords.fromXY
					(
						margin.x * 2 + buttonSize.x,
						containerSize.y - margin.y - buttonSize.y
					), //pos,
					buttonSize,
					"Cancel", // text,
					fontNameAndHeight,
					true, // hasBorder,
					DataBinding.fromTrue(), // isEnabled,
					buttonCancel_Clicked
				)
			]
		);

		return returnValue;
	}

	toControl(universe: Universe): ControlBase
	{
		var world = universe.world as WorldExtended;
		var controlBuilder = universe.controlBuilder as ControlBuilderExtended;

		var display = universe.display;
		var containerMainSize = display.sizeInPixels.clone();
		var controlHeight = 14;
		var margin = 8;
		var fontHeightInPixels = display.fontNameAndHeight.heightInPixels;
		var fontNameAndHeight =
			FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);

		var containerInnerSize = Coords.fromXY(100, 60);
		var buttonWidth = (containerInnerSize.x - margin * 3) / 2;

		var container = ControlContainer.from4
		(
			"containerMain",
			Coords.fromXY(0, 0), // pos
			containerMainSize,
			// children
			[
				ControlButton.from8
				(
					"buttonBack",
					Coords.fromXY
					(
						(containerMainSize.x - buttonWidth) / 2,
						containerMainSize.y - margin - controlHeight
					), // pos
					Coords.fromXY(buttonWidth, controlHeight), // size
					"Back",
					fontNameAndHeight,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					() => // click
					{
						var venue = universe.venueCurrent as VenueLayout;
						var venueNext = venue.venueParent;
						universe.venueTransitionTo(venueNext);
					}
				),

				this.toControl_Vitals
				(
					universe,
					containerMainSize,
					containerInnerSize,
					margin,
					controlHeight
				),
			]
		);

		var planet = this.modelParent;
		if (planet.factionName != null)
		{
			var factionCurrent = world.factionCurrent();

			if (factionCurrent.name == planet.factionName)
			{
				var faction = factionCurrent;

				var controlFaction = faction.toControl_ClusterOverlay
				(
					universe,
					containerMainSize,
					containerInnerSize,
					margin,
					controlHeight,
					buttonWidth,
					false // includeDetailsButton
				);

				container.childAdd(controlFaction);

				var controlIndustry = this.toControl_Industry
				(
					universe,
					containerMainSize,
					containerInnerSize,
					margin,
					controlHeight,
					buttonWidth
				);

				container.childAdd(controlIndustry);

				var controlSelection = controlBuilder.selection
				(
					universe,
					Coords.fromXY
					(
						containerMainSize.x - margin - containerInnerSize.x,
						containerMainSize.y - margin - containerInnerSize.y
					),
					containerInnerSize,
					margin,
					controlHeight
				);

				container.childAdd(controlSelection);

			}
		}

		var returnValue = new ControlContainerTransparent(container);

		return returnValue;
	}

	toControl_Industry
	(
		universe: Universe,
		containerMainSize: Coords,
		containerInnerSize: Coords,
		margin: number,
		controlHeight: number,
		buttonWidth: number
	)
	{
		var world = universe.world as WorldExtended;
		var planet = this.modelParent;
		var fontHeightInPixels = margin;
		var fontNameAndHeight =
			FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);

		var returnValue = ControlContainer.from4
		(
			"containerViewControls",
			Coords.fromXY
			(
				margin,
				containerMainSize.y
					- margin
					- containerInnerSize.y
			),
			containerInnerSize,
			// children
			[
				new ControlLabel
				(
					"labelBuilding",
					Coords.fromXY(margin, margin), // pos
					Coords.fromXY
					(
						containerInnerSize.x - margin * 2,
						controlHeight
					), // size
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext("Building:"),
					fontNameAndHeight
				),

				new ControlLabel
				(
					"labelBuildable",
					Coords.fromXY(margin, controlHeight + margin), // pos
					Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size,
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContextAndGet
					(
						planet,
						(c) =>
						{
							var buildable = c.buildableInProgress();
							var returnValue =
							(
								buildable == null
								? "[none]"
								: buildable.defnName
							);
							return returnValue;
						}
					),
					fontNameAndHeight
				),

				new ControlLabel
				(
					"labelResourcesRequired",
					Coords.fromXY(margin, controlHeight * 2 + margin), // pos
					Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContextAndGet
					(
						planet,
						(c) =>
						{
							var buildable = c.buildableInProgress();
							var returnValue =
							(
								buildable == null
								? "-"
								: buildable.defn(world).resourcesToBuild.toString()
							);
							return returnValue;
						}
					),
					fontNameAndHeight
				),
			]
		);

		return returnValue;
	}

	toControl_Vitals
	(
		universe: Universe,
		containerMainSize: Coords,
		containerInnerSize: Coords,
		margin: number,
		controlHeight: number
	)
	{
		var planet = this.modelParent;
		var world  = universe.world as WorldExtended;
		var faction = planet.faction(world);

		var column1PosX = margin * 8;
		controlHeight = 10;
		var fontHeightInPixels = controlHeight;
		var fontNameAndHeight =
			FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);

		var size = containerInnerSize;

		var returnValue = ControlContainer.from4
		(
			"containerTimeAndPlace",
			Coords.fromXY(margin, margin),
			size,
			// children
			[
				new ControlLabel
				(
					"textPlace",
					Coords.fromXY(margin,  margin), // pos
					Coords.fromXY
					(
						containerInnerSize.x - margin * 2,
						controlHeight
					), // size
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContextAndGet
					(
						planet, (c: Planet) => c.name
					),
					fontNameAndHeight
				),

				new ControlLabel
				(
					"labelPopulation",
					Coords.fromXY(margin, margin + controlHeight), // pos
					Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext("Population:"),
					fontNameAndHeight
				),

				new ControlLabel
				(
					"textPopulation",
					Coords.fromXY(column1PosX, margin + controlHeight), // pos
					Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContextAndGet
					(
						planet,
						(c: Planet) => "" + c.demographics.population
					),
					fontNameAndHeight
				),

				new ControlLabel
				(
					"labelIndustry",
					Coords.fromXY(margin, margin + controlHeight * 2), // pos
					Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext("Industry:"),
					fontNameAndHeight
				),

				new ControlLabel
				(
					"textIndustry",
					Coords.fromXY(column1PosX, margin + controlHeight * 2), // pos
					Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContextAndGet
					(
						planet,
						(c: Planet) => "" + c.industryPerTurn(universe, world, faction)
					),
					fontNameAndHeight
				),

				new ControlLabel
				(
					"labelProsperity",
					Coords.fromXY(margin, margin + controlHeight * 3), // pos
					Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext("Prosperity:"),
					fontNameAndHeight
				),

				new ControlLabel
				(
					"textProsperity",
					Coords.fromXY(column1PosX, margin + controlHeight * 3), // pos
					Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContextAndGet
					(
						planet,
						(c: Planet) => "" + c.prosperityPerTurn(universe, world, faction)
					),
					fontNameAndHeight
				),

				new ControlLabel
				(
					"labelResearch",
					Coords.fromXY(margin, margin + controlHeight * 4), // pos
					Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext("Research:"),
					fontNameAndHeight
				),

				new ControlLabel
				(
					"textResearch",
					Coords.fromXY(column1PosX, margin + controlHeight * 4), // pos
					Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContextAndGet
					(
						planet,
						(c: Planet) => "" + c.researchPerTurn(universe, world, faction)
					),
					fontNameAndHeight
				),
			]
		);

		return returnValue;
	}

	// drawable

	draw(universe: Universe)
	{
		this.layout.draw(universe, universe.display);
		if (this.venueControls != null)
		{
			this.venueControls.draw(universe);
		}
	}
}
