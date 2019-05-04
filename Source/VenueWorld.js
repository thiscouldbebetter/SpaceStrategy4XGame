
function VenueWorld(world)
{
	this.world = world;

	this.camera = this.world.camera;
}

{
	VenueWorld.prototype.model = function()
	{
		return this.world.network;
	};

	// camera

	VenueWorld.prototype.cameraCenterOnSelection = function()
	{
		if (this.selection != null)
		{
			var targetPosNew = this.selection.loc.pos;

			var cameraConstraints = camera.Constrainable.constraints;
			var constraintDistance = cameraConstraints["HoldDistanceFromTarget"];
			constraintDistance.targetPos = targetPosNew;

			var constraintLookAt = cameraConstraints["LookAt"];
			constraintLookAt.targetPos = targetPosNew;
		}
	};

	VenueWorld.prototype.cameraDown = function(cameraSpeed)
	{
		var cameraAction = new Action_CameraMove([0, cameraSpeed]);
		cameraAction.perform(this.camera);
	};

	VenueWorld.prototype.cameraIn = function(cameraSpeed)
	{
		var constraint = this.camera.Constrainable.constraints["HoldDistanceFromTarget"];
		constraint.distanceToHold -= cameraSpeed / 2;
		if (constraint.distanceToHold < 1)
		{
			constraint.distanceToHold = 1;
		}
	};

	VenueWorld.prototype.cameraLeft = function(cameraSpeed)
	{
		var cameraAction = new Action_CameraMove([0 - cameraSpeed, 0]);
		cameraAction.perform(this.camera);
	};

	VenueWorld.prototype.cameraOut = function(cameraSpeed)
	{
		var constraint = this.camera.Constrainable.constraints["HoldDistanceFromTarget"];
		constraint.distanceToHold += cameraSpeed / 2;
		if (constraint.distanceToHold < 0)
		{
			constraint.distanceToHold = 0;
		}
	};

	VenueWorld.prototype.cameraReset = function()
	{
		var cameraConstraints = this.camera.Constrainable.constraints;

		var origin = new Coords(0, 0, 0);
		var constraintDistance = cameraConstraints["HoldDistanceFromTarget"];
		constraintDistance.distanceToHold = this.camera.focalLength;
		constraintDistance.targetPos = origin;

		constraintLookAt = cameraConstraints["LookAt"];
		constraintLookAt.targetPos = origin;

		this.camera.loc.pos.clear().x = 0 - this.camera.focalLength;
	};

	VenueWorld.prototype.cameraRight = function(cameraSpeed)
	{
		var cameraAction = new Action_CameraMove([cameraSpeed, 0]);
		cameraAction.perform(this.camera);
	};

	VenueWorld.prototype.cameraUp = function(cameraSpeed)
	{
		var cameraAction = new Action_CameraMove([0, 0 - cameraSpeed]);
		cameraAction.perform(this.camera);
	};

	// controls

	VenueWorld.prototype.controlBuild = function(universe)
	{
		var returnValue = null;

		var containerMainSize = universe.display.sizeInPixels.clone();
		var controlHeight = 16;

		var margin = 10;
		var fontHeightInPixels = universe.display.fontHeightInPixels;

		var containerInnerSize = new Coords(100, 60);

		var buttonWidth = (containerInnerSize.x - margin * 3) / 2;

		var faction = universe.world.factionCurrent();

		var controlBuilder = universe.controlBuilder;

		var returnValue = new ControlContainer
		(
			"containerNetwork",
			new Coords(0, 0), // pos
			containerMainSize,
			// children
			[
				new ControlButton
				(
					"buttonMenu",
					new Coords
					(
						(containerMainSize.x - buttonWidth) / 2,
						containerMainSize.y - margin - controlHeight
					), // pos
					new Coords(buttonWidth, controlHeight), // size
					"Menu",
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var venueNext = new VenueControls
						(
							universe.controlBuilder.configure(universe)
						);
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

				faction.controlBuild
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
					new Coords
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

		returnValue = new ControlContainerTransparent(returnValue);

		return returnValue;
	};

	// venue

	VenueWorld.prototype.draw = function(universe)
	{
		universe.display.drawBackground();
		//this.world.network.draw(universe, this.world.camera);
		var playerFaction = this.world.factions[0];
		var playerKnowledge = playerFaction.knowledge;
		var worldKnown = playerKnowledge.worldKnown(universe, this.world);
		worldKnown.network.draw(universe, worldKnown.camera);
		this.venueControls.draw(universe);
	};

	VenueWorld.prototype.finalize = function(universe)
	{
		universe.soundHelper.soundForMusic.pause(universe);
	};

	VenueWorld.prototype.initialize = function(universe)
	{
		this.world.initialize(universe);
		this.venueControls = new VenueControls
		(
			this.controlBuild(universe)
		);

		var soundHelper = universe.soundHelper;
		soundHelper.soundWithNamePlayAsMusic(universe, "Music");

		var origin = new Coords(0, 0, 0);

		this.camera.Constrainable = new Constrainable
		(
			[
				new Constraint_HoldDistanceFromTarget
				(
					this.camera.focalLength, // distanceToHold
					origin
				),
				new Constraint_LookAt(origin),
			].addLookupsByName()
		);
	};

	VenueWorld.prototype.selectionName = function()
	{
		return (this.selection == null ? "[none]" : this.selection.name);
	};

	VenueWorld.prototype.updateForTimerTick = function(universe)
	{
		var world = universe.world;
		Constrainable.constrain(universe, world, this, this.camera);

		this.draw(universe);

		this.venueControls.updateForTimerTick(universe);

		var world = this.world;
		var camera = world.camera;

		var inputHelper = universe.inputHelper;
		if (inputHelper.isMouseClicked() == true)
		{
			universe.soundHelper.soundWithNamePlayAsEffect(universe, "Sound");

			var mouseClickPos = inputHelper.mouseClickPos.clone();
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

			var playerFaction = world.factions[0];
			var worldKnown = playerFaction.knowledge.worldKnown();

			var bodiesClickedAsCollisions = Collision.rayAndBodies
			(
				rayFromCameraThroughClick,
				worldKnown.network.nodes,
				NetworkNode.RadiusActual,
				[] // listToAddTo
			);

			if (bodiesClickedAsCollisions.length > 0)
			{
				var collisionNearest = bodiesClickedAsCollisions[0];

				for (var i = 1; i < bodiesClickedAsCollisions.length; i++)
				{
					var collision = bodiesClickedAsCollisions[i];
					if (collision.distance < collisionNearest.distance)
					{
						collisionNearest = collision;
					}
				}

				var bodyClicked = collisionNearest.colliders[0]; // todo

				if (bodyClicked == this.selection)
				{
					var venueCurrent = universe.venueCurrent;
					var starsystem = bodyClicked.starsystem;
					if (starsystem != null)
					{
						var venueNext = new VenueStarsystem(venueCurrent, starsystem);
						venueNext = new VenueFader(venueNext, venueCurrent);
						universe.venueNext = venueNext;
					}
				}

				this.selection = bodyClicked;
			}
		}

		var inputsActive = inputHelper.inputsPressed;
		for (var i = 0; i < inputsActive.length; i++)
		{
			var inputActive = inputsActive[i].name;

			if (inputActive == "Escape")
			{
				var venueNext = new VenueControls
				(
					universe.controlBuilder.configure(universe)
				);
				venueNext = new VenueFader(venueNext, universe.venueCurrent);
				universe.venueNext = venueNext;
			}

			var cameraSpeed = 20;

			if (inputActive.startsWith("Mouse"))
			{
				// Do nothing.
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
	};
}
