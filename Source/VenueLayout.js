
function VenueLayout(venueParent, layout)
{
	this.venueParent = venueParent;
	this.layout = layout;
	this.layoutElementInProgress = null;
}

{
	VenueLayout.prototype.draw = function()
	{
		Globals.Instance.display.drawLayout(this.layout);
		this.venueControls.draw();
	}

	VenueLayout.prototype.initialize = function()
	{
		var controlRoot = this.controlBuild();
		this.venueControls = new VenueControls(controlRoot);
	}

	VenueLayout.prototype.updateForTimerTick = function()
	{
		this.venueControls.updateForTimerTick();

		var inputHelper = Globals.Instance.inputHelper;

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
			if (inputHelper.isMouseLeftPressed == true)
			{
				inputHelper.isMouseLeftPressed = false;

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
			else if (inputHelper.keyPressed == 13) // return
			{
				inputHelper.keyPressed = null;

				var cursorBodyDefnPrev = cursor.body;
				var bodyDefns = layout.bodyDefns;
				if (cursorBodyDefnPrev == null)
				{
					cursor.bodyDefn = bodyDefns[0];
				}
				else
				{
					var indexOfCursorBodyDefn = bodyDefns.indexOf
					(
						cursorBodyDefnPrev
					);
					indexOfCursorBodyDefn++;
					if (indexOfCursorBodyDefn < bodyDefns.length)
					{
						cursor.bodyDefn = bodyDefns[indexOfCursorBodyDefn];
					}
					else
					{
						cursor.bodyDefn = null;
					}
					
				}	
			}	
		}

		this.draw();
	}

	// controls

	VenueLayout.prototype.controlBuild = function()
	{
		var returnValue = null;

		var display = Globals.Instance.display;
		var containerMainSize = display.sizeInPixels.clone();
		var controlHeight = 16;
		var buttonWidth = 30;
		var margin = 10;
		var fontHeightInPixels = display.fontHeightInPixels;

		var containerInnerSize = new Coords(100, 60);

		var faction = Globals.Instance.universe.world.factionCurrent();

		var returnValue = new ControlContainer
		(
			"containerMain",
			new Coords(0, 0), // pos
			containerMainSize,
			// children
			[
				new ControlButton
				(
					"buttonMenu",
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
					// click
					function()
					{
						var universe = Globals.Instance.universe;
						var venueNext = universe.venueCurrent.venueParent;
						venueNext = new VenueFader(venueNext);
						universe.venueNext = venueNext;
					}
				),

				faction.controlBuild
				(
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

				controlBuilder.timeAndPlace
				(
					containerMainSize, 
					containerInnerSize, 
					margin,
					controlHeight
				),

				controlBuilder.selection
				(
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
					new Coords(0, 0), // size
					false, // isTextCentered
					new DataBinding("Building:")
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
					// click
					function ()
					{
						var universe = Globals.Instance.universe;
						var venueCurrent = universe.venueCurrent;
						venueCurrent.layout.map.cursor.bodyDefn = null;
					}
				),
					
				new ControlSelect
				(
					"selectBuilding",
					new Coords(margin, controlHeight + margin), // pos
					new Coords(containerInnerSize.x - margin * 2, controlHeight), // size, 
					new DataBinding(Globals.Instance.universe.venueCurrent, "layout.map.cursor.bodyDefn" ), // dataBindingForValueSelected,
					new DataBinding(this.layout.bodyDefns), // dataBindingForOptions,
					null, // bindingExpressionForOptionValues,
					"name", // bindingExpressionForOptionText,
					true, // isEnabled,
					1 // numberOfItemsVisible
				),

				new ControlLabel
				(
					"labelProgress", 
					new Coords(margin, controlHeight * 2 + margin), // pos
					new Coords(50, controlHeight), // size
					false, // isTextCentered
					new DataBinding("[progress]") 
				),

				new ControlLabel
				(
					"labelRequired", 
					new Coords(margin + 50, controlHeight * 2 + margin), // pos
					new Coords(50, controlHeight), // size
					false, // isTextCentered
 					new DataBinding("[required]") 
				),
			]
		);


		return returnValue;
	}

}
