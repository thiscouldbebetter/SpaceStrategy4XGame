
function VenueStarsystem(starsystem)
{
	this.starsystem = starsystem;

	this.venueControls = new VenueControls
	(
		this.controlBuild()
	);
}

{
	VenueStarsystem.prototype.cursorBuild = function()
	{
		var ship = this.selection;
		var cursor = new Cursor
		(
			ship,
			false,
			false
		);
		this.cursor = cursor;
		this.bodies.push(cursor);
		this.selection = cursor;
	}

	VenueStarsystem.prototype.cursorClear = function()
	{
		var bodyIndexOfCursor = this.bodies.indexOf(this.cursor);
		this.bodies.splice(bodyIndexOfCursor, 1);
		this.selection = this.cursor.bodyParent;
		this.cursor = null;
	}

	VenueStarsystem.prototype.draw = function()
	{
		var display = Globals.Instance.display;
		display.clear();
		this.starsystem.drawToDisplayForCamera
		(
			display,
			this.camera
		);

		if (this.cursor != null)
		{
			this.starsystem.drawToDisplayForCamera_Body
			(
				display,
				this.camera,
				this.cursor
			);
		}

		this.venueControls.draw();
	}

	VenueStarsystem.prototype.finalize = function()
	{
		Globals.Instance.soundHelper.soundForMusic.pause();		
	}

	VenueStarsystem.prototype.initialize = function()
	{
		var starsystem = this.starsystem;

		var soundHelper = Globals.Instance.soundHelper;
		soundHelper.soundWithNamePlayAsMusic("Music");

		var viewSize = Globals.Instance.display.sizeInPixels.clone();
		var focalLength = viewSize.y;
		viewSize.z = focalLength * 4;
			
		this.camera = new Camera
		(
			viewSize, 
			focalLength, 
			new Coords(0 - focalLength, 0, 0), //pos, 
			new Orientation
			(
				new Coords(1, 0, 0), // forward
				new Coords(0, 0, 1) // down
			)
		);
	
		var targetForCamera = new Coords(0, 0, 0);
	
		this.camera.constraints = [];

		this.camera.constraints.push
		(
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
			)
		);
	
		this.camera.constraints.push
		(
			new Constraint_LookAtBody
			(
				targetForCamera
			)
		);

		this.camera.constraints.addLookups("name");

		this.bodies = [];
		this.bodies.push(starsystem.star);
		this.bodies = this.bodies.concat(starsystem.linkPortals);
		this.bodies = this.bodies.concat(starsystem.planets);
		this.bodies = this.bodies.concat(starsystem.ships);
	}

	VenueStarsystem.prototype.model = function()
	{
		return this.starsystem;
	}

	VenueStarsystem.prototype.selectionName = function()
	{
		return (this.selection == null ? "[none]" : this.selection.name);
	}

	VenueStarsystem.prototype.updateForTimerTick = function()
	{
		this.venueControls.updateForTimerTick();

		var camera = this.camera;
		var cameraConstraints = camera.constraints;
		for (var i = 0; i < cameraConstraints.length; i++)
		{
			var constraint = cameraConstraints[i];
			constraint.applyToBody(camera);
		}

		if (this.cursor != null)
		{
			var constraints = this.cursor.constraints;
			for (var i = 0; i < constraints.length; i++)
			{
				var constraint = constraints[i];
				constraint.applyToBody(this.cursor);
			}
		}

		var bodies = this.starsystem.ships;
		for (var i = 0; i < bodies.length; i++)
		{
			var body = bodies[i];
			var bodyDefnName = body.defn.name;

			if (bodyDefnName == "Ship")
			{
				var ship = body;

				var shipOrder = ship.order;
				if (shipOrder != null)
				{
					shipOrder.obey(ship);
				}

				var shipActivity = ship.activity;
				if (shipActivity != null)
				{
					shipActivity.perform(ship);
				}				
			}
		}

		this.draw();

		var inputHelper = Globals.Instance.inputHelper;

		var inputsActive = inputHelper.inputsActive;
		for (var i = 0; i < inputsActive.length; i++)
		{
			var inputActive = inputsActive[i];
			if (inputActive == "a")
			{
				new Action_CylinderMove_Yaw(-.01).perform(camera);
			}
			else if (inputActive == "d")
			{
				new Action_CylinderMove_Yaw(.01).perform(camera);
			}
			else if (inputActive == "f")
			{
				new Action_CylinderMove_DistanceAlongAxis(10).perform(camera);
			}
			else if (inputActive == "r")
			{
				new Action_CylinderMove_DistanceAlongAxis(-10).perform(camera);
			}
			else if (inputActive == "s")
			{
				new Action_CylinderMove_Radius(10).perform(camera);
			}
			else if (inputActive == "w")
			{
				new Action_CylinderMove_Radius(-10).perform(camera);
			}
			else if (inputHelper.isMouseClicked == true)
			{
				inputHelper.isMouseClicked = false;

				Globals.Instance.soundHelper.soundWithNamePlayAsEffect("Sound");
				var mouseClickPos = inputHelper.mouseClickPos.clone().subtract
				(
					camera.viewSizeHalf
				);

				var rayFromCameraThroughClick = camera.rayToViewPos(mouseClickPos);

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

						bodiesClickedAsCollisionsSorted.splice
						(
							j, 0, collisionToSort 
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

				if (this.selection == null)
				{
					this.selection = bodyClicked;
				}
				else
				{
					var selectionDefnName = this.selection.defn.name;
					if (selectionDefnName == "Cursor")
					{
						var cursor = this.selection;

						if (bodyClicked != null && bodyClicked.defn.name != "Cursor")
						{
							var targetBody = bodyClicked;

							var ship = cursor.bodyParent;

							ship.order = new Order
							(
								"Go",
								targetBody	
							);

							this.cursorClear();

							Globals.Instance.inputHelper.isEnabled = false;
						}
						else if (cursor.hasXYPositionBeenSpecified == false)
						{
							cursor.hasXYPositionBeenSpecified = true;
						}
						else if (cursor.hasZPositionBeenSpecified == false)
						{
							var targetBody = new Body
							(
								"Target", 
								new BodyDefn
								(
									"MoveTarget", 
									new Coords(0, 0, 0)
								), 
								cursor.loc.pos.clone()
							); 

							var ship = cursor.bodyParent;

							ship.order = new Order
							(
								"Go",
								targetBody	
							);

							this.cursorClear();

							Globals.Instance.inputHelper.isEnabled = false;
						}
		
					}
					else if (this.selection == bodyClicked)
					{
						if (selectionDefnName == "Planet")
						{
							var layout = bodyClicked.layout;
							var venueNext = new VenueLayout(this, layout);
							venueNext = new VenueFader(venueNext);
							Globals.Instance.universe.venueNext = venueNext;						
						}	
					}
					else
					{
						this.selection = bodyClicked;
					}
				}
			}
		}
	}

	// controls

	VenueStarsystem.prototype.controlBuild = function()
	{
		var returnValue = null;

		var display = Globals.Instance.display;
		var containerMainSize = display.sizeInPixels.clone();
		var fontHeightInPixels = display.fontHeightInPixels;
		var controlHeight = 16;
		var margin = 10;
		var containerInnerSize = new Coords(100, 60);
		var buttonWidth = (containerInnerSize.x - margin * 3) / 2;

		var controlBuilder = Globals.Instance.controlBuilder;

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
					// click
					function()
					{
						var universe = Globals.Instance.universe;
						var world = universe.world;
						var venueNext = new VenueWorld(world);
						venueNext = new VenueFader(venueNext);
						universe.venueNext = venueNext;
					}
				),

				controlBuilder.view
				(
					containerMainSize, 
					containerInnerSize, 
					margin,
					controlHeight
				),

				controlBuilder.timeAndPlace
				(
					containerMainSize, 
					containerInnerSize, 
					margin,
					controlHeight
				),

				controlBuilder.selection
				(
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
