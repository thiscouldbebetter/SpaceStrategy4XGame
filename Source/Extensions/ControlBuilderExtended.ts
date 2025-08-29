
class ControlBuilderExtended extends ControlBuilder
{
	constructor(controlBuilderInner: ControlBuilder)
	{
		super(controlBuilderInner.styles, controlBuilderInner.venueTransitionalFromTo);
	}

	selection
	(
		universe: Universe,
		pos: Coords,
		size: Coords,
		margin: number
	)
	{
		var fontHeightInPixels = margin;

		var labelHeight = fontHeightInPixels;
		var buttonHeight = fontHeightInPixels * 2;

		var fontNameAndHeight =
			FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);

		var labelSelection = ControlLabel.fromPosSizeTextFontUncentered
		(
			Coords.fromXY(margin, margin), // pos
			Coords.fromXY(size.x - margin * 2, labelHeight), // size
			DataBinding.fromContext("Selection:"), // text
			fontNameAndHeight
		);

		var textSelectionName = ControlLabel.fromPosSizeTextFontUncentered
		(
			Coords.fromXY(margin, margin + labelHeight), // pos
			Coords.fromXY(size.x - margin * 2, labelHeight), // size
			DataBinding.fromContextAndGet
			(
				universe,
				(c: Universe) =>
				{
					var returnValue = null;
					var venue = c.venueCurrent();
					var venueTypeName = venue.constructor.name;
					if (venueTypeName == VenueStarCluster.name)
					{
						returnValue = (venue as VenueStarCluster).selectionName();
					}
					else if (venueTypeName == VenueStarsystem.name)
					{
						var world = universe.world as WorldExtended;
						returnValue = (venue as VenueStarsystem).selectionName(world);
					}
					return returnValue;
				}
			),
			fontNameAndHeight
		);

		var controlSelectionSize = Coords.fromXY
		(
			size.x - margin * 2,
			size.y - margin * 4 - labelHeight * 2 - buttonHeight
		);

		var dynamicSelection = new ControlDynamic
		(
			"dynamicSelection",
			Coords.fromXY(margin, margin * 2 + labelHeight * 2), // pos
			controlSelectionSize, // size
			DataBinding.fromContextAndGet
			(
				universe,
				(c: Universe) =>
				{
					var venue = c.venueCurrent() as VenueStarsystem;
					return (venue.entitySelected == null ? null : venue.entitySelected() ); // get
				}
			),
			(v: Entity) =>
			{
				var venueStarsystem = universe.venueCurrent() as VenueStarsystem;
				var place = venueStarsystem.starsystem;
				var uwpe = new UniverseWorldPlaceEntities
				(
					universe, universe.world, place, v, null
				);
				var controllable = Controllable.of(v);
				var control = controllable.toControl
				(
					uwpe,
					controlSelectionSize,
					Starsystem.name
				);
				return control;
			}
		);

		var buttonSize =
			Coords.fromXY((size.x - margin * 3) / 2, buttonHeight);

		var buttonCenter = ControlButton.fromNamePosSizeTextFontBorderEnabledClick
		(
			"buttonCenter", // name,
			Coords.fromXY(margin, size.y - margin - buttonHeight), // pos
			buttonSize,
			"Center", // text,
			fontNameAndHeight,
			true, // hasBorder
			DataBinding.fromContextAndGet
			(
				universe.venueCurrent() as VenueWithCameraAndSelection,
				(c: VenueWithCameraAndSelection) => (c.entitySelected != null)
			), // isEnabled
			() => // click
			{
				(universe.venueCurrent() as VenueWithCameraAndSelection).cameraCenterOnSelection();
			}
		);

		var buttonDetailsIsEnabledGet =
			(c: VenueWithCameraAndSelection) => // hack
			{
				var returnValue =
				(
					c.entitySelectedDetailsAreViewable != null // hack - VenueFader.
					? c.entitySelectedDetailsAreViewable(universe)
					: false
				);
				return returnValue;
			}

		var buttonDetailsIsEnabled = DataBinding.fromContextAndGet
		(
			universe.venueCurrent() as VenueWithCameraAndSelection,
			buttonDetailsIsEnabledGet
		);

		var buttonDetailsClick = () =>
		{
			var venueCurrent = universe.venueCurrent() as VenueWithCameraAndSelection;
			venueCurrent.entitySelectedDetailsView(universe);
		};

