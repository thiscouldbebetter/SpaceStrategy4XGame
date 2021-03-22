
class VenueStarsystem implements Venue
{
	venueParent: Venue;
	starsystem: Starsystem;

	cursor: Cursor;
	selection: any;

	_mouseClickPos: Coords;

	bodies: any[];
	cameraEntity: Entity;
	venueControls: VenueControls;

	constructor(venueParent: Venue, starsystem: Starsystem)
	{
		this.venueParent = venueParent;
		this.starsystem = starsystem;

		this.cursor = new Cursor();

		this._mouseClickPos = Coords.create();
	}

	draw(universe: Universe)
	{
		var world = universe.world as WorldExtended;
		var display = universe.display;

		display.drawBackground(null, null);
		this.starsystem.draw
		(
			universe,
			world,
			null, // place
			null, // entity
			display
		);

		this.cursor.draw(universe, world, null, null, display);

		this.venueControls.draw(universe);
	}

	finalize(universe: Universe)
	{
		universe.soundHelper.soundForMusic.pause(universe);
	}

	initialize(universe: Universe)
	{
		this.venueControls = this.toControl(universe).toVenue();

		var starsystem = this.starsystem;

		var soundHelper = universe.soundHelper;
		soundHelper.soundWithNamePlayAsMusic(universe, "Music_Title");

		var viewSize = universe.display.sizeInPixels.clone();
		var focalLength = viewSize.y;
		viewSize.z = focalLength * 4;

		var camera = new Camera
		(
			viewSize,
			focalLength,
			Disposition.fromPos
			(
				new Coords(0 - focalLength, 0, 0), //pos,
			)
		);

		var cameraLocatable = new Locatable(camera.loc);

		var targetForCamera = Coords.create();

		// hack
		var constraints =
		[
			new Constraint_PositionOnCylinder
			(
				targetForCamera, // center
				Orientation.default(),
				0, // yaw
				camera.focalLength, // radius
				0 - camera.focalLength / 2 // distanceFromCenterAlongAxisMax
			),

			new Constraint_LookAt(targetForCamera),
		];

		var cameraConstrainable = new Constrainable(constraints);

		this.cameraEntity = new Entity
		(
			Camera.name,
			[ camera, cameraLocatable, cameraConstrainable ]
		);

		Constrainable.constrain(universe, universe.world, null, this.cameraEntity);

		this.bodies = new Array<any>();
		this.bodies.push(starsystem.star);
		this.bodies.push(...starsystem.linkPortals);
		this.bodies.push(...starsystem.planets);
		this.bodies.push(...starsystem.ships);
	}

	model()
	{
		return this.starsystem;
	}

	selectionName()
	{
		return (this.selection == null ? "[none]" : this.selection.name);
	}

	updateForTimerTick(universe: Universe)
	{
		this.venueControls.updateForTimerTick(universe);

		Constrainable.constrain(universe, universe.world, null, this.cameraEntity);

		if (this.cursor != null)
		{
			Constrainable.constrain(universe, universe.world, null, this.cursor.toEntity());
		}

		var ships = this.starsystem.ships;
		for (var i = 0; i < ships.length; i++)
		{
			var ship = ships[i];

			var bodyActivity = ship.activity();
			if (bodyActivity != null)
			{
				bodyActivity.perform(universe, ship);
			}
		}

		this.draw(universe);

		this.updateForTimerTick_Input(universe);
	}

	updateForTimerTick_Input(universe: Universe)
	{
		var cameraSpeed = 10;

		var inputHelper = universe.inputHelper;

		var inputsActive = inputHelper.inputsPressed;
		for (var i = 0; i < inputsActive.length; i++)
		{
			var inputActive = inputsActive[i].name;

			if (inputActive == "MouseMove")
			{
				this.updateForTimerTick_Input_MouseMove(universe);
			}
			else if (inputActive == "a")
			{
				this.cameraLeft(cameraSpeed);
			}
			else if (inputActive == "d")
			{
				this.cameraRight(cameraSpeed);
			}
			else if (inputActive == "f")
			{
				this.cameraDown(cameraSpeed);
			}
			else if (inputActive == "r")
			{
				this.cameraUp(cameraSpeed);
			}
			else if (inputActive == "s")
			{
				this.cameraOut(cameraSpeed);
			}
			else if (inputActive == "w")
			{
				this.cameraIn(cameraSpeed);
			}
			else if (inputHelper.isMouseClicked(null))
			{
				this.updateForTimerTick_Input_Mouse(universe);
			}
		}
	}

