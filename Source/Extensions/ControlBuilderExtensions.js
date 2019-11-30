
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
						function get(c)
						{
							var returnValue = c.venueCurrent.selectionName;
							if (returnValue != null)
							{
								returnValue = returnValue();
							}
							return returnValue;
						}
					)
				),

				new ControlDynamic
				(
					"dynamicSelection",
					new Coords(margin, margin * 2 + controlHeight * 2), // pos
					new Coords(size.x - margin * 2, size.y - margin * 4 - controlHeight * 3), // size
					new DataBinding(universe, function get(c) { return c.venueCurrent.selection; } )
				),

				new ControlButton
				(
					"buttonCenter", // name,
					new Coords(margin, size.y - margin - controlHeight), // pos
					new Coords((size.x - margin * 3) / 2, controlHeight), // size,
					"Center", // text,
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						universe.venueCurrent.cameraCenterOnSelection();
					},
					universe // context
				),

				new ControlButton
				(
					"buttonDetails", // name,
					new Coords
					(
						margin * 2 + ((size.x - margin * 3) / 2),
						size.y - margin - controlHeight
					), // pos
					new Coords((size.x - margin * 3) / 2, controlHeight), // size,
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
								var starsystem = selection.starsystem;
								if (starsystem != null)
								{
									venueNext = new VenueStarsystem(venueCurrent, starsystem);
								}
							}
							else if (selectionTypeName == "Planet")
							{
								venueNext = new VenueLayout(venueCurrent, selection, selection.layout);
							}

							if (venueNext != null)
							{
								venueNext = new VenueFader(venueNext, universe.venueCurrent);
								universe.venueNext = venueNext;
							}
						}
					},
					universe // context
				),

			]
		);

		return returnValue;
	};

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
						universe, function get(c) { return c.venueCurrent.model().name; }
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
					new DataBinding(universe.world, function get(c) { return c.turnsSoFar; } )
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
					},
					universe // context
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
						var world = universe.world;
						var faction = world.factions[0];
						var notificationSession = faction.notificationSession;
						var notifications = notificationSession.notifications;
						if (notifications.length > 0)
						{
							world.updateForTurn(universe);
						}
						else
						{
							while (notifications.length == 0)
							{
								world.updateForTurn(universe);
							}
						}
					},
					universe // context
				)

			]
		);

		return returnValue;
	};

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
						margin + controlHeight,
						margin * 2
					), // pos
					new Coords(controlHeight, controlHeight), // size
					"^",
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						universe.venueCurrent.cameraUp(cameraSpeed);
					},
					universe, // context
					true // canBeHeldDown
				),

				new ControlButton
				(
					"buttonViewDown",
					new Coords
					(
						margin + controlHeight,
						margin * 2 + controlHeight
					), // pos
					new Coords(controlHeight, controlHeight), // size
					"v",
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						universe.venueCurrent.cameraDown(cameraSpeed);
					},
					universe, // context,
					true // canBeHeldDown
				),

				new ControlButton
				(
					"buttonViewLeft",
					new Coords
					(
						margin,
						margin * 2 + controlHeight
					), // pos
					new Coords(controlHeight, controlHeight), // size
					"<",
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						universe.venueCurrent.cameraLeft(cameraSpeed);
					},
					universe, // context
					true // canBeHeldDown
				),

				new ControlButton
				(
					"buttonViewRight",
					new Coords
					(
						margin + controlHeight * 2,
						margin * 2 + controlHeight
					), // pos
					new Coords(controlHeight, controlHeight), // size
					">",
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						universe.venueCurrent.cameraRight(cameraSpeed);
					},
					universe, // context
					true // canBeHeldDown
				),

				new ControlButton
				(
					"buttonViewZoomIn",
					new Coords
					(
						margin * 2 + controlHeight * 2,
						margin
					), // pos
					new Coords(controlHeight, controlHeight), // size
					"In",
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						universe.venueCurrent.cameraIn(cameraSpeed);
					},
					universe, // context,
					true // canBeHeldDown
				),

				new ControlButton
				(
					"buttonViewZoomOut",
					new Coords
					(
						margin * 2 + controlHeight * 3,
						margin
					), // pos
					new Coords(controlHeight, controlHeight), // size
					"Out",
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						universe.venueCurrent.cameraOut(cameraSpeed);
					},
					universe, // context
					true // canBeHeldDown
				),

				new ControlButton
				(
					"buttonViewReset",
					new Coords
					(
						margin * 2.5 + controlHeight * 3,
						margin * 2 + controlHeight
					), // pos
					new Coords(controlHeight, controlHeight), // size
					"x",
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						universe.venueCurrent.cameraReset();
					},
					universe // context
				),
			]
		);

		return returnValue;
	};
}