		var buttonDetails = ControlButton.fromNamePosSizeTextFontBorderEnabledClick
		(
			"buttonDetails", // name,
			Coords.fromXY
			(
				margin * 2 + ((size.x - margin * 3) / 2),
				size.y - margin - buttonHeight
			), // pos
			buttonSize,
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

	starsystemPlanetsLinksAndShips
	(
		universe: Universe,
		pos: Coords,
		size: Coords,
		margin: number,
		controlHeight: number,
		venueStarsystem: VenueStarsystem
	)
	{
		// todo - Move this to starsystem?

		var starsystem = venueStarsystem.starsystem;

		controlHeight /= 2;

		var fontHeightInPixels = margin;
		var fontNameAndHeight =
			FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);

		var labelPlanetsLinksShips = ControlLabel.fromPosSizeTextFontUncentered
		(
			Coords.fromXY(margin, margin), // pos
			Coords.fromXY(size.x - margin * 2, controlHeight), // size
			DataBinding.fromContext("Objects:"), // text
			fontNameAndHeight
		);

		var textPlanetsLinksShipsCount = ControlLabel.fromPosSizeTextFontUncentered
		(
			Coords.fromXY(size.x / 2, margin), // pos
			Coords.fromXY(size.x - margin * 2, controlHeight), // size
			DataBinding.fromContextAndGet
			(
				starsystem,
				(c: Starsystem) => "" + c.entitiesForPlanetsLinkPortalsAndShips().length
			),
			fontNameAndHeight
		);

		var buttonSize = Coords.fromXY
		(
			(size.x - margin * 3) / 2, controlHeight * 2
		);

		var listSize = Coords.fromXY
		(
			size.x - margin * 2,
			size.y - margin * 4 - controlHeight * 2 - buttonSize.y
		);

		var listPlanetsLinksShips = ControlList.fromNamePosSizeItemsTextFontSelected
		(
			"listPlanetsLinksShips",
			Coords.fromXY(margin, margin * 2 + controlHeight * 1), // pos
			listSize,
			// items
			DataBinding.fromContextAndGet
			(
				venueStarsystem,
				(c: VenueStarsystem) => c.starsystem.entitiesForPlanetsLinkPortalsAndShips()
			),
			DataBinding.fromGet
			(
				(c: Entity) => c.name
			), // bindingForItemText
			fontNameAndHeight,
			new DataBinding
			(
				venueStarsystem,
				(c: VenueStarsystem) => c.entityHighlighted,
				(c: VenueStarsystem, v: Entity) => c.entityHighlighted = v
			)
		);

		var buttonSelect = ControlButton.fromNamePosSizeTextFontBorderEnabledClick
		(
			"buttonSelect", // name,
			Coords.fromXY(margin, size.y - margin - buttonSize.y), // pos
			buttonSize,
			"Select", // text,
			fontNameAndHeight,
			true, // hasBorder
			DataBinding.fromContextAndGet
			(
				venueStarsystem,
				(c: VenueStarsystem) => (c.entityHighlighted != null)
			), // isEnabled
			() => // click
				venueStarsystem.entitySelect(venueStarsystem.entityHighlighted)
		);

		var buttonTarget = ControlButton.fromNamePosSizeTextFontBorderEnabledClick
		(
			"buttonTarget", // name,
			Coords.fromXY
			(
				margin * 2 + buttonSize.x,
				size.y - margin - buttonSize.y
			), // pos
			buttonSize,
			"Target", // text,
			fontNameAndHeight,
			true, // hasBorder
			DataBinding.fromContextAndGet
			(
				venueStarsystem,
				(c: VenueStarsystem) =>
					c.entitySelected != null
					&& c.entitySelectedEquals(c.entityHighlighted)
			), // isEnabled
			() => alert("todo - target")// click
		);

		var returnValue = new ControlContainer
		(
			"containerSelected",
			pos.clone(),
			size.clone(),
			// children
			[
				labelPlanetsLinksShips,
				textPlanetsLinksShipsCount,
				listPlanetsLinksShips,
				buttonSelect,
				buttonTarget
			],
			null, null // actions, actionToInputsMappings
		);

		return returnValue;
	}

	view
	(
		universe: Universe,
		containerMainSize: Coords,
		containerInnerSize: Coords,
		margin: number,
		cameraSpeed: number
	)
	{
		var fontHeightInPixels = margin;
		var fontNameAndHeight =
			FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);
		var labelHeight = fontHeightInPixels;
		var buttonWidthAndHeight = (containerInnerSize.x - margin * 2) / 5;