	updateForTimerTick_Input_Mouse(universe: Universe)
	{
		universe.soundHelper.soundWithNamePlayAsEffect(universe, "Sound");

		var inputHelper = universe.inputHelper;
		var mouseClickPos = this._mouseClickPos.overwriteWith
		(
			inputHelper.mouseClickPos
		);

		var camera = this.camera();

		var rayFromCameraThroughClick = new Ray
		(
			camera.loc.pos,
			camera.coordsTransformViewToWorld
			(
				mouseClickPos, true // ignoreZ
			).subtract
			(
				camera.loc.pos
			)
		);

		var bodiesClickedAsCollisions = CollisionExtended.rayAndBodies
		(
			rayFromCameraThroughClick,
			this.bodies,
			10, // bodyRadius
			[]
		);

		var bodyClicked;

		if (bodiesClickedAsCollisions.length == 0)
		{
			bodyClicked = null;
		}
		else
		{
			var bodiesClickedAsCollisionsSorted = new Array<CollisionExtended>();

			for (var i = 0; i < bodiesClickedAsCollisions.length; i++)
			{
				var collisionToSort = bodiesClickedAsCollisions[i];

				var j = 0;
				for (j = 0; j < bodiesClickedAsCollisionsSorted.length; j++)
				{
					var collisionSorted = bodiesClickedAsCollisionsSorted[j];

					if (collisionToSort.distanceToCollision < collisionSorted.distanceToCollision)
					{
						break;
					}
				}

				ArrayHelper.insertElementAt
				(
					bodiesClickedAsCollisionsSorted, collisionToSort, j
				);
			}

			var numberOfCollisions = bodiesClickedAsCollisionsSorted.length;
			if (this.selection == null || numberOfCollisions == 1)
			{
				bodyClicked = bodiesClickedAsCollisionsSorted[0].colliders[0];
			}
			else
			{
				for (var c = 0; c < numberOfCollisions; c++)
				{
					var collision = bodiesClickedAsCollisionsSorted[c];
					bodyClicked = collision.colliders[0];

					if (bodyClicked == this.selection)
					{
						var cNext = c + 1;
						if (cNext >= numberOfCollisions)
						{
							cNext = 0;
						}
						collision = bodiesClickedAsCollisionsSorted[cNext];
						bodyClicked = collision.colliders[0];
						break;
					}
				}
			}
		}

		this.updateForTimerTick_Input_Mouse_Selection(universe, bodyClicked);

		inputHelper.isMouseClicked(false);
	}

	updateForTimerTick_Input_Mouse_Selection(universe: Universe, bodyClicked: Entity)
	{
		// todo - Fix.
		if (this.selection == null)
		{
			this.selection = bodyClicked;
		}
		else if (this.selection.defn.name == Ship.name)
		{
			var ship = this.selection;

			if (bodyClicked != null) // && bodyClicked.defn.name != "Cursor")
			{
				// Targeting an existing body, not an arbitrary point.
				universe.inputHelper.isEnabled = false;

				var targetEntity = bodyClicked;
				if (this.cursor.orderName != null)
				{
					ship.order = new Order(this.cursor.orderName, targetEntity);
					ship.order.obey(universe, ship);
				}

				this.cursor.clear();
			}
			else if (this.cursor.hasXYPositionBeenSpecified == false)
			{
				this.cursor.hasXYPositionBeenSpecified = true;
			}
			else if (this.cursor.hasZPositionBeenSpecified == false)
			{
				universe.inputHelper.isEnabled = false;

				var targetBody = new Body
				(
					"Target",
					new BodyDefn("MoveTarget", Coords.create(), null),
					this.cursor.locatable().loc.pos.clone()
				);

				ship.order = new Order(this.cursor.orderName, targetBody);
				ship.order.obey(universe, ship);

				this.cursor.clear();
			}
		}
		else if (this.selection.defn.name == Planet.name)
		{
			if (bodyClicked == this.selection)
			{
				var planet = EntityExtensions.planet(bodyClicked);
				if (planet != null)
				{
					var layout = planet.layout;
					var venueNext: Venue = new VenueLayout(this, bodyClicked, layout);
					venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
					universe.venueNext = venueNext;
				}
			}
		}
		else
		{
			this.selection = bodyClicked;
		}
	}

