
function ControlBuilderExtensions()
{
	// extension class
}
{
	ControlBuilder.prototype.selection = function
	(
		universe,
		pos, 
		size, 
		margin,
		controlHeight
	)
	{
		var fontHeightInPixels = universe.display.fontHeightInPixels;

		var returnValue = new ControlContainer
		(
			"containerSelected",
			pos.clone(),
			size.clone(),
			// children
			[
				new ControlLabel
				(
					"labelSelected",
					new Coords(margin, margin), // pos
					new Coords(size.x - margin * 2, controlHeight), // size
					false, // isTextCentered
					"Selection:" // text
				),

				new ControlLabel
				(
					"textSelectionName",
					new Coords(margin, margin + controlHeight * .6), // pos
					new Coords(size.x - margin * 2, controlHeight), // size
					false, // isTextCentered
					new DataBinding
					(
						universe,
						"venueCurrent.selectionName()"
					)
				),

				new ControlDynamic
				(
					"dynamicSelection", 
					new Coords(margin, margin * 2 + controlHeight * 2), // pos
					new Coords(size.x - margin * 2, size.y - margin * 4 - controlHeight * 3), // size
					new DataBinding(universe, "venueCurrent.selection")
				),

				new ControlButton
				(
					"buttonDetails", // name, 
					new Coords(margin, size.y - margin - controlHeight), // pos
					new Coords(size.x - margin * 2, controlHeight), // size, 
					"Details", // text, 
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					function click(universe) 
					{ 
						var venueCurrent = universe.venueCurrent;
						var selection = venueCurrent.selection;
						if (selection != null)
						{
							var venueNext;
							var selectionTypeName = selection.constructor.name;
							if (selectionTypeName == "NetworkNode")
							{
								venueNext = new VenueStarsystem(universe, selection.starsystem);
							}
							else if (selectionTypeName == "Planet")
							{
								venueNext = new VenueLayout(venueCurrent, selection.layout);
							}

							if (venueNext != null)
							{
								venueNext = new VenueFader(venueNext, universe.venueCurrent);
								universe.venueNext = venueNext;
							}
						}
					}
				),

			]
		);

		return returnValue;
	}

	ControlBuilder.prototype.timeAndPlace = function
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
					"labelTurn",
					new Coords(margin, margin + controlHeight), // pos
					new Coords(containerInnerSize.x - margin * 2, controlHeight), // size
					false, // isTextCentered
					"Turn:"
				),

				new ControlLabel
				(
					"textTurn",
					new Coords(margin + 25, margin + controlHeight), // pos
					new Coords
					(
						containerInnerSize.x - margin * 3, 
						controlHeight
					), // size
					false, // isTextCentered
					new DataBinding(universe.world, "turnsSoFar")
				),

				new ControlButton
				(
					"buttonTurnNext", // name, 
					new Coords(margin + 50, margin + controlHeight), // pos
					new Coords(controlHeight, controlHeight), // size, 
					">", // text, 
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					function click(universe) 
					{ 
						universe.world.updateForTurn(universe);
					}
				),

				new ControlButton
				(
					"buttonTurnFastForward", // name, 
					new Coords(margin + 50 + controlHeight, margin + controlHeight), // pos
					new Coords(controlHeight, controlHeight), // size, 
					">>", // text, 
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					function click(universe) 
					{ 
						alert("todo - fast forward");
					}
				)

			]
		);

		return returnValue;
	}

	ControlBuilder.prototype.view = function
	(
		universe,
		containerMainSize, 
		containerInnerSize, 
		margin,
		controlHeight
	)
	{
		var cameraSpeed = 10;
		var fontHeightInPixels = universe.display.fontHeightInPixels;

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
					"labelControls",
					new Coords(margin, 0),// pos
					new Coords(containerInnerSize.x, controlHeight), // size
					false, // isTextCentered
					"View"
				),

				new ControlButton
				(
					"buttonViewUp",
					new Coords
					(
						(containerInnerSize.x - (controlHeight * 3)) / 2 + controlHeight, 
						controlHeight
					), // pos
					new Coords(controlHeight, controlHeight), // size
					"^",
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var venueCurrent = universe.venueCurrent;
						var camera = venueCurrent.camera;
						var cameraAction = new Action_CameraMove([0, cameraSpeed]);
						cameraAction.perform(camera);
					}
				),

				new ControlButton
				(
					"buttonViewDown",
					new Coords
					(
						(
							containerInnerSize.x 
							- (controlHeight * 3)
						) 
						/ 2 
						+ controlHeight, 
						controlHeight * 2
					), // pos
					new Coords(controlHeight, controlHeight), // size
					"v",
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var venueCurrent = universe.venueCurrent;
						var camera = venueCurrent.camera;
						var cameraAction = new Action_CameraMove([0, 0 - cameraSpeed]);
						cameraAction.perform(camera);
					}
				),

				new ControlButton
				(
					"buttonViewLeft",
					new Coords
					(
						(containerInnerSize.x - (controlHeight * 3)) / 2, 
						controlHeight * 2
					), // pos
					new Coords(controlHeight, controlHeight), // size
					"<",
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var venueCurrent = universe.venueCurrent;
						var camera = venueCurrent.camera;
						var cameraAction = new Action_CameraMove([cameraSpeed, 0]);
						cameraAction.perform(camera);
					}
				),

				new ControlButton
				(
					"buttonViewRight",
					new Coords
					(
						(
							containerInnerSize.x 
							- (controlHeight * 3)
						) / 2 
						+ controlHeight * 2, 
						controlHeight * 2
					), // pos
					new Coords(controlHeight, controlHeight), // size
					">",
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var venueCurrent = universe.venueCurrent;
						var camera = venueCurrent.camera;
						var cameraAction = new Action_CameraMove([0 - cameraSpeed, 0]);
						cameraAction.perform(camera);
					}
				),
			]
		);

		return returnValue;
	}
}
