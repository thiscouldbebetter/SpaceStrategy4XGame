
class VenueStarsystem
{
	constructor(venueParent, starsystem)
	{
		this.venueParent = venueParent;
		this.starsystem = starsystem;

		this.cursor = new Cursor();

		this._mouseClickPos = new Coords();
	}

	draw(universe)
	{
		var world = universe.world;
		var display = universe.display;

		display.drawBackground();
		this.starsystem.draw
		(
			universe,
			world,
			this, // place
			null, // entity
			display
		);

		this.cursor.draw(universe, world, this, null, display);

		this.venueControls.draw(universe, world);
	}

	finalize(universe)
	{
		universe.soundHelper.soundForMusic.pause(universe);
	}

	initialize(universe)
	{
		this.venueControls = new VenueControls
		(
			this.controlBuild(universe)
		);

		var starsystem = this.starsystem;

		var soundHelper = universe.soundHelper;
		soundHelper.soundWithNamePlayAsMusic(universe, "Music_Title");

		var viewSize = universe.display.sizeInPixels.clone();
		var focalLength = viewSize.y;
		viewSize.z = focalLength * 4;

		this.camera = new Camera
		(
			viewSize,
			focalLength,
			new Disposition
			(
				new Coords(0 - focalLength, 0, 0), //pos,
				new Orientation
				(
					new Coords(1, 0, 0), // forward
					new Coords(0, 0, 1) // down
				)
			)
		);

		var targetForCamera = new Coords(0, 0, 0);

		// hack
		var locatable = new Locatable(this.camera.loc);
		this.camera.locatable = () => locatable;
		var constraints =
		[
			new Constraint_PositionOnCylinder
			(
				targetForCamera, // center
				new Orientation
				(
					new Coords(1, 0, 0),
					new Coords(0, 0, 1) // axis
				),
				0, // yaw
				this.camera.focalLength, // radius
				0 - this.camera.focalLength / 2 // distanceFromCenterAlongAxisMax
			),

			new Constraint_LookAt(targetForCamera),
		];

		var constrainable = new Constrainable(constraints);
		constrainable.constraintsByName = ArrayHelper.addLookupsByName(constraints);
		this.camera.constrainable = () => constrainable;

		Constrainable.constrain(universe, universe.world, this, this.camera);

		this.bodies = [];
		this.bodies.push(starsystem.star);
		this.bodies = this.bodies.concat(starsystem.linkPortals);
		this.bodies = this.bodies.concat(starsystem.planets);
		this.bodies = this.bodies.concat(starsystem.ships);
	}

	model()
	{
		return this.starsystem;
	}

	selectionName()
	{
		return (this.selection == null ? "[none]" : this.selection.name);
	}

	updateForTimerTick(universe)
	{
		this.venueControls.updateForTimerTick(universe);

		Constrainable.constrain(universe, universe.world, this, this.camera);

		if (this.cursor != null)
		{
			Constrainable.constrain(universe, universe.world, this, this.cursor);
		}

		var bodies = this.starsystem.ships;
		for (var i = 0; i < bodies.length; i++)
		{
			var body = bodies[i];
			var bodyDefnName = body.defn.name;

			var bodyActivity = body.activity;
			if (bodyActivity != null)
			{
				bodyActivity.perform(universe, body);
			}
		}

		this.draw(universe);

		this.updateForTimerTick_Input(universe);
	}

