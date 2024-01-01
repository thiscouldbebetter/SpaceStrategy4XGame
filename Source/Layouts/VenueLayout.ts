
class VenueLayout implements VenueDrawnOnlyWhenUpdated
{
	venueParent: Venue;
	modelParent: any;
	layout: Layout;

	buildableDefnSelected: BuildableDefn;
	venueControls: VenueControls;

	hasBeenUpdatedSinceDrawn: boolean;

	constructor(venueParent: Venue, modelParent: any, layout: Layout)
	{
		this.venueParent = venueParent;
		this.modelParent = modelParent;
		this.layout = layout;

		this.hasBeenUpdatedSinceDrawn = true;
	}

	buildableDefnSelectedDescription(): string
	{
		return (this.buildableDefnSelected == null ? "" : this.buildableDefnSelected.description);
	}

	buildableDefnsAllowedAtPosInCells
	(
		buildableDefnsToCheck: BuildableDefn[],
		posInCells: Coords
	): BuildableDefn[]
	{
		var returnValues = buildableDefnsToCheck.filter
		(
			x => x.canBeBuiltOnMapAtPosInCells(this.layout.map, posInCells)
		);

		return returnValues;
	}

	finalize(universe: Universe): void
	{
		// universe.soundHelper.soundForMusicPause(universe);
	}

	initialize(universe: Universe): void
	{
		var controlRoot = this.toControl(universe);
		this.venueControls = new VenueControls(controlRoot, null);

		this.layout.initialize(universe);

		var soundHelper = universe.soundHelper;
		soundHelper.soundWithNamePlayAsMusic(universe, "Music_Title");

		this.hasBeenUpdatedSinceDrawn = true;
	}

	model(): any
	{
		return this.layout;
	}

