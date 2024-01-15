
class VenueStarCluster extends VenueWorld implements VenueDrawnOnlyWhenUpdated, VenueWithCameraAndSelection
{
	cameraEntity: Entity;

	_entitySelected: Entity;

	hasBeenUpdatedSinceDrawn: boolean;

	constructor(world: WorldExtended)
	{
		super(world);

		this.cameraEntity = new Entity("camera", [ world.camera ] );

		this.hasBeenUpdatedSinceDrawn = true;
	}

	model(world: WorldExtended): StarCluster
	{
		return world.starCluster;
	}

	// camera

	cameraCenterOnSelection(): void
	{
		var entitySelected = this.entitySelected();
		if (entitySelected != null)
		{
			var targetPosNew = entitySelected.locatable().loc.pos;

			var cameraConstrainable = this.cameraEntity.constrainable();
			var constraint =
				cameraConstrainable.constraintByClassName(Constraint_HoldDistanceFromTarget.name);
			var constraintDistance =
				constraint as Constraint_HoldDistanceFromTarget;
			var cameraSpeed = 1; // todo
			constraintDistance.distanceToHold += cameraSpeed / 2;
			constraintDistance.targetPos = targetPosNew;

			var constraint = cameraConstrainable.constraintByClassName
			(
				Constraint_LookAt.name
			);
			var constraintLookAt = constraint as Constraint_LookAt;
			constraintLookAt.targetPos = targetPosNew;
		}

		this.hasBeenUpdatedSinceDrawn = true;
	}

	cameraDown(cameraSpeed: number): void
	{
		this.cameraMove(0, cameraSpeed);
	}

	cameraIn(cameraSpeed: number): void
	{
		var cameraConstrainable = this.cameraEntity.constrainable();
		var constraint =
			cameraConstrainable.constraintByClassName(Constraint_HoldDistanceFromTarget.name);
		var constraintDistance = constraint as Constraint_HoldDistanceFromTarget;
		constraintDistance.distanceToHold -= cameraSpeed / 2;
		if (constraintDistance.distanceToHold < 1)
		{
			constraintDistance.distanceToHold = 1;
		}

		this.hasBeenUpdatedSinceDrawn = true;
	}

	cameraLeft(cameraSpeed: number): void
	{
		this.cameraMove(0 - cameraSpeed, 0);
	}

	cameraOut(cameraSpeed: number): void
	{
		var cameraConstrainable = this.cameraEntity.constrainable();
		var constraint =
			cameraConstrainable.constraintByClassName(Constraint_HoldDistanceFromTarget.name);
		var constraintDistance = constraint as Constraint_HoldDistanceFromTarget;
		constraintDistance.distanceToHold += cameraSpeed / 2;
		if (constraintDistance.distanceToHold < 0)
		{
			constraintDistance.distanceToHold = 0;
		}

		this.hasBeenUpdatedSinceDrawn = true;
	}

	cameraReset(): void
	{
		var cameraConstrainable = this.cameraEntity.constrainable();
		var camera = this.cameraEntity.camera();

		var origin = Coords.create();
		var constraint =
			cameraConstrainable.constraintByClassName(Constraint_HoldDistanceFromTarget.name);
		var constraintDistance = constraint as Constraint_HoldDistanceFromTarget;
		constraintDistance.distanceToHold = camera.focalLength;
		constraintDistance.targetPos = origin;

		var constraint =
			cameraConstrainable.constraintByClassName(Constraint_LookAt.name);
		var constraintLookAt = constraint as Constraint_LookAt;
		constraintLookAt.targetPos = origin;

		camera.loc.pos.clear().x = 0 - camera.focalLength;

		this.hasBeenUpdatedSinceDrawn = true;
	}

	cameraMove(horizontal: number, vertical: number): void
	{
		var camera = this.cameraEntity.camera();
		var cameraAction = new Action_CameraMove([horizontal, vertical]);
		cameraAction.perform(camera);

		this.hasBeenUpdatedSinceDrawn = true;
	}

	cameraRight(cameraSpeed: number): void
	{
		this.cameraMove(cameraSpeed, 0);
	}

	cameraUp(cameraSpeed: number): void
	{
		this.cameraMove(0, 0 - cameraSpeed);
	}

	// controls

	toControl(universe: Universe): ControlBase
	{
		var containerMainSize = universe.display.sizeInPixels.clone();

		var margin = containerMainSize.x / 60;
		var controlHeight = margin * 1.5;

		var fontHeightInPixels = margin;
		var fontNameAndHeight = FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);

		var containerInnerSize = containerMainSize.clone().divide(Coords.fromXY(6, 6) );

		var buttonWidth = (containerInnerSize.x - margin * 3) / 2;

		var world = universe.world as WorldExtended;
		var faction = world.factionCurrent();

		var controlBuilder = universe.controlBuilder as ControlBuilderExtended;

