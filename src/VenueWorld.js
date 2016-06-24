
function VenueWorld(world)
{
	this.world = world;
	this.model = this.world;

	this.camera = this.world.camera;

	this.venueControls = new VenueControls
	(
		this.controlBuild()
	);
}

{
	// controls

	VenueWorld.prototype.controlBuild = function()
	{
		var returnValue = null;

		var containerMainSize = Globals.Instance.displayHelper.viewSize.clone();
		var controlHeight = 16;

		var margin = 10;

		var containerInnerSize = new Coords(100, 60);

		var buttonWidth = (containerInnerSize.x - margin * 3) / 2;

		var faction = Globals.Instance.universe.world.factionCurrent();

		var returnValue = new ControlContainer
		(
			"containerMain",
			[ "Transparent", "Transparent" ], // colorsForeAndBack
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
					null, // dataBindingForIsEnabled
					// click
					function()
					{
						var universe = Globals.Instance.universe;
						var venueNext = new VenueControls
						(
							ControlBuilder.configure()
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

				ControlBuilder.view
				(
					containerMainSize, 
					containerInnerSize, 
					margin,
					controlHeight
				),

				ControlBuilder.timeAndPlace
				(
					containerMainSize, 
					containerInnerSize, 
					margin,
					controlHeight
				),

				ControlBuilder.selection
				(
					new Coords
					(
						containerMainSize.x - margin - containerInnerSize.x,
						containerMainSize.y - margin - containerInnerSize.y
					),					containerInnerSize, 
					margin,
					controlHeight
				),
			]
		);

		return returnValue;
	}

	// venue 

	VenueWorld.prototype.draw = function()
	{
		var displayHelper = Globals.Instance.displayHelper;

		displayHelper.clear();

		displayHelper.drawNetworkForCamera
		(
			this.world.network,
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

	VenueWorld.prototype.updateForTimerTick = function()
	{
		this.venueControls.updateForTimerTick();

		var world = this.world;				
		var camera = world.camera;

		var inputHelper = Globals.Instance.inputHelper;
		if (inputHelper.isMouseLeftPressed == true)
		{
			inputHelper.isMouseLeftPressed = false;
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

		var keyCode = inputHelper.keyCodePressed;

		if (keyCode == 27) // escape
		{
			var universe = Globals.Instance.universe;
			var venueNext = new VenueControls
			(
				ControlBuilder.configure()
			);
			venueNext = new VenueFader(venueNext);
			universe.venueNext = venueNext;
		}

		var cameraSpeed = 20;
		var displacementToMoveCamera = null;

		if (keyCode == 65) // A
		{
			displacementToMoveCamera = [cameraSpeed, 0];
		}
		else if (keyCode == 68) // D
		{
			displacementToMoveCamera = [0 - cameraSpeed, 0];
		}
		else if (keyCode == 83) // S
		{
			displacementToMoveCamera = [0, 0 - cameraSpeed];
		}
		else if (keyCode == 87) // W
		{
			displacementToMoveCamera = [0, cameraSpeed];
		}

		if (displacementToMoveCamera != null)
		{
			new Action_CameraMove(displacementToMoveCamera).perform(camera);
		}
	}
	
}
