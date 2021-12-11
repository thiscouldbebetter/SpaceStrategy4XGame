
class VenueWorldExtended extends VenueWorld
{
	world: WorldExtended;
	cameraEntity: Entity;

	selectedEntity: Entity;

	constructor(world: WorldExtended)
	{
		super(world);

		this.world = world;

		this.cameraEntity = new Entity("camera", [ this.world.camera ] );
	}

	model(): Network2
	{
		return this.world.network;
	}

	// camera

	cameraCenterOnSelection(): void
	{
		if (this.selectedEntity != null)
		{
			var targetPosNew = this.selectedEntity.locatable().loc.pos;

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
	}

	cameraDown(cameraSpeed: number): void
	{
		var cameraAction = new Action_CameraMove([0, cameraSpeed]);
		cameraAction.perform(this.cameraEntity.camera());
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
	}

	cameraLeft(cameraSpeed: number): void
	{
		var cameraAction = new Action_CameraMove([0 - cameraSpeed, 0]);
		cameraAction.perform(this.cameraEntity.camera());
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
	}

	cameraRight(cameraSpeed: number): void
	{
		var cameraAction = new Action_CameraMove([cameraSpeed, 0]);
		cameraAction.perform(this.cameraEntity.camera());
	}

	cameraUp(cameraSpeed: number): void
	{
		var cameraAction = new Action_CameraMove([0, 0 - cameraSpeed]);
		cameraAction.perform(this.cameraEntity.camera());
	}

	// controls

	toControl(universe: Universe): ControlBase
	{
		var containerMainSize = universe.display.sizeInPixels.clone();
		var controlHeight = 14;

		var margin = 8;
		var fontHeightInPixels = 10;//universe.display.fontHeightInPixels;

		var containerInnerSize = Coords.fromXY(100, 60);

		var buttonWidth = (containerInnerSize.x - margin * 3) / 2;

		var world = universe.world as WorldExtended;
		var faction = world.factionCurrent();

		var controlBuilder = universe.controlBuilder as ControlBuilderExtended;

		var container = ControlContainer.from4
		(
			"containerNetwork",
			Coords.fromXY(0, 0), // pos
			containerMainSize,
			// children
			[
				ControlButton.from8
				(
					"buttonMenu",
					Coords.fromXY
					(
						(containerMainSize.x - buttonWidth) / 2,
						containerMainSize.y - margin - controlHeight
					), // pos
					Coords.fromXY(buttonWidth, controlHeight), // size
					"Menu",
					fontHeightInPixels,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					() => // click
					{
						var venueNext: Venue =
							universe.controlBuilder.gameAndSettings1(universe).toVenue();
						venueNext = VenueFader.fromVenuesToAndFrom
						(
							venueNext, universe.venueCurrent
						);
						universe.venueNext = venueNext;
					}
				),

				controlBuilder.timeAndPlace
				(
					universe,
					containerMainSize,
					containerInnerSize,
					margin,
					controlHeight,
					true // includeTurnAdvanceButtons
				),

				faction.toControl_ClusterOverlay
				(
					universe,
					containerMainSize,
					containerInnerSize,
					margin,
					controlHeight,
					buttonWidth
				),

				controlBuilder.view
				(
					universe,
					containerMainSize,
					containerInnerSize,
					margin,
					controlHeight
				),

				controlBuilder.selection
				(
					universe,
					Coords.fromXY
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

		var returnValue = new ControlContainerTransparent(container);

		return returnValue;
	}

	// venue

	draw(universe: Universe): void
	{
		universe.display.drawBackground(null, null);
		//this.world.network.draw(universe, this.world.camera);
		var playerFaction = this.world.factions[0];
		var playerKnowledge = playerFaction.knowledge;
		var worldKnown = playerKnowledge.worldKnown(universe, this.world);
		worldKnown.network.draw(universe, worldKnown.camera);
		this.venueControls.draw(universe);
	}

	finalize(universe: Universe): void
	{
		universe.soundHelper.soundForMusic.pause(universe);
	}

	initialize(universe: Universe): void
	{
		var uwpe = UniverseWorldPlaceEntities.fromUniverse(universe);

		this.world.initialize(uwpe);
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
	}

	selectionName(): string
	{
		var returnValue =
		(
			this.selectedEntity == null ? "[none]" : this.selectedEntity.name
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

		this.cameraEntity.constrainable().constrain
		(
			uwpe.entitySet(this.cameraEntity)
		);

		this.draw(universe);

		this.venueControls.updateForTimerTick(universe);

		var inputHelper = universe.inputHelper;
		if (inputHelper.isMouseClicked(null))
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
				)
			);

			var playerFaction = world.factions[0];
			var worldKnown = playerFaction.knowledge.worldKnown
			(
				universe, world
			);

			var bodiesClickedAsCollisions = CollisionExtended.rayAndBodies
			(
				rayFromCameraThroughClick,
				worldKnown.network.nodes,
				NetworkNode2.RadiusActual(),
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

				if (bodyClicked == this.selectedEntity)
				{
					var venueCurrent = universe.venueCurrent;
					var bodyClickedNetworkNode = bodyClicked as NetworkNode2;
					var starsystem = bodyClickedNetworkNode.starsystem;
					if (starsystem != null)
					{
						var venueNext: Venue =
							new VenueStarsystem(venueCurrent, starsystem);
						venueNext =
							VenueFader.fromVenuesToAndFrom(venueNext, venueCurrent);
						universe.venueNext = venueNext;
					}
				}

				this.selectedEntity = bodyClicked;
			}
		}

		var inputsActive = inputHelper.inputsPressed;
		for (var i = 0; i < inputsActive.length; i++)
		{
			var inputActive = inputsActive[i].name;

			if (inputActive == "Escape")
			{
				var venueNext: Venue =
					universe.controlBuilder.gameAndSettings1(universe).toVenue();
				venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
				universe.venueNext = venueNext;
			}

			var cameraSpeed = 20;

			if (inputActive == "MouseMove")
			{
				// Do nothing.
			}
			else if (inputActive == "MouseClick")
			{
				inputHelper.isMouseClicked(false);
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
			else if (inputActive == "r")
			{
				this.cameraIn(cameraSpeed);
			}
		}
	}
}