		var buttonMenu = ControlButton.from5
		(
			Coords.fromXY
			(
				(containerMainSize.x - buttonWidth) / 2,
				containerMainSize.y - margin - controlHeight
			), // pos
			Coords.fromXY(buttonWidth, controlHeight), // size
			"Menu",
			fontNameAndHeight,
			() => // click
			{
				var venueNext =
					universe.controlBuilder.gameAndSettings1(universe).toVenue();
				universe.venueTransitionTo(venueNext);
			}
		);

		var containerTimeAndPlace = world.starCluster.controlBuildTimeAndPlace
		(
			universe,
			containerMainSize,
			containerInnerSize,
			margin,
			controlHeight
		);

		var containerFaction = faction.toControl_ClusterOverlay
		(
			universe,
			containerMainSize,
			containerInnerSize,
			margin,
			controlHeight,
			buttonWidth,
			true // includeDetailsButton
		);

		var containerView = controlBuilder.view
		(
			universe,
			containerMainSize,
			containerInnerSize,
			margin,
			20 // cameraSpeed
		);

		var containerSelection = controlBuilder.selection
		(
			universe,
			Coords.fromXY
			(
				containerMainSize.x - margin - containerInnerSize.x,
				containerMainSize.y - margin - containerInnerSize.y
			), // pos
			containerInnerSize,
			margin
		);

		var container = ControlContainer.from4
		(
			"containerNetwork",
			Coords.fromXY(0, 0), // pos
			containerMainSize,
			// children
			[
				buttonMenu,
				containerTimeAndPlace,
				containerFaction,
				containerView,
				containerSelection
			]
		);

		var returnValue = new ControlContainerTransparent(container);