		var size = containerInnerSize.clone();

		var pos = Coords.fromXY
		(
			margin,
			containerMainSize.y
				- margin
				- size.y
		);

		var labelView = ControlLabel.fromPosSizeTextFontUncentered
		(
			Coords.fromXY(margin, margin),// pos
			Coords.fromXY(containerInnerSize.x, labelHeight), // size
			DataBinding.fromContext("View:"),
			fontNameAndHeight
		);

		var buttonSize = Coords.fromXY(1, 1).multiplyScalar(buttonWidthAndHeight);

		var buttonViewRotateUp = ControlButton.fromPosSizeTextFontClick
		(
			Coords.fromXY
			(
				margin + buttonWidthAndHeight,
				size.y - margin - buttonWidthAndHeight * 2
			), // pos
			buttonSize,
			"^",
			fontNameAndHeight,
			() => // click
			{
				(universe.venueCurrent() as VenueStarsystem).cameraUp(cameraSpeed);
			}
		).canBeHeldDownSet(true);

		var buttonViewRotateDown = ControlButton.fromPosSizeTextFontClick
		(
			Coords.fromXY
			(
				margin + buttonWidthAndHeight,
				size.y - margin - buttonWidthAndHeight
			), // pos
			buttonSize,
			"v",
			fontNameAndHeight,
			() => // click
			{
				(universe.venueCurrent() as VenueStarsystem).cameraDown(cameraSpeed);
			}
		).canBeHeldDownSet(true);

		var buttonViewRotateLeft = ControlButton.fromPosSizeTextFontClick
		(
			Coords.fromXY
			(
				margin,
				size.y - margin - buttonWidthAndHeight
			), // pos
			buttonSize,
			"<",
			fontNameAndHeight,
			() => // click
			{
				(universe.venueCurrent() as VenueStarsystem).cameraLeft(cameraSpeed);
			}
		).canBeHeldDownSet(true);

		var buttonViewRotateRight = ControlButton.fromPosSizeTextFontClick
		(
			Coords.fromXY
			(
				margin + buttonWidthAndHeight * 2,
				size.y - margin - buttonWidthAndHeight
			), // pos
			buttonSize,
			">",
			fontNameAndHeight,
			() => // click
			{
				(universe.venueCurrent() as VenueStarsystem).cameraRight(cameraSpeed);
			}
		).canBeHeldDownSet(true);

		var buttonViewZoomIn = ControlButton.fromPosSizeTextFontClick
		(
			Coords.fromXY
			(
				size.x - margin - buttonWidthAndHeight * 2,
				margin
			), // pos
			buttonSize,
			"In",
			fontNameAndHeight,
			() => // click
			{
				(universe.venueCurrent() as VenueStarsystem).cameraIn(cameraSpeed);
			}
		).canBeHeldDownSet(true);

		var buttonViewZoomOut = ControlButton.fromPosSizeTextFontClick
		(
			Coords.fromXY
			(
				size.x - margin - buttonWidthAndHeight,
				margin
			), // pos
			buttonSize, // size
			"Out",
			fontNameAndHeight,
			() => // click
			{
				(universe.venueCurrent() as VenueStarsystem).cameraOut(cameraSpeed);
			}
		).canBeHeldDownSet(true);

		var buttonViewReset = ControlButton.from5
		(
			Coords.fromXY
			(
				size.x - margin - buttonWidthAndHeight,
				size.y - margin - buttonWidthAndHeight,
			), // pos
			buttonSize,
			"x",
			fontNameAndHeight,
			() => // click
			{
				(universe.venueCurrent() as VenueStarsystem).cameraReset();
			}
		);

		var returnValue = ControlContainer.fromNamePosSizeAndChildren
		(
			"containerViewControls",
			pos,
			size,
			// children
			[
				labelView,
				buttonViewRotateUp,
				buttonViewRotateDown,
				buttonViewRotateLeft,
				buttonViewRotateRight,
				buttonViewZoomIn,
				buttonViewZoomOut,
				buttonViewReset
			]
		);

		return returnValue;
	}
}

interface VenueWithCameraAndSelection extends Venue
{
	cameraCenterOnSelection(): void;
	entitySelectedDetailsAreViewable(universe: Universe): boolean;
	entitySelectedDetailsView(universe: Universe): void;
	entitySelected(): Entity;
}
