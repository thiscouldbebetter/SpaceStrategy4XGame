
function ControlBuilderExtensions()
{
	// extension class
}
{
	ControlBuilder.prototype.selection = function
	(
		pos, 
		size, 
		margin,
		controlHeight
	)
	{	
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
					new DataBinding("Selection:")
				),

				/*
				new ControlPlaceholder
				(
					"placeholderSelection",
					new Coords(margin, controlHeight), // pos
					size.clone(), // size - hack
					"[none]",
					new DataBinding
					(
						Globals.Instance.universe,
						"venueCurrent.selection.controlBuild_Selection"
					)
				),
				*/

				new ControlLabel
				(
					"textSelectionName",
					new Coords(margin, controlHeight), // pos
					new Coords(size.x - margin * 2, controlHeight), // size
					false, // isTextCentered
					new DataBinding
					(
						Globals.Instance.universe,
						"venueCurrent.selectionName()"
					)
				),

				new ControlButton
				(
					"buttonDetails", // name, 
					new Coords(margin, size.y - margin - controlHeight), // pos
					new Coords(size.x - margin * 2, controlHeight), // size, 
					"Details", // text, 
					Globals.Instance.display.fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					// click
					function() 
					{ 
						var universe = Globals.Instance.universe;
						var selection = universe.venueCurrent.selection;
						if (selection != null)
						{
							var venueNext = new VenueStarsystem(selection.starsystem);
							venueNext = new VenueFader(venueNext);
							Globals.Instance.universe.venueNext = venueNext;
						}
					}
				),

			]
		);

		return returnValue;
	}

	ControlBuilder.prototype.timeAndPlace = function
	(
		containerMainSize, 
		containerInnerSize, 
		margin,
		controlHeight
	)
	{
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
					"textDate",
					new Coords(margin,  margin), // pos
					new Coords
					(
						containerInnerSize.x - margin * 2, 
						controlHeight
					), // size
					false, // isTextCentered
					new DataBinding
					(
						Globals.Instance.universe, "venueCurrent.model().name"
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
					new DataBinding(Globals.Instance.universe.world, "turnsSoFar")
				),

				new ControlButton
				(
					"buttonTurnNext", // name, 
					new Coords(margin + 50, margin + controlHeight), // pos
					new Coords(controlHeight, controlHeight), // size, 
					">", // text, 
					Globals.Instance.display.fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					// click
					function() 
					{ 
						var universe = Globals.Instance.universe;
						universe.world.updateForTurn();
					}
				),

				new ControlButton
				(
					"buttonTurnFastForward", // name, 
					new Coords(margin + 50 + controlHeight, margin + controlHeight), // pos
					new Coords(controlHeight, controlHeight), // size, 
					">>", // text, 
					Globals.Instance.display.fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					// click
					function() 
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
		containerMainSize, 
		containerInnerSize, 
		margin,
		controlHeight
	)
	{
		var cameraSpeed = 10;

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
					Globals.Instance.display.fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					// click
					function ()
					{
						var venueCurrent = Globals.Instance.universe.venueCurrent;
						var camera = venueCurrent.camera;
						new Action_CameraMove([0, cameraSpeed]).perform(camera);
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
					Globals.Instance.display.fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					// click
					function ()
					{
						var universe = Globals.Instance.universe;
						var venueCurrent = universe.venueCurrent;
						var camera = venueCurrent.camera;
						new Action_CameraMove([0, 0 - cameraSpeed]).perform(camera);
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
					Globals.Instance.display.fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					// click
					function ()
					{
						var venueCurrent = Globals.Instance.universe.venueCurrent;
						var camera = venueCurrent.camera;
						new Action_CameraMove([cameraSpeed, 0]).perform(camera);
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
					Globals.Instance.display.fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					// click
					function ()
					{
						var venueCurrent = Globals.Instance.universe.venueCurrent;
						var camera = venueCurrent.camera;
						new Action_CameraMove([0 - cameraSpeed, 0]).perform
						(
							camera
						);
					}
				),
			]
		);

		return returnValue;
	}
}
