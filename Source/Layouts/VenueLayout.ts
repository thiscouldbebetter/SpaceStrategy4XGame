
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
		this.venueControls.updateForTimerTick(universe);

		var inputHelper = universe.inputHelper;
		var planet = this.modelParent;
		var layout = this.layout;
		var map = layout.map;
		var cursor = map.cursor;
		var cursorPosInCells = cursor.pos;

		cursorPosInCells.overwriteWith
		(
			inputHelper.mouseMovePos
		).subtract
		(
			map.pos
		).divide
		(
			map.cellSizeInPixels
		).round().clearZ();

		if (cursorPosInCells.isInRangeMax(map.sizeInCellsMinusOnes))
		{
			if (inputHelper.isMouseClicked())
			{
				inputHelper.mouseClickedSet(false);

				this.updateForTimerTick_1(universe, planet, cursorPosInCells);
			}
		}

		this.draw(universe);
	}

	updateForTimerTick_1
	(
		universe: Universe,
		planet: Planet,
		cursorPosInCells: Coords
	): void
	{
		var layout = this.layout;
		var bodyAtCursor = layout.map.bodyAtCursor();

		if (bodyAtCursor != null)
		{
			var controlBuildableDetails =
				this.controlBuildableDetailsBuild(universe);

			universe.venueJumpTo
			(
				new VenueControls(controlBuildableDetails, null)
			);
		}
		else
		{
			var buildableEntityInProgress =
				planet.buildableEntityInProgress(universe);

			var venueLayout = this;
			var acknowledge = () => universe.venueJumpTo(venueLayout);
			var dialogSize = universe.display.sizeInPixels.clone().half();

			if (buildableEntityInProgress != null)
			{
				universe.venueJumpTo
				(
					VenueMessage.fromTextAcknowledgeAndSize
					(
						"Already building something.",
						acknowledge,
						dialogSize
					)
				);
			}
			else if (planet.populationIdle(universe) <= 0)
			{
				universe.venueJumpTo
				(
					VenueMessage.fromTextAcknowledgeAndSize
					(
						"No free population yet.",
						acknowledge,
						dialogSize
					)
				);
			}
			else
			{
				var canBuildAtCursor = false;

				var terrainAtCursor = layout.map.terrainAtCursor();

				var isSurface = (terrainAtCursor.name != "Orbit");
				if (isSurface)
				{
					var map = layout.map;
					var neighboringBodies = map.bodiesNeighboringCursor();
					if (neighboringBodies.length == 0)
					{
						universe.venueJumpTo
						(
							VenueMessage.fromTextAcknowledgeAndSize
							(
								"Must build near other facilities.",
								acknowledge,
								dialogSize
							)
						)
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
						this.controlBuildableSelectBuild(universe, cursorPosInCells);
					universe.venueJumpTo
					(
						new VenueControls(controlBuildables, null)
					);
				}
			}
		}

	}

	// controls

	controlBuildableDetailsBuild(universe: Universe): ControlBase
	{
		var layout = this.layout;

		var map = layout.map;
		var buildableAtCursorEntity = map.bodyAtCursor();
		var buildableAtCursor = Buildable.ofEntity(buildableAtCursorEntity);
		var terrainAtCursor = map.terrainAtCursor();

		var displaySize = universe.display.sizeInPixels;
		var containerSize = displaySize.clone().half();
		var margin = Coords.fromXY(1, 1).multiplyScalar(8);
		var fontHeightInPixels = 10; // hack
		var fontNameAndHeight =
			FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);
		var listSize = containerSize.clone().subtract(margin).subtract(margin);
		var buttonSize = Coords.fromXY(listSize.x, fontHeightInPixels * 2);

		var venueThis = this; // hack

		var labelBuildableName = new ControlLabel
		(
			"labelBuildableName",
			Coords.fromXY(1, 1).multiply(margin),
			listSize,
			false, // isTextCenteredHorizontally
			false, // isTextCenteredVertically
			DataBinding.fromContext(buildableAtCursor.defnName + " on " + terrainAtCursor.name), // text
			fontNameAndHeight
		);

		var buttonDemolish = ControlButton.from8
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
				var controlConfirm = universe.controlBuilder.confirmForUniverseSizeMessageConfirmCancel
				(
					universe,
					containerSize,
					"Really demolish?",
					() => // confirm
					{
						ArrayHelper.remove(layout.map.bodies(), buildableAtCursorEntity);
						universe.venueNextSet(venueThis);
					},
					null // cancel
				);
				var controlConfirmAsVenue = controlConfirm.toVenue();
				universe.venueNextSet(controlConfirmAsVenue);
			}
		);

		var buttonDone = ControlButton.from5
		(
			Coords.fromXY(margin.x, containerSize.y - margin.y - buttonSize.y), //pos,
			buttonSize,
			"Done", // text,
			fontNameAndHeight,
			() => universe.venueJumpTo(venueThis) // click
		);

		var returnValue = ControlContainer.from4
		(
			"containerBuildableDetails",
			displaySize.clone().subtract(containerSize).half(), // pos
			containerSize,
			[
				labelBuildableName,
				buttonDemolish,
				buttonDone
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
				var buildable = new Buildable(buildableDefnName, cursorPos.clone(), false, false);
				var buildableEntity = buildable.toEntity(world);
				this.modelParent.buildableEntityBuild(universe, buildableEntity);
			}
			universe.venueJumpTo(venueLayout);
		}

		var buttonCancel_Clicked = () =>
		{
			universe.venueJumpTo(venueLayout);
		}

		var labelFacilityToBuild = ControlLabel.from4Uncentered
		(
			margin,
			listSize,
			DataBinding.fromContext("Facility to Build on this Cell:"), // text
			fontNameAndHeight
		);

		var buttonBuild = ControlButton.from8
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
		);

		var buttonCancel = ControlButton.from8
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
		);

		var returnValue = ControlContainer.from4
		(
			"containerBuild",
			displaySize.clone().subtract(containerSize).half(), // pos
			containerSize,
			[
				labelFacilityToBuild,
				listBuildables,
				buttonBuild,
				buttonCancel
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

		var containerInnerSize =
			containerMainSize.clone().divide(Coords.fromXY(8, 6) );
		var buttonWidth = (containerInnerSize.x - margin * 3) / 2;

		var buttonBack = ControlButton.from8
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
				var venue = universe.venueCurrent() as VenueLayout;
				var venueNext = venue.venueParent;
				universe.venueTransitionTo(venueNext);
			}
		);

		var controlVitals = this.toControl_Vitals
		(
			universe,
			containerMainSize,
			containerInnerSize,
			margin,
			controlHeight
		);

		var container = ControlContainer.from4
		(
			"containerMain",
			Coords.fromXY(0, 0), // pos
			containerMainSize,
			// children
			[
				buttonBack,
				controlVitals
			]
		);

		var planet = this.modelParent as Planet;
		var planetFactionName = planet.factionable().factionName;

		if (planetFactionName != null)
		{
			var factionCurrent = world.factionCurrent();

			if (factionCurrent.name == planetFactionName)
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

		var labelBuilding = new ControlLabel
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
		);

		var labelBuildable = new ControlLabel
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
		);

		var textResourcesAccumulatedOverRequired = new ControlLabel
		(
			"textResourcesAccumulatedOverRequired",
			Coords.fromXY(margin, controlHeight * 2 + margin), // pos
			Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
			false, // isTextCenteredHorizontally
			false, // isTextCenteredVertically
			DataBinding.fromContextAndGet
			(
				planet,
				(context: any) =>
				{
					var c = context as Planet;
					var buildable = c.buildableInProgress(universe);
					var returnValue =
					(
						buildable == null
						? "-"
						: planet.industryAccumulated()
							+ " / "
							+ buildable.defn(world).industryToBuild
					);
					return returnValue;
				}
			),
			fontNameAndHeight
		);

		var textExpected = new ControlLabel
		(
			"textExpected",
			Coords.fromXY(margin, controlHeight * 3 + margin), // pos
			Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
			false, // isTextCenteredHorizontally
			false, // isTextCenteredVertically
			DataBinding.fromContextAndGet
			(
				planet,
				(context: any) =>
				{
					var returnValue = "";

					var c = context as Planet;
					var buildable = c.buildableInProgress(universe);
					if (buildable == null)
					{
						returnValue = "-";
					}
					else
					{
						var defn = buildable.defn(world);
						var industryToBuild = defn.industryToBuild;
						var industryRemaining = 
							industryToBuild
							- planet.industryAccumulated();
						var industryProducedThisTurn =
							planet.industryPerTurn(universe, world);
						var roundsToBuild: string;
						if (industryProducedThisTurn == 0)
						{
							roundsToBuild = "infinite";
						}
						else
						{
							roundsToBuild = "" + Math.ceil
							(
								industryRemaining / industryProducedThisTurn
							);
							returnValue = roundsToBuild;
						}

						returnValue = "Rounds left: " + roundsToBuild;
					}

					return returnValue;
				}
			),
			fontNameAndHeight
		);

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
				labelBuilding,
				labelBuildable,
				textResourcesAccumulatedOverRequired,
				textExpected
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
		containerInnerSize = containerInnerSize.clone().multiply(Coords.fromXY(2, 1) );

		var planet = this.modelParent;
		var world  = universe.world as WorldExtended;
		var faction = planet.faction(world);

		var column1PosX = margin * 8;
		controlHeight = 10;
		var fontHeightInPixels = controlHeight;
		var fontNameAndHeight =
			FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);

		var size = containerInnerSize;

		var labelName = ControlLabel.from4Uncentered
		(
			Coords.fromXY(margin, margin), // pos
			Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
			DataBinding.fromContext("Name:"),
			fontNameAndHeight
		);

		var textPlace = ControlLabel.from4Uncentered
		(
			Coords.fromXY(column1PosX,  margin), // pos
			Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
			DataBinding.fromContextAndGet
			(
				planet, (c: Planet) => c.name
			),
			fontNameAndHeight
		);

		var labelType = ControlLabel.from4Uncentered
		(
			Coords.fromXY(margin, margin + controlHeight * 1), // pos
			Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
			DataBinding.fromContext("Type:"),
			fontNameAndHeight
		);

		var textPlanetType = ControlLabel.from4Uncentered
		(
			Coords.fromXY(column1PosX,  margin + controlHeight * 1), // pos
			Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
			DataBinding.fromContextAndGet
			(
				planet, (c: Planet) => c.planetType.name()
			),
			fontNameAndHeight
		);

		var labelOwnedBy = ControlLabel.from4Uncentered
		(
			Coords.fromXY(margin, margin + controlHeight * 2), // pos
			Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
			DataBinding.fromContext("Owned by:"),
			fontNameAndHeight
		);

		var textFaction = ControlLabel.from4Uncentered
		(
			Coords.fromXY(column1PosX,  margin + controlHeight * 2), // pos
			Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
			DataBinding.fromContextAndGet
			(
				planet, (c: Planet) => c.factionable().factionName
			),
			fontNameAndHeight
		);

		var labelPopulation = ControlLabel.from4Uncentered
		(
			Coords.fromXY(margin, margin + controlHeight * 3), // pos
			Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
			DataBinding.fromContext("Population:"),
			fontNameAndHeight
		);

		var textPopulation = ControlLabel.from4Uncentered
		(
			Coords.fromXY(column1PosX, margin + controlHeight * 3), // pos
			Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
			DataBinding.fromContextAndGet
			(
				planet,
				(c: Planet) => "" + c.populationOverMaxPlusIdle(universe)
			),
			fontNameAndHeight
		);

		var labelIndustry = ControlLabel.from4Uncentered
		(
			Coords.fromXY(margin, margin + controlHeight * 4), // pos
			Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
			DataBinding.fromContext("Industry:"),
			fontNameAndHeight
		);

		var textIndustry = ControlLabel.from4Uncentered
		(
			Coords.fromXY(column1PosX, margin + controlHeight * 4), // pos
			Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
			DataBinding.fromContextAndGet
			(
				planet,
				(c: Planet) => "" + c.industryPerTurn(universe, world)
			),
			fontNameAndHeight
		);

		var labelProsperity = ControlLabel.from4Uncentered
		(
			Coords.fromXY(margin, margin + controlHeight * 5), // pos
			Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
			DataBinding.fromContext("Prosperity:"),
			fontNameAndHeight
		);

		var textProsperity = ControlLabel.from4Uncentered
		(
			Coords.fromXY(column1PosX, margin + controlHeight * 5), // pos
			Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
			DataBinding.fromContextAndGet
			(
				planet,
				(c: Planet) => c.prosperityNetWithNeededToGrow(universe)
			),
			fontNameAndHeight
		);

		var labelResearch = ControlLabel.from4Uncentered
		(
			Coords.fromXY(margin, margin + controlHeight * 6), // pos
			Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
			DataBinding.fromContext("Research:"),
			fontNameAndHeight
		);

		var textResearch = ControlLabel.from4Uncentered
		(
			Coords.fromXY(column1PosX, margin + controlHeight * 6), // pos
			Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
			DataBinding.fromContextAndGet
			(
				planet,
				(c: Planet) => "" + c.researchPerTurn(universe, world, faction)
			),
			fontNameAndHeight
		);

		var returnValue = ControlContainer.from4
		(
			"containerTimeAndPlace",
			Coords.fromXY(margin, margin),
			size,
			// children
			[
				labelName,
				textPlace,
				labelType,
				textPlanetType,
				labelOwnedBy,
				textFaction,
				labelPopulation,
				textPopulation,
				labelIndustry,
				textIndustry,
				labelProsperity,
				textProsperity,
				labelResearch,
				textResearch
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
