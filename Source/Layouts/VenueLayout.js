
function VenueLayout(venueParent, layout)
{
	this.venueParent = venueParent;
	this.layout = layout;
	this.layoutElementInProgress = null;
}

{
	VenueLayout.prototype.initialize = function(universe)
	{
		var controlRoot = this.controlBuild(universe);
		this.venueControls = new VenueControls(controlRoot);
	}

	VenueLayout.prototype.model = function()
	{
		return this.layout;
	}

	VenueLayout.prototype.updateForTimerTick = function(universe)
	{
		this.venueControls.updateForTimerTick(universe);

		var inputHelper = universe.inputHelper;

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
		).floor();

		if (cursorPos.isInRangeMax(map.sizeInCellsMinusOnes) == true)
		{
			if (inputHelper.isMouseClicked() == true)
			{
				inputHelper.isMouseClicked(false);

				var cursorBodyDefn = cursor.bodyDefn;
				var cellAtCursor = map.cellAtPos(cursorPos);

				if (cursorBodyDefn == null)
				{
					var bodyToRemove = cellAtCursor.body;
					if (bodyToRemove != null)
					{
						layout.elementRemove(bodyToRemove);

						if (bodyToRemove == this.layoutElementInProgress)
						{
							this.layoutElementInProgress = null;
						}
					}
				}
				else
				{
					if (this.layoutElementInProgress != null)
					{
						layout.elementRemove
						(
							this.layoutElementInProgress
						);
					}

					this.layoutElementInProgress = new LayoutElement
					(
						cursorBodyDefn, 
						cursorPos.clone()
					);
					layout.elementAdd(this.layoutElementInProgress);
				}
			}
			else
			{
				// todo - other inputs
			}
		}

		this.draw(universe);
	}

	// controls

	VenueLayout.prototype.controlBuild = function(universe)
	{
		var returnValue = null;

		var controlBuilder = universe.controlBuilder;

		var display = universe.display;
		var containerMainSize = display.sizeInPixels.clone();
		var controlHeight = 12;
		var buttonWidth = 30;
		var margin = 8;
		var fontHeightInPixels = display.fontHeightInPixels;

		var containerInnerSize = new Coords(100, 60);

		var faction = universe.world.factionCurrent();

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
					function click(universe)
					{
						var venueNext = universe.venueCurrent.venueParent;
						venueNext = new VenueFader(venueNext, universe.venueCurrent);
						universe.venueNext = venueNext;
					}
				),

				this.controlBuild_Vitals
				(
					universe,
					containerMainSize, 
					containerInnerSize, 
					margin,
					controlHeight
				),

				faction.controlBuild
				(
					universe,
					containerMainSize,
					containerInnerSize, 
					margin, 
					controlHeight,
					buttonWidth
				),

				this.controlBuild_Industry
				(
					containerMainSize,
					containerInnerSize, 
					margin, 
					controlHeight,
					buttonWidth
				),

				controlBuilder.selection
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
				),


			]
		);

		returnValue = new ControlContainerTransparent(returnValue);

		return returnValue;
	}

	VenueLayout.prototype.controlBuild_Industry = function
	(
		containerMainSize,
		containerInnerSize, 
		margin, 
		controlHeight,
		buttonWidth
	)
	{
		var planet = this.layout.modelParent;

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

				new ControlButton
				(
					"buttonRemove",
					new Coords(containerInnerSize.x - margin - buttonWidth, margin / 2), // pos
					new Coords
					(
						buttonWidth, 
						controlHeight
					), // size
					"X",
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var venueCurrent = universe.venueCurrent;
						venueCurrent.layout.map.cursor.bodyDefn = null;
					}
				),

				new ControlSelect
				(
					"selectBuilding",
					new Coords(margin, controlHeight + margin), // pos
					new Coords(containerInnerSize.x - margin * 2, controlHeight), // size, 
					new DataBinding(planet,  "industry.buildableInProgress()" ), // dataBindingForValueSelected,
					new DataBinding(this.layout.bodyDefns), // dataBindingForOptions,
					null, // bindingExpressionForOptionValues,
					"name", // bindingExpressionForOptionText,
				),

				new ControlLabel
				(
					"labelProgress", 
					new Coords(margin, controlHeight * 2 + margin), // pos
					new Coords(50, controlHeight), // size
					false, // isTextCentered
					new DataBinding(planet.industry, "industryAccumulated") 
				),

				new ControlLabel
				(
					"labelRequired", 
					new Coords(margin + 50, controlHeight * 2 + margin), // pos
					new Coords(50, controlHeight), // size
					false, // isTextCentered
					new DataBinding(planet.industry, "buildableInProgress().industryToBuild") 
				),
			]
		);

		return returnValue;
	}

	VenueLayout.prototype.controlBuild_Vitals = function
	(
		universe,
		containerMainSize, 
		containerInnerSize, 
		margin,
		controlHeight
	)
	{
		var fontHeightInPixels = universe.display.fontHeightInPixels;

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
						universe, "venueCurrent.model().name"
					)
				),

				new ControlLabel
				(
					"labelIndustry",
					new Coords(margin, margin + controlHeight), // pos
					new Coords(containerInnerSize.x - margin * 2, controlHeight), // size
					false, // isTextCentered
					"Industry:"
				),

				new ControlLabel
				(
					"textIndustry",
					new Coords(margin * 8, margin + controlHeight), // pos
					new Coords
					(
						containerInnerSize.x - margin * 3, 
						controlHeight
					), // size
					false, // isTextCentered
					new DataBinding(this.layout, "industryPerTurn()")
				),

				new ControlLabel
				(
					"labelProsperity",
					new Coords(margin, margin + controlHeight * 2), // pos
					new Coords(containerInnerSize.x - margin * 2, controlHeight), // size
					false, // isTextCentered
					"Prosperity:"
				),

				new ControlLabel
				(
					"textProsperity",
					new Coords(margin * 8, margin + controlHeight * 2), // pos
					new Coords
					(
						containerInnerSize.x - margin * 3, 
						controlHeight
					), // size
					false, // isTextCentered
					new DataBinding(this.layout, "prosperityPerTurn()")
				),

				new ControlLabel
				(
					"labelResearch",
					new Coords(margin, margin + controlHeight * 3), // pos
					new Coords(containerInnerSize.x - margin * 2, controlHeight), // size
					false, // isTextCentered
					"Research:"
				),

				new ControlLabel
				(
					"textResearch",
					new Coords(margin * 8, margin + controlHeight * 3), // pos
					new Coords
					(
						containerInnerSize.x - margin * 3, 
						controlHeight
					), // size
					false, // isTextCentered
					new DataBinding(this.layout, "researchPerTurn()")
				),



			]
		);

		return returnValue;
	}


	// drawable

	VenueLayout.prototype.draw = function(universe)
	{
		this.layout.draw(universe, universe.display);
		this.venueControls.draw(universe);
	}
}