	updateForTimerTick_Input_MouseMove(universe: Universe)
	{
		var inputHelper = universe.inputHelper;
		var mouseMovePos = this._mouseClickPos.overwriteWith
		(
			inputHelper.mouseMovePos
		);

		var camera = this.camera();
		var cameraPos = camera.loc.pos;

		var rayFromCameraThroughMouse = new Ray
		(
			cameraPos,
			camera.coordsTransformViewToWorld
			(
				mouseMovePos, true // ignoreZ
			).subtract
			(
				cameraPos
			)
		);

		var bodiesUnderMouseAsCollisions = CollisionExtended.rayAndBodies
		(
			rayFromCameraThroughMouse,
			this.bodies,
			10, // bodyRadius
			[]
		);

		var bodyUnderMouse;

		if (bodiesUnderMouseAsCollisions.length == 0)
		{
			bodyUnderMouse = null;
		}
		else
		{
			bodiesUnderMouseAsCollisions = bodiesUnderMouseAsCollisions.sort
			(
				(x) => x.distanceToCollision
			);

			bodyUnderMouse = bodiesUnderMouseAsCollisions[0].colliders[0];
		}

		this.cursor.bodyUnderneath = bodyUnderMouse;
	}

	// camera

	camera()
	{
		return this.cameraEntity.camera();
	}

	cameraCenterOnSelection()
	{
		if (this.selection != null)
		{
			var constraint =
				this.cameraEntity.constrainable().constraintByClassName
				(
					Constraint_PositionOnCylinder.name
				);
			var constraintPosition = constraint as Constraint_PositionOnCylinder;
			var selectionPos = this.selection.locatable().loc.pos;
			constraintPosition.center.overwriteWith(selectionPos);
		}
	}

	cameraDown(cameraSpeed: number)
	{
		new Action_CylinderMove_DistanceAlongAxis(cameraSpeed).perform(this.cameraEntity);
	}

	cameraIn(cameraSpeed: number)
	{
		new Action_CylinderMove_Radius(0 - cameraSpeed).perform(this.cameraEntity);
	}

	cameraLeft(cameraSpeed: number)
	{
		new Action_CylinderMove_Yaw(cameraSpeed / 1000).perform(this.cameraEntity);
	}

	cameraOut(cameraSpeed: number)
	{
		new Action_CylinderMove_Radius(cameraSpeed).perform(this.cameraEntity);
	}

	cameraReset()
	{
		new Action_CylinderMove_Reset().perform(this.cameraEntity);
	}

	cameraRight(cameraSpeed: number)
	{
		new Action_CylinderMove_Yaw(0 - cameraSpeed / 1000).perform(this.cameraEntity);
	}

	cameraUp(cameraSpeed: number)
	{
		new Action_CylinderMove_DistanceAlongAxis(0 - cameraSpeed).perform(this.cameraEntity);
	}

	// controls

	toControl(universe: Universe)
	{
		var display = universe.display;
		var containerMainSize = display.sizeInPixels.clone();
		var fontHeightInPixels = display.fontHeightInPixels;
		var controlHeight = 16;
		var margin = 10;
		var containerInnerSize = Coords.fromXY(100, 60);
		var buttonWidth = (containerInnerSize.x - margin * 3) / 2;

		var controlBuilder = universe.controlBuilder as ControlBuilderExtended;

		var container = ControlContainer.from4
		(
			"containerStarsystem",
			Coords.fromXY(0, 0), // pos
			containerMainSize,
			// children
			[
				ControlButton.from9
				(
					"buttonBack",
					Coords.fromXY
					(
						(containerMainSize.x - buttonWidth) / 2,
						containerMainSize.y - margin - controlHeight
					), // pos
					Coords.fromXY(buttonWidth, controlHeight), // size
					"Back",
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					(universe: Universe) => // click
					{
						var venue = universe.venueCurrent as VenueStarsystem;
						var venueNext: Venue = venue.venueParent;
						venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
						universe.venueNext = venueNext;
					},
					universe // context
				),

				controlBuilder.timeAndPlace
				(
					universe,
					containerMainSize,
					containerInnerSize,
					margin,
					controlHeight
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
						margin
					),
					Coords.fromXY
					(
						containerInnerSize.x,
						containerMainSize.y - margin * 2
					),
					margin,
					controlHeight
				),

			]
		);

		var returnValue = new ControlContainerTransparent(container);

		return returnValue;
	}
}
