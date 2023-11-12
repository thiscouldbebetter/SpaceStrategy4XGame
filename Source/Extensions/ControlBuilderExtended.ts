
class ControlBuilderExtended extends ControlBuilder
{
	constructor()
	{
		super(null, null);
	}

	selection
	(
		universe: Universe,
		pos: Coords,
		size: Coords, margin: number,
		controlHeight: number
	)
	{
		var fontHeightInPixels = 10; // universe.display.fontHeightInPixels;
		var fontNameAndHeight =
			FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);

		var controlSelectionSize = Coords.fromXY
		(
			size.x - margin * 2,
			size.y - margin * 4 - controlHeight * 3
		);

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
					Coords.fromXY(margin, margin), // pos
					Coords.fromXY(size.x - margin * 2, controlHeight), // size
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext("Selection:"), // text
					fontNameAndHeight
				),

				new ControlLabel
				(
					"textSelectionName",
					Coords.fromXY(margin, margin + controlHeight * .6), // pos
					Coords.fromXY(size.x - margin * 2, controlHeight), // size
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContextAndGet
					(
						universe,
						(c: Universe) =>
						{
							var returnValue = null;
							var venue = c.venueCurrent;
							var venueTypeName = venue.constructor.name;
							if (venueTypeName == VenueWorldExtended.name)
							{
								returnValue = (venue as VenueWorldExtended).selectionName();
							}
							else if (venueTypeName == VenueStarsystem.name)
							{
								returnValue = (venue as VenueStarsystem).selectionName();
							}
							return returnValue;
						}
					),
					fontNameAndHeight
				),

				new ControlDynamic
				(
					"dynamicSelection",
					Coords.fromXY(margin, margin * 2 + controlHeight * 2), // pos
					controlSelectionSize, // size
					DataBinding.fromContextAndGet
					(
						universe,
						(c: Universe) =>
							(c.venueCurrent as VenueStarsystem).selectedEntity, // get
					),
					(v: Entity) =>
					{
						return v.controllable().toControl
						(
							new UniverseWorldPlaceEntities
							(
								universe, null, null, v, null
							),
							controlSelectionSize,
							Starsystem.name
						);
					}
				),

				ControlButton.from8
				(
					"buttonCenter", // name,
					Coords.fromXY(margin, size.y - margin - controlHeight), // pos
					Coords.fromXY((size.x - margin * 3) / 2, controlHeight), // size,
					"Center", // text,
					fontNameAndHeight,
					true, // hasBorder
					DataBinding.fromContextAndGet
					(
						universe.venueCurrent as VenueStarsystem,
						(c: VenueStarsystem) => (c.selectedEntity != null)
					), // isEnabled
					() => // click
					{
						(universe.venueCurrent as VenueStarsystem).cameraCenterOnSelection();
					},
				),

				ControlButton.from8
				(
					"buttonDetails", // name,
					Coords.fromXY
					(
						margin * 2 + ((size.x - margin * 3) / 2),
						size.y - margin - controlHeight
					), // pos
					Coords.fromXY((size.x - margin * 3) / 2, controlHeight), // size,
					"Details", // text,
					fontNameAndHeight,
					true, // hasBorder
					DataBinding.fromContextAndGet
					(
						universe.venueCurrent as VenueStarsystem,
						(c: VenueStarsystem) => (c.selectedEntity != null)
					), // isEnabled
					() => // click
					{
						var venueCurrent = universe.venueCurrent;
						var selectedEntity = (venueCurrent as VenueStarsystem).selectedEntity;
						if (selectedEntity != null)
						{
							var venueNext: Venue;
							var selectionTypeName = selectedEntity.constructor.name;

							if (selectionTypeName == NetworkNode2.name)
							{
								var selectionAsNetworkNode = selectedEntity as NetworkNode2;
								var starsystem = selectionAsNetworkNode.starsystem;
								if (starsystem != null)
								{
									venueNext = new VenueStarsystem(venueCurrent, starsystem);
								}
							}
							else if (selectionTypeName == Planet.name)
							{
								var selectionAsPlanet = selectedEntity as Planet;
								venueNext = new VenueLayout
								(
									venueCurrent, selectionAsPlanet, selectionAsPlanet.layout
								);
							}
							else if (selectionTypeName == Ship.name)
							{
								throw new Error("Not yet implemented!");
							}

							if (venueNext != null)
							{
								universe.venueTransitionTo(venueNext);
							}
						}
					}
				)
			],
			null, null // actions, actionToInputsMappings
		);

		return returnValue;
	}

	timeAndPlace
	(
		universe: Universe,
		containerMainSize: Coords,
		containerInnerSize: Coords,
		margin: number,
		controlHeight: number,
		includeTurnAdvanceButtons: boolean
	)
	{
		var uwpe = UniverseWorldPlaceEntities.fromUniverse(universe);

		var fontHeightInPixels = 10; //universe.display.fontHeightInPixels;
		var fontNameAndHeight =
			FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);

		var childControls = new Array<ControlBase>();

		var childControlsGuaranteed =
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
					universe,
					(c: Universe) =>
					{
						// hack
						var venue = c.venueCurrent as VenueStarsystem;
						return (venue.model == null ? "" : venue.model().name);
					}
				),
				fontNameAndHeight
			),

			new ControlLabel
			(
				"labelTurn",
				Coords.fromXY(margin, margin + controlHeight), // pos
				Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
				false, // isTextCenteredHorizontally
				false, // isTextCenteredVertically
				DataBinding.fromContext("Turn:"),
				fontNameAndHeight
			),

			new ControlLabel
			(
				"textTurn",
				Coords.fromXY(margin + 25, margin + controlHeight), // pos
				Coords.fromXY
				(
					containerInnerSize.x - margin * 3,
					controlHeight
				), // size
				false, // isTextCenteredHorizontally
				false, // isTextCenteredVertically
				DataBinding.fromContextAndGet
				(
					universe,
					(c: Universe) => "" + (c.world as WorldExtended).turnsSoFar
				),
				fontNameAndHeight
			)
		];

		childControls.push(...childControlsGuaranteed);

		if (includeTurnAdvanceButtons)
		{
			var world = universe.world as WorldExtended;

			var turnAdvanceButtons = 
			[
				ControlButton.from8
				(
					"buttonTurnNext", // name,
					Coords.fromXY(margin + 50, margin + controlHeight), // pos
					Coords.fromXY(controlHeight, controlHeight), // size,
					">", // text,
					fontNameAndHeight,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					() => world.updateForTurn(uwpe)
				),

				ControlButton.from8
				(
					"buttonTurnFastForward", // name,
					Coords.fromXY(margin + 50 + controlHeight, margin + controlHeight), // pos
					Coords.fromXY(controlHeight, controlHeight), // size,
					">>", // text,
					fontNameAndHeight,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					() => world.turnAdvanceUntilNotification(uwpe)
				)
			];

			childControls.push(...turnAdvanceButtons);
		}

		var size = Coords.fromXY
		(
			containerInnerSize.x,
			margin * 3 + controlHeight * 2
		);

		var returnValue = ControlContainer.from4
		(
			"containerTimeAndPlace",
			Coords.fromXY(margin, margin),
			size,
			childControls
		);

		return returnValue;
	}

	view
	(
		universe: Universe,
		containerMainSize: Coords,
		containerInnerSize: Coords,
		margin: number,
		controlHeight: number
	)
	{
		var cameraSpeed = 10;
		var fontHeightInPixels = 10; // universe.display.fontHeightInPixels;
		var fontNameAndHeight =
			FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);

		var size = Coords.fromXY
		(
			containerInnerSize.x,
			margin * 3 + controlHeight * 3
		);

		var pos = Coords.fromXY
		(
			margin,
			containerMainSize.y
				- margin
				- size.y
		);

		var returnValue = ControlContainer.from4
		(
			"containerViewControls",
			pos,
			size,
			// children
			[
				new ControlLabel
				(
					"labelControls",
					Coords.fromXY(margin, margin),// pos
					Coords.fromXY(containerInnerSize.x, controlHeight), // size
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext("View:"),
					fontNameAndHeight
				),

				new ControlButton
				(
					"buttonViewUp",
					Coords.fromXY
					(
						margin + controlHeight,
						margin * 2 + controlHeight
					), // pos
					Coords.fromXY(controlHeight, controlHeight), // size
					"^",
					fontNameAndHeight,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					() => // click
					{
						(universe.venueCurrent as VenueStarsystem).cameraUp(cameraSpeed);
					},
					true // canBeHeldDown
				),

				new ControlButton
				(
					"buttonViewDown",
					Coords.fromXY
					(
						margin + controlHeight,
						margin * 2 + controlHeight * 2
					), // pos
					Coords.fromXY(controlHeight, controlHeight), // size
					"v",
					fontNameAndHeight,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					() => // click
					{
						(universe.venueCurrent as VenueStarsystem).cameraDown(cameraSpeed);
					},
					true // canBeHeldDown
				),

				new ControlButton
				(
					"buttonViewLeft",
					Coords.fromXY
					(
						margin,
						margin * 2 + controlHeight * 2
					), // pos
					Coords.fromXY(controlHeight, controlHeight), // size
					"<",
					fontNameAndHeight,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					() => // click
					{
						(universe.venueCurrent as VenueStarsystem).cameraLeft(cameraSpeed);
					},
					true // canBeHeldDown
				),

				new ControlButton
				(
					"buttonViewRight",
					Coords.fromXY
					(
						margin + controlHeight * 2,
						margin * 2 + controlHeight * 2
					), // pos
					Coords.fromXY(controlHeight, controlHeight), // size
					">",
					fontNameAndHeight,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					() => // click
					{
						(universe.venueCurrent as VenueStarsystem).cameraRight(cameraSpeed);
					},
					true // canBeHeldDown
				),

				new ControlButton
				(
					"buttonViewZoomIn",
					Coords.fromXY
					(
						margin * 2 + controlHeight * 2,
						margin
					), // pos
					Coords.fromXY(controlHeight, controlHeight), // size
					"In",
					fontNameAndHeight,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					() => // click
					{
						(universe.venueCurrent as VenueStarsystem).cameraIn(cameraSpeed);
					},
					true // canBeHeldDown
				),

				new ControlButton
				(
					"buttonViewZoomOut",
					Coords.fromXY
					(
						margin * 2 + controlHeight * 3,
						margin
					), // pos
					Coords.fromXY(controlHeight, controlHeight), // size
					"Out",
					fontNameAndHeight,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					() => // click
					{
						(universe.venueCurrent as VenueStarsystem).cameraOut(cameraSpeed);
					},
					true // canBeHeldDown
				),

				new ControlButton
				(
					"buttonViewReset",
					Coords.fromXY
					(
						margin * 2.5 + controlHeight * 3,
						margin * 2 + controlHeight * 2
					), // pos
					Coords.fromXY(controlHeight, controlHeight), // size
					"x",
					fontNameAndHeight,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					() => // click
					{
						(universe.venueCurrent as VenueStarsystem).cameraReset();
					},
					false // canBeHeldDown
				),
			]
		);

		return returnValue;
	}
}