		return returnValue;
	}

	// venue

	draw(universe: Universe): void
	{
		var shouldDraw = true;
		/*
			this.world.shouldDrawOnlyWhenUpdated == false
			|| this.hasBeenUpdatedSinceDrawn;
		*/

		if (shouldDraw)
		{
			this.hasBeenUpdatedSinceDrawn = false;

			universe.display.drawBackground(null, null);
			var world = universe.world as WorldExtended;
			var playerFaction = world.factionPlayer();
			var playerKnowledge = playerFaction.knowledge;
			var worldKnown = playerKnowledge.world(universe, world);
			worldKnown.starCluster.drawForCamera(universe, worldKnown.camera);
			this.venueControls.draw(universe);
		}
	}

	finalize(universe: Universe): void
	{
		// universe.soundHelper.soundForMusicPause(universe);
	}

	initialize(universe: Universe): void
	{
		var world = universe.world as WorldExtended;
		world.placeCurrent = this.model(world);

		var uwpe = UniverseWorldPlaceEntities.fromUniverse(universe);

		world.initialize(uwpe);
		this.venueControls = this.toControl(universe).toVenue();

		var soundHelper = universe.soundHelper;
		soundHelper.soundWithNamePlayAsMusic(universe, "Music_Title");

		var origin = Coords.create();

		// hack
		var camera = this.cameraEntity.camera();
		var cameraLocatable = new Locatable(camera.loc);
		this.cameraEntity.propertyAdd(cameraLocatable);

		var constraints = 
		[
			new Constraint_HoldDistanceFromTarget
			(
				camera.focalLength, // distanceToHold
				origin
			),
			new Constraint_LookAt(origin),
		]
		var cameraConstrainable = new Constrainable(constraints);
		this.cameraEntity.propertyAdd(cameraConstrainable);

		this.hasBeenUpdatedSinceDrawn = true;
	}

	selectionName(): string
	{
		var entitySelected = this.entitySelected();
		var returnValue =
		(
			entitySelected == null ? "[none]" : entitySelected.name
		);
		return returnValue;
	}

	updateForTimerTick(universe: Universe): void
	{
		var world = universe.world as WorldExtended;

		var uwpe = UniverseWorldPlaceEntities.fromUniverseAndWorld
		(
			universe, world
		);

		world.updateForTimerTick(uwpe);

		this.cameraEntity.constrainable().constrain
		(
			uwpe.entitySet(this.cameraEntity)
		);

		this.draw(universe);

		this.venueControls.updateForTimerTick(universe);

		this.updateForTimerTick_Input(universe, world);
	}

	updateForTimerTick_Input(universe: Universe, world: WorldExtended)
	{
		this.updateForTimerTick_Input_MouseClicked(universe, world);
		this.updateForTimerTick_Input_InputsActive(universe, world);
	}

	updateForTimerTick_Input_MouseClicked(universe: Universe, world: WorldExtended): void
	{
		var inputHelper = universe.inputHelper;

		if (inputHelper.isMouseClicked())
		{
			universe.soundHelper.soundWithNamePlayAsEffect(universe, "Sound");

			var mouseClickPos = inputHelper.mouseClickPos.clone();

			var camera = this.cameraEntity.camera();
			var cameraPos = camera.loc.pos;
			var rayFromCameraThroughClick = new Ray
			(
				cameraPos,
				camera.coordsTransformViewToWorld
				(
					mouseClickPos, true // ignoreZ
				).subtract
				(
					cameraPos
				).normalize()
			);

			var playerFaction = world.factionPlayer();
			var worldKnown = playerFaction.knowledge.world
			(
				universe, world
			);

			var bodiesClickedAsCollisions = CollisionExtended.rayAndEntitiesCollidable
			(
				rayFromCameraThroughClick,
				worldKnown.starCluster.nodes,
				[] // listToAddTo
			);

			if (bodiesClickedAsCollisions.length > 0)
			{
				var collisionNearest = bodiesClickedAsCollisions[0];

				for (var i = 1; i < bodiesClickedAsCollisions.length; i++)
				{
					var collision = bodiesClickedAsCollisions[i];
					if (collision.distanceToCollision < collisionNearest.distanceToCollision)
					{
						collisionNearest = collision;
					}
				}

				var bodyClicked = collisionNearest.colliders[0]; // todo

				var entitySelected = this.entitySelected();

				if (bodyClicked == entitySelected)
				{
					var isFastForwarding = world.starCluster.roundsAreAdvancingUntilNotification();
					
					if (isFastForwarding == false)
					{
						var venueCurrent = universe.venueCurrent();
						var bodyClickedStarClusterNode = bodyClicked as StarClusterNode;
						var starsystem = bodyClickedStarClusterNode.starsystem;
						if (starsystem != null)
						{
							var venueNext: Venue
								= new VenueStarsystem(venueCurrent, starsystem);
							universe.venueTransitionTo(venueNext);
						}
					}
				}

				this.entitySelect(bodyClicked);

				universe.inputHelper.mouseClickedSet(false);
			}
		}
	}

	updateForTimerTick_Input_InputsActive(universe: Universe, world: WorldExtended): void
	{
		var inputHelper = universe.inputHelper;

		var inputsActive = inputHelper.inputsPressed;
		for (var i = 0; i < inputsActive.length; i++)
		{
			var inputActive = inputsActive[i].name;

			if (inputActive == "Escape")
			{
				var venueNext: Venue =
					universe.controlBuilder.gameAndSettings1(universe).toVenue();
				universe.venueTransitionTo(venueNext);
			}

			var cameraSpeed = 20;

			var inputNames = Input.Names();

			if (inputActive == inputNames.MouseMove)
			{
				// Do nothing.
			}
			else if (inputActive == inputNames.MouseClick)
			{
				// Mouse clicks are handled through controls.
			}
			else if (inputActive == "a")
			{
				this.cameraLeft(cameraSpeed);
			}
			else if (inputActive == "d")
			{
				this.cameraRight(cameraSpeed);
			}
			else if (inputActive == "s")
			{
				this.cameraDown(cameraSpeed);
			}
			else if (inputActive == "w")
			{
				this.cameraUp(cameraSpeed);
			}
			else if (inputActive == "f")
			{
				this.cameraOut(cameraSpeed);
			}
			else if (inputActive == inputNames.MouseWheelDown)
			{
				this.cameraOut(cameraSpeed);
				inputHelper.inputRemove(inputActive);
			}
			else if (inputActive == "r")
			{
				this.cameraIn(cameraSpeed);
			}
			else if (inputActive == inputNames.MouseWheelUp)
			{
				this.cameraIn(cameraSpeed);
				inputHelper.inputRemove(inputActive);
			}
		}
	}

	// VenueWithCameraAndSelection.

	entitySelect(value: Entity): void
	{
		this._entitySelected = value;
	}

	entitySelected(): Entity
	{
		return this._entitySelected;
	}

	entitySelectedDetailsAreViewable(universe: Universe): boolean
	{
		var entitySelected = this.entitySelected();
		var returnValue =
			entitySelected != null
			&& entitySelected.name != FactionKnowledge.TextUnknownStarsystem;
		return returnValue;
	}

	entitySelectedDetailsView(universe: Universe): void
	{
		var detailsAreViewable = this.entitySelectedDetailsAreViewable(universe);

		if (detailsAreViewable == false)
		{
			return;
		}

		var selectedEntity = this.entitySelected();
		if (selectedEntity != null)
		{
			var venueNext: Venue;
			var selectionTypeName = selectedEntity.constructor.name;

			if (selectionTypeName == StarClusterNode.name)
			{
				var selectionAsNetworkNode = selectedEntity as StarClusterNode;
				var starsystem = selectionAsNetworkNode.starsystem;
				if (starsystem != null)
				{
					venueNext = new VenueStarsystem(this, starsystem);
				}
			}
			else
			{
				throw new Error("Not yet implemented!");
			}

			if (venueNext != null)
			{
				universe.venueTransitionTo(venueNext);
			}
		}
	}

}
