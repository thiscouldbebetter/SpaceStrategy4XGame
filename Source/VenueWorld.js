
function VenueWorld(world)
{
	this.world = world;

	this.camera = this.world.camera;
}

{
	VenueWorld.prototype.model = function()
	{
		return this.world.network;
	}

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
					}
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
	}

	// venue 

	VenueWorld.prototype.draw = function(universe)
	{
		var display = universe.display;

		display.clear();

		this.world.network.drawToDisplayForCamera
		(
			universe,
			display,
			this.world.camera
		);

		this.venueControls.draw(universe);
	}

	VenueWorld.prototype.finalize = function(universe)
	{
		universe.soundHelper.soundForMusic.pause(universe);
	}

	VenueWorld.prototype.initialize = function(universe)
	{
		this.venueControls = new VenueControls
		(
			this.controlBuild(universe)
		);

		var soundHelper = universe.soundHelper;
		soundHelper.soundWithNamePlayAsMusic(universe, "Music");
	}

	VenueWorld.prototype.selectionName = function()
	{
		return (this.selection == null ? "[none]" : this.selection.name);
	}

	VenueWorld.prototype.updateForTimerTick = function(universe)
	{
		this.draw(universe);

		this.venueControls.updateForTimerTick(universe);

		var world = this.world;
		var camera = world.camera;

		var inputHelper = universe.inputHelper;
		if (inputHelper.isMouseClicked() == true)
		{
			inputHelper.isMouseClicked(false);
			universe.soundHelper.soundWithNamePlayAsEffect(universe, "Sound");

			var mouseClickPos = inputHelper.mouseClickPos.clone();
			var rayFromCameraThroughClick = new Ray
			(
				camera.loc.pos,
				camera.coordsTransformViewToWorld
				(
					mouseClickPos
				).subtract
				(
					camera.loc.pos
				)
			);

			var bodiesClickedAsCollisions = Collision.rayAndBodies
			(
				rayFromCameraThroughClick,
				universe.world.network.nodes,
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
					var venueNext = new VenueStarsystem(universe, bodyClicked.starsystem);
					venueNext = new VenueFader(venueNext, universe.venueCurrent);
					universe.venueNext = venueNext;
				}

				this.selection = bodyClicked;
			}
		}

		var inputsActive = inputHelper.inputsActive;
		for (var i = 0; i < inputsActive.length; i++)
		{
			var inputActive = inputsActive[i];

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
			var displacementToMoveCamera = null;

			if (inputActive == "_a")
			{
				displacementToMoveCamera = [cameraSpeed, 0];
			}
			else if (inputActive == "_d")
			{
				displacementToMoveCamera = [0 - cameraSpeed, 0];
			}
			else if (inputActive == "_s")
			{
				displacementToMoveCamera = [0, 0 - cameraSpeed];
			}
			else if (inputActive == "_w")
			{
				displacementToMoveCamera = [0, cameraSpeed];
			}

			if (displacementToMoveCamera != null)
			{
				new Action_CameraMove(displacementToMoveCamera).perform(camera);
			}
		}
	}

}
