
class VenueLayout implements Venue
{
	venueParent: Venue;
	modelParent: any;
	layout: Layout;

	venueControls: VenueControls;

	constructor(venueParent: Venue, modelParent: any, layout: Layout)
	{
		this.venueParent = venueParent;
		this.modelParent = modelParent;
		this.layout = layout;
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
			if (inputHelper.isMouseClicked(null))
			{
				inputHelper.isMouseClicked(false);

				var bodyAtCursor = this.layout.map.bodyAtCursor();

				if (bodyAtCursor == null)
				{
					var buildableEntityInProgress =
						planet.buildableEntityInProgress();
					if (buildableEntityInProgress == null)
					{
						var neighboringBodies = map.bodiesNeighboringCursor();
						if (neighboringBodies.length == 0)
						{
							universe.venueNext = VenueMessage.fromText("Cannot build there.");
						}
						else
						{
							var controlBuildables =
								this.controlBuildableSelectBuild(universe, cursorPos);
							universe.venueNext = new VenueControls(controlBuildables, null);
						}
					}
					else
					{
						universe.venueNext = VenueMessage.fromText("Already building.");
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
		var listSize = containerSize.clone().subtract(margin).subtract(margin);
		var buttonSize = Coords.fromXY(listSize.x, fontHeightInPixels * 2);

		var venueThis = this; // hack

		var returnValue = ControlContainer.from4
		(
			"containerBuildableDetails",
			displaySize.clone().subtract(containerSize).half(), // pos
			containerSize,
			[
				ControlLabel.from5
				(
					"labelBuildableName",
					Coords.fromXY(1, 1).multiply(margin),
					listSize,
					false, // isTextCentered
					DataBinding.fromContext(buildableAtCursor.defnName) // text
				),

				ControlButton.from8
				(
					"buttonDemolish",
					Coords.fromXY(margin.x, containerSize.y - margin.y * 2 - buttonSize.y * 2), //pos,
					buttonSize,
					"Demolish", // text,
					fontHeightInPixels,
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
					fontHeightInPixels,
					true, // hasBorder,
					DataBinding.fromTrue(), // isEnabled,
					() => universe.venueNext = venueThis // click
				),
			]
		);

		return returnValue;
	}

	controlBuildableSelectBuild(universe: Universe, cursorPos: Coords): ControlBase
	{
		var world = universe.world;
		var layout = this.layout;
		var map = layout.map;

		var faction = this.modelParent.faction(world);
		// todo - Allow ships to colonize planets with no faction.
		var buildableDefnsAvailable =
		(
			faction == null ? [] : faction.technology.buildablesAvailable(world)
		);

		var terrainName = map.terrainAtCursor().name;
		var buildableDefnsAllowedOnTerrain = [];
		for (var i = 0; i < buildableDefnsAvailable.length; i++)
		{
			var buildableDefn = buildableDefnsAvailable[i];
			var isBuildableDefnAllowedOnTerrain =
				ArrayHelper.contains(buildableDefn.terrainNamesAllowed, terrainName);
			if (isBuildableDefnAllowedOnTerrain)
			{
				buildableDefnsAllowedOnTerrain.push(buildableDefn);
			}
		}

		var displaySize = universe.display.sizeInPixels.clone().clearZ();
		var containerSize = displaySize.clone().half();
		var margin = Coords.fromXY(1, 1).multiplyScalar(8);
		var fontHeightInPixels = 10; // hack
		var columnWidth = containerSize.x - margin.x * 2;
		var buttonHeight = fontHeightInPixels * 2;
		var buttonSize = Coords.fromXY(columnWidth, buttonHeight);
		var listSize = Coords.fromXY
		(
			columnWidth,
			containerSize.y - buttonHeight * 2 - margin.y * 4
		);

		// var venueThis = this; // hack

		var returnValue = ControlContainer.from4
		(
			"containerBuild",
			displaySize.clone().subtract(containerSize).half(), // pos
			containerSize,
			[
				ControlLabel.from5
				(
					"labelFacilityToBuild",
					margin,
					listSize,
					false, // isTextCentered
					DataBinding.fromContext("Facility to Build:") // text
				),

				ControlList.from8
				(
					"listBuildables",
					Coords.fromXY(margin.x, margin.y * 2 + buttonSize.y),
					listSize,
					DataBinding.fromContext(buildableDefnsAllowedOnTerrain),
					DataBinding.fromGet( (c: BuildableDefn) => c.name ), //bindingForItemText,
					fontHeightInPixels,
					DataBinding.fromContext(null), // bindingForItemSelected,
					DataBinding.fromContext(null), // bindingForItemValue
				),

				ControlButton.from8
				(
					"buttonBuild",
					Coords.fromXY(margin.x, containerSize.y - margin.y - buttonSize.y), //pos,
					buttonSize,
					"Build", // text,
					fontHeightInPixels,
					true, // hasBorder,
					DataBinding.fromTrue(), // isEnabled,
					() => // click
					{
						alert("todo");
						/*
						var venueCurrent =
							universe.venueCurrent as VenueControls;
						var container = venueCurrent.controlRoot as ControlContainer;
						var controlList =
							container.childByName("listBuildables") as ControlList;
						var itemSelected = controlList.itemSelected(null);
						if (itemSelected != null)
						{
							var buildableDefnName = itemSelected.name;
							var layout = venueThis.layout;
							var cursorPos = layout.map.cursor.pos;
							var buildable = new Buildable(buildableDefnName, cursorPos.clone(), null);
							var buildableEntity = new Entity(buildableDefnName, [ buildable ] );
							layout.map.bodies.push(buildableEntity);
						}
						universe.venueNext = venueThis;
						*/
					}
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
		var controlHeight = 16;
		var margin = 10;
		var fontHeightInPixels = display.fontHeightInPixels;

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
					fontHeightInPixels,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					() => // click
					{
						var venue = universe.venueCurrent as VenueLayout;
						var venueNext = venue.venueParent;
						venueNext = VenueFader.fromVenuesToAndFrom
						(
							venueNext, universe.venueCurrent
						);
						universe.venueNext = venueNext;
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

				var controlFaction = faction.toControl
				(
					universe,
					containerMainSize,
					containerInnerSize,
					margin,
					controlHeight,
					buttonWidth
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
				ControlLabel.from5
				(
					"labelBuilding",
					Coords.fromXY(margin, margin), // pos
					Coords.fromXY
					(
						containerInnerSize.x - margin * 2,
						controlHeight
					), // size
					false, // isTextCentered
					DataBinding.fromContext("Building:")
				),

				ControlLabel.from5
				(
					"labelBuildable",
					Coords.fromXY(margin, controlHeight + margin), // pos
					Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size,
					false, // isTextCentered
					DataBinding.fromContextAndGet
					(
						planet,
						(c) =>
						{
							var buildable = c.buildableEntityInProgress();
							return (buildable == null ? "[none]" : buildable.defnName);
						}
					)
				),

				ControlLabel.from5
				(
					"labelResourcesRequired",
					Coords.fromXY(margin, controlHeight * 2 + margin), // pos
					Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
					false, // isTextCentered
					DataBinding.fromContextAndGet
					(
						planet,
						(c) =>
						{
							var buildable = c.buildableEntityInProgress();
							return (buildable == null ? "-" : buildable.defn(world).resourcesToBuild.toString() );
						}
					)
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

		var returnValue = ControlContainer.from4
		(
			"containerTimeAndPlace",
			Coords.fromXY(margin, margin),
			containerInnerSize,
			// children
			[
				ControlLabel.from5
				(
					"textPlace",
					Coords.fromXY(margin,  margin), // pos
					Coords.fromXY
					(
						containerInnerSize.x - margin * 2,
						controlHeight
					), // size
					false, // isTextCentered
					DataBinding.fromContextAndGet
					(
						planet, (c: Planet) => c.name
					)
				),

				ControlLabel.from5
				(
					"textIndustry",
					Coords.fromXY(margin, margin + controlHeight), // pos
					Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
					false, // isTextCentered
					DataBinding.fromContextAndGet
					(
						planet,
						(c: Planet) => "" + c.industryPerTurn(universe, world, faction)
					)
				),

				ControlLabel.from5
				(
					"textProsperity",
					Coords.fromXY(margin, margin + controlHeight * 2), // pos
					Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
					false, // isTextCentered
					DataBinding.fromContextAndGet
					(
						planet,
						(c: Planet) => "" + c.prosperityPerTurn(universe, world, faction)
					)
				),

				ControlLabel.from5
				(
					"labelResearch",
					Coords.fromXY(margin, margin + controlHeight * 3), // pos
					Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
					false, // isTextCentered
					DataBinding.fromContextAndGet
					(
						planet,
						(c: Planet) => "" + c.researchPerTurn(universe, world, faction)
					)
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
