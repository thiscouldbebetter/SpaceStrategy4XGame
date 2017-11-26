
function VenueWorld(world)
{
	this.world = world;

	this.camera = this.world.camera;

	this.venueControls = new VenueControls
	(
		this.controlBuild()
	);
}

{
	VenueWorld.prototype.model = function()
	{
		return this.world.network;
	}

	// controls

	VenueWorld.prototype.controlBuild = function()
	{
		var returnValue = null;

		var containerMainSize = Globals.Instance.display.sizeInPixels.clone();
		var controlHeight = 16;

		var margin = 10;

		var containerInnerSize = new Coords(100, 60);

		var buttonWidth = (containerInnerSize.x - margin * 3) / 2;

		var faction = Globals.Instance.universe.world.factionCurrent();

		var controlBuilder = Globals.Instance.controlBuilder;

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
					Globals.Instance.display.fontHeightInPixels, 
					true, // hasBorder
					true, // isEnabled
					// click
					function()
					{
						var universe = Globals.Instance.universe;
						var venueNext = new VenueControls
						(
							Globals.Instance.controlBuilder.configure()
						);
						venueNext = new VenueFader(venueNext);
						universe.venueNext = venueNext;
					}
				),

				faction.controlBuild
				(
					containerMainSize,
					containerInnerSize, 
					margin, 
					controlHeight,
					buttonWidth
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

	VenueWorld.prototype.draw = function()
	{
		var display = Globals.Instance.display;

		display.clear();

		this.world.network.drawToDisplayForCamera
		(
			display,
			this.world.camera
		);

		this.venueControls.draw();
	}

	VenueWorld.prototype.finalize = function()
	{
		Globals.Instance.soundHelper.soundForMusic.pause();		
	}

	VenueWorld.prototype.initialize = function()
	{
		var soundHelper = Globals.Instance.soundHelper;
		soundHelper.soundWithNamePlayAsMusic("Music");
	}

	VenueWorld.prototype.selectionName = function()
	{
		return (this.selection == null ? "[none]" : this.selection.name);
	}

	VenueWorld.prototype.updateForTimerTick = function()
	{
		this.draw();

		this.venueControls.updateForTimerTick();

		var world = this.world;				
		var camera = world.camera;

		var inputHelper = Globals.Instance.inputHelper;
		if (inputHelper.isMouseClicked == true)
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
				Globals.Instance.universe.world.network.nodes,
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
					var venueNext = new VenueStarsystem(bodyClicked.starsystem);
					venueNext = new VenueFader(venueNext);
					Globals.Instance.universe.venueNext = venueNext;
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
				var universe = Globals.Instance.universe;
				var venueNext = new VenueControls
				(
					Globals.Instance.controlBuilder.configure()
				);
				venueNext = new VenueFader(venueNext);
				universe.venueNext = venueNext;
			}

			var cameraSpeed = 20;
			var displacementToMoveCamera = null;

			if (inputActive == "a")
			{
				displacementToMoveCamera = [cameraSpeed, 0];
			}
			else if (inputActive == "d")
			{
				displacementToMoveCamera = [0 - cameraSpeed, 0];
			}
			else if (inputActive == "s")
			{
				displacementToMoveCamera = [0, 0 - cameraSpeed];
			}
			else if (inputActive == "w")
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