	updateForTimerTick(universe: Universe): void
	{
		this.venueControls.updateForTimerTick(universe);

		var inputHelper = universe.inputHelper;

		if (inputHelper.inputsActive().length > 0)
		{
			this.hasBeenUpdatedSinceDrawn = true;
		}

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

				var isSurface = terrainAtCursor.isSurface();
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
		var buildableAtCursorDefn = buildableAtCursor.defn;
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

		var childControls = new Array<ControlBase>();

		var labelBuildableName = ControlLabel.from4Uncentered
		(
			Coords.fromXY(1, 1).multiply(margin),
			listSize,
			DataBinding.fromContext
			(
				buildableAtCursorDefn.name
				+ " on " + terrainAtCursor.name + " cell"
			),
			fontNameAndHeight
		);

		childControls.push(labelBuildableName);

		var buildableIsComplete = buildableAtCursor.isComplete;

		if (buildableIsComplete)
		{
			var effectsAvailableToUse = buildableAtCursorDefn.effectsAvailableToUse;
			for (var e = 0; e < effectsAvailableToUse.length; e++)
			{
				const effect = effectsAvailableToUse[e]; // Must be const, or otherwise all buttons perform the final effect.

				var eReversed = effectsAvailableToUse.length - e - 1;
				var buttonForEffect = ControlButton.from5
				(
					Coords.fromXY
					(
						margin.x,
						containerSize.y - (margin.y + buttonSize.y) * (3 + eReversed)
					), //pos,
					buttonSize,
					effect.name, // text,
					fontNameAndHeight,
					() =>
					{
						var planet = venueThis.modelParent as Planet;
						var planetAsPlace = planet.toPlace();
						var uwpe = new UniverseWorldPlaceEntities
						(
							universe, universe.world, planetAsPlace,
							buildableAtCursorEntity, null
						);
						effect.apply(uwpe);
					}
				);

				childControls.push(buttonForEffect);
			}
		}

		var textDemolishOrAbandon = (buildableIsComplete ? "Demolish" : "Abandon");

		var buttonDemolishOrAbandon = ControlButton.from5
		(
			Coords.fromXY
			(
				margin.x,
				containerSize.y - (margin.y + buttonSize.y) * 2
			), //pos,
			buttonSize,
			textDemolishOrAbandon,
			fontNameAndHeight,
			() => // click
			{
				var world = universe.world as WorldExtended;

				var entityToDemolish = buildableAtCursorEntity;
				var entityToDemolishFactionable = Factionable.ofEntity(entityToDemolish);
				var entityToDemolishFaction =
					entityToDemolishFactionable == null
					? null
					: entityToDemolishFactionable.faction();
				var factionCurrent = world.factionCurrent();
				var entityToDemolishBelongsToAnotherFaction =
					entityToDemolishFaction != null
					&& entityToDemolishFaction != factionCurrent;

				var controlBuilder = universe.controlBuilder;
				var controlDialog: ControlBase;

				if (entityToDemolishBelongsToAnotherFaction)
				{
					controlDialog = controlBuilder.message4
					(
						universe,
						containerSize,
						DataBinding.fromContext("Can't demolish things you don't own!"),
						() => {}
					);
				}
				else
				{
					controlDialog = controlBuilder.confirmForUniverseSizeMessageConfirmCancel
					(
						universe,
						containerSize,
						"Really " + textDemolishOrAbandon.toLowerCase() + "?",
						() => // confirm
						{
							var mapBodies = layout.map.bodies();
							ArrayHelper.remove(mapBodies, entityToDemolish);
							universe.venueNextSet(venueThis);
						},
						null // cancel
					);
				}

				var controlDialogAsVenue = controlDialog.toVenue();
				universe.venueNextSet(controlDialogAsVenue); // hack - Must be .venueNextSet, otherwise it messes up the expected venue stack.
			}
		);

		childControls.push(buttonDemolishOrAbandon);

		var buttonDone = ControlButton.from5
		(
			Coords.fromXY(margin.x, containerSize.y - margin.y - buttonSize.y), //pos,
			buttonSize,
			"Done", // text,
			fontNameAndHeight,
			() => universe.venueJumpTo(venueThis) // click
		);

		childControls.push(buttonDone);

		var returnValue = ControlContainer.from4
		(
			"containerBuildableDetails",
			displaySize.clone().subtract(containerSize).half(), // pos
			containerSize,
			childControls
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
		var cursor = map.cursor;
		var cursorPosInCells = cursor.pos;

		var faction = this.modelParent.faction(world);
		// todo - Allow ships to colonize planets with no faction.
		var buildableDefnsAvailable =
		(
			faction == null ? [] : faction.technologyResearcher.buildablesAvailable(world)
		);

		var displaySize = universe.display.sizeInPixels.clone().clearZ();
		var containerSize = displaySize.clone().half();
		var margin = Coords.fromXY(1, 1).multiplyScalar(8);
		var fontHeightInPixels = displaySize.x / 60;
		var fontNameAndHeight =
			FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);
		var columnWidth = containerSize.x - margin.x * 2;
		var buttonHeight = fontHeightInPixels * 2;
		var buttonSize = Coords.fromXY
		(
			(columnWidth - margin.x) / 2, buttonHeight
		);
		var labelSize = Coords.fromXY(columnWidth, fontHeightInPixels);
		var listSize = Coords.fromXY
		(
			columnWidth,
			containerSize.y - labelSize.y * 3 - buttonHeight - margin.y * 5
		);

		var terrainAtCursor = map.terrainAtCursor();
		var terrainDescription = terrainAtCursor.name + ": " + terrainAtCursor.description;

		var labelTerrainDescription = ControlLabel.from4Uncentered
		(
			margin,
			labelSize,
			DataBinding.fromContext("Terrain: " + terrainDescription), // text
			fontNameAndHeight
		);

		var labelFacilityToBuild = ControlLabel.from4Uncentered
		(
			Coords.fromXY(margin.x, margin.y + labelSize.y),
			labelSize,
			DataBinding.fromContext("Facility to Build on this Cell:"), // text
			fontNameAndHeight
		);

		var listBuildables = ControlList.from8
		(
			"listBuildables",
			Coords.fromXY
			(
				margin.x,
				margin.y * 2 + labelSize.y * 2
			),
			listSize,
			DataBinding.fromContextAndGet
			(
				this,
				(c: VenueLayout) =>
					c.buildableDefnsAllowedAtPosInCells(buildableDefnsAvailable, cursorPosInCells)
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

		var textFacilityToBuild = ControlLabel.from4Uncentered
		(
			Coords.fromXY
			(
				margin.x,
				margin.y * 3 + labelSize.y * 2 + listSize.y
			),
			labelSize,
			DataBinding.fromContextAndGet
			(
				this,
				(c: VenueLayout) => c.buildableDefnSelectedDescription(),
			), // text
			fontNameAndHeight
		);

		var buttonBuild_Clicked = () =>
		{
			var buildableDefnSelected = venueLayout.buildableDefnSelected;
			if (buildableDefnSelected != null)
			{
				this.layout.buildableDefnStartBuildingAtPos
				(
					universe, buildableDefnSelected, cursorPos.clone()
				);
			}
			universe.venueJumpTo(venueLayout);
		}

		var buttonCancel_Clicked = () =>
		{
			universe.venueJumpTo(venueLayout);
		}

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
				labelTerrainDescription,
				labelFacilityToBuild,
				listBuildables,
				textFacilityToBuild,
				buttonBuild,
				buttonCancel
			]
		);

		return returnValue;
	}

