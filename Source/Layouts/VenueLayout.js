
class VenueLayout
{
	constructor(venueParent, modelParent, layout)
	{
		this.venueParent = venueParent;
		this.modelParent = modelParent;
		this.layout = layout;
	}

	initialize(universe)
	{
		var controlRoot = this.controlBuild(universe);
		this.venueControls = new VenueControls(controlRoot);

		this.layout.initialize(universe);
	}

	model()
	{
		return this.layout;
	}

	updateForTimerTick(universe)
	{
		this.venueControls.updateForTimerTick(universe);

		var inputHelper = universe.inputHelper;
		var world = universe.world;
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
				inputHelper.isMouseClicked(false);

				var bodyAtCursor = this.layout.map.bodyAtCursor();

				if (bodyAtCursor == null)
				{
					var buildableInProgress = planet.buildableInProgress();
					if (buildableInProgress == null)
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
							universe.venueNext = new VenueControls(controlBuildables);
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
						this.controlBuildableDetailsBuild(universe, cursorPos);
					universe.venueNext = new VenueControls(controlBuildableDetails);
				}
			}
		}

		this.draw(universe);
	}

	// controls

	controlBuildableDetailsBuild(universe)
	{
		var planet = this.modelParent; // hack
		var layout = this.layout;
		var map = layout.map;

		var buildableAtCursor = this.layout.map.bodyAtCursor();

		var displaySize = universe.display.sizeInPixels;
		var containerSize = displaySize.clone().half();
		var margin = new Coords(1, 1).multiplyScalar(8);
		var fontHeightInPixels = 10; // hack
		var listSize = containerSize.clone().subtract(margin).subtract(margin);
		var buttonSize = new Coords(listSize.x, fontHeightInPixels * 2);

		var venueThis = this; // hack

		var returnValue = new ControlContainer
		(
			"containerBuildableDetails",
			displaySize.clone().subtract(containerSize).half(), // pos
			containerSize,
			[
				new ControlLabel
				(
					"labelBuildableName",
					new Coords(1, 1).multiply(margin),
					listSize,
					false, // isTextCentered
					buildableAtCursor.defnName // text
				),

				new ControlButton
				(
					"buttonDemolish",
					new Coords(margin.x, containerSize.y - margin.y * 2 - buttonSize.y * 2), //pos,
					buttonSize,
					"Demolish", // text,
					fontHeightInPixels,
					true, // hasBorder,
					true, // isEnabled,
					(universe) => // click
					{
						ArrayHelper.remove(layout.map.bodies, buildableAtCursor);
						universe.venueNext = venueThis;
					},
					universe // context
				),

				new ControlButton
				(
					"buttonDone",
					new Coords(margin.x, containerSize.y - margin.y - buttonSize.y), //pos,
					buttonSize,
					"Done", // text,
					fontHeightInPixels,
					true, // hasBorder,
					true, // isEnabled,
					(universe) => // click
					{
						universe.venueNext = venueThis;
					},
					universe // context
				),
			]
		);

		return returnValue;
	}

	controlBuildableSelectBuild(universe, cursorPos)
	{
		var world = universe.world;
		var layout = this.layout;
		var map = layout.map;

		var faction = this.modelParent.faction(world);
		var buildableDefnsAvailable = faction.technology.buildablesAvailable(world);

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
		var margin = new Coords(1, 1).multiplyScalar(8);
		var fontHeightInPixels = 10; // hack
		var columnWidth = containerSize.x - margin.x * 2;
		var buttonHeight = fontHeightInPixels * 2;
		var buttonSize = new Coords(columnWidth, buttonHeight);
		var listSize = new Coords
		(
			columnWidth,
			containerSize.y - buttonHeight * 2 - margin.y * 4
		);

		var venueThis = this; // hack

		var returnValue = new ControlContainer
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
					false, // isTextCentered
					"Facility to Build:" // text
				),

				new ControlList
				(
					"listBuildables",
					new Coords(margin.x, margin.y * 2 + buttonSize.y),
					listSize,
					buildableDefnsAllowedOnTerrain,
					new DataBinding(null, function get(c) { return c.name; } ), //bindingForItemText,
					fontHeightInPixels,
					new DataBinding(), // bindingForItemSelected,
					new DataBinding(), // bindingForItemValue
				),

				new ControlButton
				(
					"buttonBuild",
					new Coords(margin.x, containerSize.y - margin.y - buttonSize.y), //pos,
					buttonSize,
					"Build", // text,
					fontHeightInPixels,
					true, // hasBorder,
					true, // isEnabled,
					(universe) => // click
					{
						var venueCurrent = universe.venueCurrent;
						var controlList =
							venueCurrent.controlRoot.childrenByName.get("listBuildables");
						var itemSelected = controlList.itemSelected();
						if (itemSelected != null)
						{
							var buildableDefnName = itemSelected.name;
							var layout = venueThis.layout;
							var cursorPos = layout.map.cursor.pos;
							var buildable = new Buildable(buildableDefnName, cursorPos.clone());
							layout.map.bodies.push(buildable);
						}
						universe.venueNext = venueThis;
					},
					universe // context
				)
			]
		);

		return returnValue;
	}

	controlBuild(universe)
	{
		var controlBuilder = new ControlBuilderExtended(universe.controlBuilder);

		var display = universe.display;
		var containerMainSize = display.sizeInPixels.clone();
		var controlHeight = 16;
		var margin = 10;
		var fontHeightInPixels = display.fontHeightInPixels;

		var containerInnerSize = new Coords(100, 60);
		var buttonWidth = (containerInnerSize.x - margin * 3) / 2;

		var returnValue = new ControlContainer
		(
			"containerMain",
			new Coords(0, 0), // pos
			containerMainSize,
			// children
			[
				new ControlButton
				(
					"buttonBack",
					new Coords
					(
						(containerMainSize.x - buttonWidth) / 2,
						containerMainSize.y - margin - controlHeight
					), // pos
					new Coords(buttonWidth, controlHeight), // size
					"Back",
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					(universe) => // click
					{
						var venueNext = universe.venueCurrent.venueParent;
						venueNext = new VenueFader(venueNext, universe.venueCurrent);
						universe.venueNext = venueNext;
					},
					universe // context
				),

				this.controlBuild_Vitals
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
			var factionCurrent = universe.world.factionCurrent();

			if (factionCurrent.name == planet.factionName)
			{
				var faction = factionCurrent;

				var controlFaction = faction.controlBuild
				(
					universe,
					containerMainSize,
					containerInnerSize,
					margin,
					controlHeight,
					buttonWidth
				);

				returnValue.children.push(controlFaction);

				var controlIndustry = this.controlBuild_Industry
				(
					universe,
					containerMainSize,
					containerInnerSize,
					margin,
					controlHeight,
					buttonWidth
				);

				returnValue.children.push(controlIndustry);

				var controlSelection = controlBuilder.selection
				(
					universe,
					new Coords
					(
						containerMainSize.x - margin - containerInnerSize.x,
						containerMainSize.y - margin - containerInnerSize.y
					),
					containerInnerSize,
					margin,
					controlHeight
				);

				returnValue.children.push(controlSelection);

			}
		}

		returnValue = new ControlContainerTransparent(returnValue);

		return returnValue;
	}

	controlBuild_Industry
	(
		universe,
		containerMainSize,
		containerInnerSize,
		margin,
		controlHeight,
		buttonWidth
	)
	{
		var world = universe.world;
		var planet = this.modelParent;
		var faction = planet.faction(world);
		var buildablesAvailable = faction.technology.buildablesAvailable(world);

		var fontHeightInPixels = controlHeight / 2; // hack

		var returnValue = new ControlContainer
		(
			"containerViewControls",
			new Coords
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
					new Coords(margin, margin), // pos
					new Coords
					(
						containerInnerSize.x - margin * 2,
						controlHeight
					), // size
					false, // isTextCentered
					"Building:"
				),

				new ControlLabel
				(
					"labelBuildable",
					new Coords(margin, controlHeight + margin), // pos
					new Coords(containerInnerSize.x - margin * 2, controlHeight), // size,
					false, // isTextCentered
					new DataBinding
					(
						planet,
						function get(c)
						{
							var buildable = c.buildableInProgress();
							return (buildable == null ? "[none]" : buildable.defnName);
						}
					)
				),

				new ControlLabel
				(
					"labelResourcesRequired",
					new Coords(margin, controlHeight * 2 + margin), // pos
					new Coords(containerInnerSize.x - margin * 2, controlHeight), // size
					false, // isTextCentered
					new DataBinding
					(
						planet,
						function get(c)
						{
							var buildable = c.buildableInProgress();
							return (buildable == null ? "-" : buildable.defn(world).resourcesToBuild.toString() );
						}
					)
				),
			]
		);

		return returnValue;
	}

	controlBuild_Vitals
	(
		universe,
		containerMainSize,
		containerInnerSize,
		margin,
		controlHeight
	)
	{
		var fontHeightInPixels = universe.display.fontHeightInPixels;

		var planet = this.modelParent;
		var world  = universe.world;
		var faction = planet.faction(world);

		var returnValue = new ControlContainer
		(
			"containerTimeAndPlace",
			new Coords
			(
				margin,
				margin
			),
			containerInnerSize,
			// children
			[
				new ControlLabel
				(
					"textPlace",
					new Coords(margin,  margin), // pos
					new Coords
					(
						containerInnerSize.x - margin * 2,
						controlHeight
					), // size
					false, // isTextCentered
					new DataBinding
					(
						planet, function get(c) { return c.name; }
					)
				),

				new ControlLabel
				(
					"textIndustry",
					new Coords(margin, margin + controlHeight), // pos
					new Coords(containerInnerSize.x - margin * 2, controlHeight), // size
					false, // isTextCentered
					new DataBinding
					(
						planet,
						function get(c) { return c.industryPerTurn(universe, world, faction); }
					)
				),

				new ControlLabel
				(
					"textProsperity",
					new Coords(margin, margin + controlHeight * 2), // pos
					new Coords(containerInnerSize.x - margin * 2, controlHeight), // size
					false, // isTextCentered
					new DataBinding
					(
						planet,
						function get(c) { return c.prosperityPerTurn(universe, world, faction); }
					)
				),

				new ControlLabel
				(
					"labelResearch",
					new Coords(margin, margin + controlHeight * 3), // pos
					new Coords(containerInnerSize.x - margin * 2, controlHeight), // size
					false, // isTextCentered
					new DataBinding
					(
						planet,
						function get(c) { return c.researchPerTurn(universe, world, faction); }
					)
				),
			]
		);

		return returnValue;
	}

	// drawable

	draw(universe)
	{
		this.layout.draw(universe, universe.display);
		if (this.venueControls != null)
		{
			this.venueControls.draw(universe);
		}
	}
}
