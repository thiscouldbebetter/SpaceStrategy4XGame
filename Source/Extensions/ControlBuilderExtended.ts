
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

		var labelSelection = ControlLabel.from4Uncentered
		(
			Coords.fromXY(margin, margin), // pos
			Coords.fromXY(size.x - margin * 2, controlHeight), // size
			DataBinding.fromContext("Selection:"), // text
			fontNameAndHeight
		);

		var textSelectionName = ControlLabel.from4Uncentered
		(
			Coords.fromXY(margin, margin + controlHeight * .6), // pos
			Coords.fromXY(size.x - margin * 2, controlHeight), // size
			DataBinding.fromContextAndGet
			(
				universe,
				(c: Universe) =>
				{
					var returnValue = null;
					var venue = c.venueCurrent();
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
		);

		var dynamicSelection = new ControlDynamic
		(
			"dynamicSelection",
			Coords.fromXY(margin, margin * 2 + controlHeight * 2), // pos
			controlSelectionSize, // size
			DataBinding.fromContextAndGet
			(
				universe,
				(c: Universe) =>
					(c.venueCurrent() as VenueStarsystem).selectedEntity, // get
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
		);

		var buttonCenter = ControlButton.from8
		(
			"buttonCenter", // name,
			Coords.fromXY(margin, size.y - margin - controlHeight), // pos
			Coords.fromXY((size.x - margin * 3) / 2, controlHeight), // size,
			"Center", // text,
			fontNameAndHeight,
			true, // hasBorder
			DataBinding.fromContextAndGet
			(
				universe.venueCurrent() as VenueStarsystem,
				(c: VenueStarsystem) => (c.selectedEntity != null)
			), // isEnabled
			() => // click
			{
				(universe.venueCurrent() as VenueStarsystem).cameraCenterOnSelection();
			},
		);

		var buttonDetailsIsEnabledGet = (c: VenueStarsystem) => // hack
			(c.constructor.name == VenueStarsystem.name ? c.entitySelectedDetailsAreViewable(universe) : false);

		var buttonDetailsIsEnabled = DataBinding.fromContextAndGet
		(
			universe.venueCurrent() as VenueStarsystem,
			buttonDetailsIsEnabledGet
		);

		var buttonDetailsClick = () =>
		{
			var venueCurrent = universe.venueCurrent() as VenueStarsystem;
			venueCurrent.entitySelectedDetailsView(universe);
		};

		var buttonDetails = ControlButton.from8
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
			buttonDetailsIsEnabled,
			buttonDetailsClick
		)

		var returnValue = new ControlContainer
		(
			"containerSelected",
			pos.clone(),
			size.clone(),
			// children
			[
				labelSelection,
				textSelectionName,
				dynamicSelection,
				buttonCenter,
				buttonDetails
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
		includeRoundAdvanceButtons: boolean
	)
	{
		var uwpe = UniverseWorldPlaceEntities.fromUniverse(universe);

		var fontHeightInPixels = 10; //universe.display.fontHeightInPixels;
		var fontNameAndHeight =
			FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);

		var textPlace = ControlLabel.from4Uncentered
		(
			Coords.fromXY(margin,  margin), // pos
			Coords.fromXY
			(
				containerInnerSize.x - margin * 2,
				controlHeight
			), // size
			DataBinding.fromContextAndGet
			(
				universe,
				(c: Universe) =>
				{
					// hack
					var venue = c.venueCurrent() as VenueStarsystem;
					return (venue.model == null ? "" : venue.model().name);
				}
			),
			fontNameAndHeight
		);

		var labelRound = ControlLabel.from4Uncentered
		(
			Coords.fromXY(margin, margin + controlHeight), // pos
			Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
			DataBinding.fromContext("Round:"),
			fontNameAndHeight
		);

		var textRound = ControlLabel.from4Uncentered
		(
			Coords.fromXY(margin + 25, margin + controlHeight), // pos
			Coords.fromXY
			(
				containerInnerSize.x - margin * 3,
				controlHeight
			), // size
			DataBinding.fromContextAndGet
			(
				universe,
				(c: Universe) => "" + ( (c.world as WorldExtended).roundsSoFar + 1)
			),
			fontNameAndHeight
		);

		var childControls = new Array<ControlBase>();

		var childControlsGuaranteed =
		[
			textPlace,
			labelRound,
			textRound
		];

		childControls.push(...childControlsGuaranteed);

		if (includeRoundAdvanceButtons)
		{
			var world = universe.world as WorldExtended;

			var buttonRoundNext = ControlButton.from5
			(
				Coords.fromXY(margin + 50, margin + controlHeight), // pos
				Coords.fromXY(controlHeight, controlHeight), // size,
				">", // text,
				fontNameAndHeight,
				() => world.updateForRound(uwpe)
			);

			var buttonRoundFastForward = ControlButton.from5
			(
				Coords.fromXY(margin + 50 + controlHeight, margin + controlHeight), // pos
				Coords.fromXY(controlHeight, controlHeight), // size,
				">>", // text,
				fontNameAndHeight,
				() => world.roundAdvanceUntilNotification(uwpe)
			);

			var roundAdvanceButtons = 
			[
				buttonRoundNext,
				buttonRoundFastForward
			];

			childControls.push(...roundAdvanceButtons);
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
						(universe.venueCurrent() as VenueStarsystem).cameraUp(cameraSpeed);
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
						(universe.venueCurrent() as VenueStarsystem).cameraDown(cameraSpeed);
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
						(universe.venueCurrent() as VenueStarsystem).cameraLeft(cameraSpeed);
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
						(universe.venueCurrent() as VenueStarsystem).cameraRight(cameraSpeed);
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
						(universe.venueCurrent() as VenueStarsystem).cameraIn(cameraSpeed);
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
						(universe.venueCurrent() as VenueStarsystem).cameraOut(cameraSpeed);
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
						(universe.venueCurrent() as VenueStarsystem).cameraReset();
					},
					false // canBeHeldDown
				),
			]
		);

		return returnValue;
	}
}