	toControl(universe: Universe): ControlBase
	{
		var world = universe.world as WorldExtended;

		var display = universe.display;
		var containerMainSize = display.sizeInPixels.clone();
		var margin = containerMainSize.x / 60;
		var fontHeightInPixels = margin;
		var controlHeight = margin * 2;
		var fontNameAndHeight =
			FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);

		var containerInnerSize =
			containerMainSize.clone().multiply(Coords.fromXY(.3, .12) );
		var buttonWidth = (containerInnerSize.x - margin * 3) / 2;

		buttonWidth /= 2; // To make it match the Back buttons in starsystem and cluster.

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

		var controlNameTypeOwner = this.toControl_NameTypeOwner
		(
			universe,
			containerMainSize,
			containerInnerSize,
			margin,
			controlHeight
		);

		var containerPopulationAndProductionSize = Coords.fromXY
		(
			containerInnerSize.x * 1.2,
			containerInnerSize.y * 1.4
		);

		var controlPopulationAndProduction = this.toControl_PopulationAndProduction
		(
			universe,
			containerMainSize,
			containerPopulationAndProductionSize,
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
				controlNameTypeOwner,
				controlPopulationAndProduction
			]
		);

		var planet = this.modelParent as Planet;
		var planetFactionName = planet.factionable().faction().name;

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
			}
		}

		var returnValue = new ControlContainerTransparent(container);

		return returnValue;
	}

	toControl_NameTypeOwner
	(
		universe: Universe,
		containerMainSize: Coords,
		containerInnerSize: Coords,
		margin: number,
		controlHeight: number
	)
	{
		var planet = this.modelParent;

		var column1PosX = margin * 6;
		controlHeight = margin * 1;
		var fontHeightInPixels = margin;
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
				planet, (c: Planet) => c.factionable().faction().name
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
				textFaction
			]
		);

		return returnValue;
	}

	toControl_PopulationAndProduction
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

		var column1PosX = margin * 6;
		controlHeight = margin * 1;
		var fontHeightInPixels = margin;
		var fontNameAndHeight =
			FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);

		var size = containerInnerSize;
		var controlSize = Coords.fromXY
		(
			containerInnerSize.x - margin * 2, controlHeight
		);

		var labelPopulation = ControlLabel.from4Uncentered
		(
			Coords.fromXY(margin, margin + controlHeight * 0), // pos
			controlSize,
			DataBinding.fromContext("Population:"),
			fontNameAndHeight
		);

		var textPopulation = ControlLabel.from4Uncentered
		(
			Coords.fromXY(column1PosX, margin + controlHeight * 0), // pos
			controlSize,
			DataBinding.fromContextAndGet
			(
				planet,
				(c: Planet) => "" + c.populationOverMaxPlusIdle(universe)
			),
			fontNameAndHeight
		);

		var labelIndustry = ControlLabel.from4Uncentered
		(
			Coords.fromXY(margin, margin + controlHeight * 1), // pos
			controlSize,
			DataBinding.fromContext("Industry:"),
			fontNameAndHeight
		);

		var textIndustry = ControlLabel.from4Uncentered
		(
			Coords.fromXY(column1PosX, margin + controlHeight * 1), // pos
			controlSize,
			DataBinding.fromContextAndGet
			(
				planet,
				(c: Planet) => "" + c.industryAndBuildableInProgress(universe, world)
			),
			fontNameAndHeight
		);

		var labelProsperity = ControlLabel.from4Uncentered
		(
			Coords.fromXY(margin, margin + controlHeight * 2), // pos
			controlSize,
			DataBinding.fromContext("Prosperity:"),
			fontNameAndHeight
		);

		var textProsperity = ControlLabel.from4Uncentered
		(
			Coords.fromXY(column1PosX, margin + controlHeight * 2), // pos
			controlSize,
			DataBinding.fromContextAndGet
			(
				planet,
				(c: Planet) => c.prosperityNetWithNeededToGrow(universe)
			),
			fontNameAndHeight
		);

		var labelResearch = ControlLabel.from4Uncentered
		(
			Coords.fromXY(margin, margin + controlHeight * 3), // pos
			controlSize,
			DataBinding.fromContext("Research:"),
			fontNameAndHeight
		);

		var textResearch = ControlLabel.from4Uncentered
		(
			Coords.fromXY(column1PosX, margin + controlHeight * 3), // pos
			controlSize,
			DataBinding.fromContextAndGet
			(
				planet,
				(c: Planet) => "" + c.researchThisRound(universe, world, faction)
			),
			fontNameAndHeight
		);

		var checkboxAutomatic = new ControlCheckbox
		(
			"checkboxAutomatic",
			Coords.fromXY(margin, margin + controlHeight * 4.5), // pos
			controlSize,
			DataBinding.fromContext("Choose Projects Automatically"), // text
			fontNameAndHeight,
			DataBinding.fromTrue(), // isEnabled
			new DataBinding
			(
				planet,
				c => c.industry.buildablesAreChosenAutomatically,
				(c, v) => c.industry.buildablesAreChosenAutomatically = v
			)
		);

		var controlPos = Coords.fromXY
		(
			margin, containerMainSize.y - margin - containerInnerSize.y
		);

		var returnValue = ControlContainer.from4
		(
			"containerPopulationAndProduction",
			controlPos,
			size,
			// children
			[
				labelPopulation,
				textPopulation,
				labelIndustry,
				textIndustry,
				labelProsperity,
				textProsperity,
				labelResearch,
				textResearch,
				checkboxAutomatic
			]
		);

		return returnValue;
	}

	// drawable

	draw(universe: Universe)
	{
		var world = universe.world as WorldExtended;

		var shouldDraw =
			world.shouldDrawOnlyWhenUpdated == false
			|| this.hasBeenUpdatedSinceDrawn;

		if (shouldDraw)
		{
			this.hasBeenUpdatedSinceDrawn = false;

			var display = universe.display;

			display.drawBackground(null, null);

			this.visualBackgroundDraw(universe);

			this.layout.draw(universe, universe.display);

			if (this.venueControls != null)
			{
				this.venueControls.draw(universe);
			}
		}
	}

	visualBackgroundDraw(universe: Universe): void
	{
		var display = universe.display;

		var planetType = this.modelParent.planetType;
		var planetScaleFactor = 16;
		var planetRadius = planetType.size.radiusInPixels * planetScaleFactor;
		var planetColor = planetType.environment.color.clone().darken();
		var planetPos = display.sizeInPixels.clone().half();
		planetPos.addXY(0, planetRadius / 2);

		var colors = Color.Instances();
		var colorAtCenter = planetColor;
		var colorMiddle = colorAtCenter;
		var colorSpace = colors.Black;

		// var visualBackground = VisualCircle.fromRadiusAndColorFill(planetRadius, planetColor); // todo
		var visualBackground = new VisualCircleGradient
		(
			planetRadius,
			new ValueBreakGroup
			(
				[
					new ValueBreak(0, colorAtCenter),
					new ValueBreak(.2, colorAtCenter),
					new ValueBreak(.3, colorMiddle),
					new ValueBreak(.75, colorMiddle),
					new ValueBreak(1, colorSpace),
				],
				null // ?
			),
			null // colorBorder
		);

		var visualBackgroundAsEntity =
			Entity.fromProperty(Locatable.fromPos(planetPos) );

		var uwpe = UniverseWorldPlaceEntities.create().entitySet(visualBackgroundAsEntity);
		visualBackground.draw(uwpe, display);
	}
}