	updateForTimerTick_Input(universe)
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
			else if (inputHelper.isMouseClicked())
			{
				this.updateForTimerTick_Input_Mouse(universe);
			}
		}
	}

	updateForTimerTick_Input_Mouse(universe)
	{
		universe.soundHelper.soundWithNamePlayAsEffect(universe, "Sound");

		var inputHelper = universe.inputHelper;
		var mouseClickPos = this._mouseClickPos.overwriteWith
		(
			inputHelper.mouseClickPos
		);

		var camera = this.camera;

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

		var bodiesClickedAsCollisions = Collision.rayAndBodies
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
			var bodiesClickedAsCollisionsSorted = [];

			for (var i = 0; i < bodiesClickedAsCollisions.length; i++)
			{
				var collisionToSort = bodiesClickedAsCollisions[i];

				var j = 0;
				for (j = 0; j < bodiesClickedAsCollisionsSorted.length; j++)
				{
					var collisionSorted = bodiesClickedAsCollisionsSorted[j];

					if (collisionToSort.distance < collisionSorted.distance)
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

	updateForTimerTick_Input_Mouse_Selection(universe, bodyClicked)
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

				var targetBody = bodyClicked;
				if (this.cursor.orderName != null)
				{
					ship.order = new Order(this.cursor.orderName, targetBody);
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
					new BodyDefn
					(
						"MoveTarget",
						new Coords(0, 0, 0)
					),
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
				var layout = bodyClicked.layout;
				var venueNext = new VenueLayout(this, bodyClicked, layout);
				venueNext = new VenueFader(venueNext, universe.venueCurrent);
				universe.venueNext = venueNext;
			}
		}
		else
		{
			this.selection = bodyClicked;
		}
	}

	updateForTimerTick_Input_MouseMove(universe)
	{
		var inputHelper = universe.inputHelper;
		var mouseMovePos = this._mouseClickPos.overwriteWith
		(
			inputHelper.mouseMovePos
		);

		var camera = this.camera;
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

		var bodiesUnderMouseAsCollisions = Collision.rayAndBodies
		(
			rayFromCameraThroughMouse,
			this.bodies,
			10, // bodyRadius
			[]
		);

		var bodyUnderMouse;

		var bodiesCount = bodiesUnderMouseAsCollisions.length;

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

	cameraCenterOnSelection()
	{
		if (this.selection != null)
		{
			var cameraConstraint =
				this.camera.constrainable().constraintsByName.get("PositionOnCylinder");
			var selectionPos = this.selection.locatable().loc.pos;
			cameraConstraint.center.overwriteWith(selectionPos);
		}
	}

	cameraDown(cameraSpeed)
	{
		new Action_CylinderMove_DistanceAlongAxis(cameraSpeed).perform(this.camera);
	}

	cameraIn(cameraSpeed)
	{
		new Action_CylinderMove_Radius(0 - cameraSpeed).perform(this.camera);
	}

	cameraLeft(cameraSpeed)
	{
		new Action_CylinderMove_Yaw(cameraSpeed / 1000).perform(this.camera);
	}

	cameraOut(cameraSpeed)
	{
		new Action_CylinderMove_Radius(cameraSpeed).perform(this.camera);
	}

	cameraReset()
	{
		new Action_CylinderMove_Reset().perform(this.camera);
	}

	cameraRight(cameraSpeed)
	{
		new Action_CylinderMove_Yaw(0 - cameraSpeed / 1000).perform(this.camera);
	}

	cameraUp(cameraSpeed)
	{
		new Action_CylinderMove_DistanceAlongAxis(0 - cameraSpeed).perform(this.camera);
	}

	// controls

	controlBuild(universe)
	{
		var returnValue = null;

		var display = universe.display;
		var containerMainSize = display.sizeInPixels.clone();
		var fontHeightInPixels = display.fontHeightInPixels;
		var controlHeight = 16;
		var margin = 10;
		var containerInnerSize = new Coords(100, 60);
		var buttonWidth = (containerInnerSize.x - margin * 3) / 2;

		var controlBuilder = new ControlBuilderExtended(universe.controlBuilder);

		var returnValue = new ControlContainer
		(
			"containerStarsystem",
			new Coords(0, 0), // pos
			containerMainSize,
			// children
			[
				new ControlButton
				(
					"buttonBack",
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
					(universe) => // click
					{
						var venueNext = universe.venueCurrent.venueParent;
						venueNext = new VenueFader(venueNext, universe.venueCurrent);
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
					new Coords
					(
						containerMainSize.x - margin - containerInnerSize.x,
						margin
					),
					new Coords
					(
						containerInnerSize.x,
						containerMainSize.y - margin * 2
					),
					margin,
					controlHeight
				),

			]
		);

		returnValue = new ControlContainerTransparent(returnValue);

		return returnValue;
	}
}
