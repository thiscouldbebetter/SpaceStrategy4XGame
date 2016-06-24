
function ControlBuilder()
{}
{
	// constants

	ControlBuilder.ColorsForeAndBackDefault = [ "Gray", "White" ];

	// static methods

	ControlBuilder.configure = function()
	{
		var displayHelper = Globals.Instance.displayHelper;
		var containerSize = displayHelper.viewSize.clone();
		var controlHeight = containerSize.y / 12;
		var columnWidth = 100;
		var labelWidth = 75;
		var margin = 10;
		var buttonWidth = (columnWidth - margin) / 2;

		var returnValue = new ControlContainer
		(
			"containerConfigure",
			ControlBuilder.ColorsForeAndBackDefault,
			new Coords(0, 0), // pos
			containerSize,
			// children
			[
				new ControlButton
				(
					"buttonSave",
					new Coords((containerSize.x - columnWidth) / 2, 15), // pos
					new Coords(columnWidth, controlHeight), // size
					"Save",
					null, // dataBindingForIsEnabled
					// click
					function ()
					{
						var universe = Globals.Instance.universe;
						var profile = universe.profile;
						var world = universe.world;

						world.dateSaved = DateTime.now();

						Globals.Instance.profileHelper.profileSave
						(
							profile
						);

						var venueNext = new VenueWorld(world);
						venueNext = new VenueFader(venueNext);
						universe.venueNext = venueNext;
					}
				),

				new ControlLabel
				(
					"labelMusicVolume",
					new Coords((containerSize.x - columnWidth) / 2, 45), // pos
					new Coords(labelWidth, controlHeight), // size
					false, // isTextCentered
					new DataBinding("Music Volume:")
				),

				new ControlSelect
				(
					"selectMusicVolume",
					new Coords((containerSize.x - columnWidth) / 2 + labelWidth, 45), // pos
					new Coords(controlHeight, controlHeight), // size

					// dataBindingForValueSelected
					new DataBinding
					(
						Globals.Instance.soundHelper, 
						"musicVolume"
					),

					// dataBindingForOptions
					new DataBinding
					(
						SoundHelper.controlSelectOptionsVolume(),
						null
					),

					"value", // bindingExpressionForOptionValues,
					"text", // bindingExpressionForOptionText
					new DataBinding(true) // dataBindingForIsEnabled
				),

				new ControlLabel
				(
					"labelSoundVolume",
					new Coords((containerSize.x - columnWidth) / 2, 75), // pos
					new Coords(labelWidth, controlHeight), // size
					false, // isTextCentered
					new DataBinding("Sound Volume:")
				),

				new ControlSelect
				(
					"selectSoundVolume",
					new Coords
					(
						(containerSize.x - columnWidth) 
						/ 2 
						+ labelWidth, 
						75
					), // pos
					new Coords(controlHeight, controlHeight), // size

					// dataBindingForValueSelected
					new DataBinding
					(
						Globals.Instance.soundHelper, 
						"soundVolume"
					),

					// dataBindingForOptions
					new DataBinding
					(
						SoundHelper.controlSelectOptionsVolume(),
						null
					),
					"value", // bindingExpressionForOptionValues,
					"text", // bindingExpressionForOptionText
					new DataBinding(true) // dataBindingForIsEnabled
				),

				new ControlButton
				(
					"buttonReturn",
					new Coords((containerSize.x - columnWidth) / 2, 105), // pos
					new Coords(buttonWidth, controlHeight), // size
					"Return",
					null, // dataBindingForIsEnabled
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
	
				new ControlButton
				(
					"buttonQuit",
					new Coords((containerSize.x - columnWidth) / 2 + buttonWidth + margin, 105), // pos
					new Coords(buttonWidth, controlHeight), // size
					"Quit",
					null, // dataBindingForIsEnabled
					// click
					function()
					{
						Globals.Instance.reset();
						var universe = Globals.Instance.universe;
						var venueNext = new VenueControls
						(
							ControlBuilder.title()
						);
						venueNext = new VenueFader(venueNext);
						universe.venueNext = venueNext;
					}
				),
			]
		);

		return returnValue;
	}

	ControlBuilder.confirm = function(message, confirm, cancel)
	{
		var containerSize = Globals.Instance.displayHelper.viewSize.clone();
		var controlHeight = containerSize.y / 12;
		var buttonWidth = 45;
		var margin = 10;

		var returnValue = new ControlContainer
		(
			"containerConfirm",
			ControlBuilder.ColorsForeAndBackDefault,
			new Coords(0, 0), // pos
			containerSize,
			// children
			[
				new ControlLabel
				(
					"labelMessage",
					new Coords((containerSize.x - 100) / 2, 50), // pos
					new Coords(100, controlHeight), // size
					true, // isTextCentered
					new DataBinding(message)
				),

				new ControlButton
				(
					"buttonConfirm",
					new Coords
					(
						(
							containerSize.x 
							- (buttonWidth * 2 + margin)
						) / 2, 
						100
					), // pos
					new Coords(buttonWidth, controlHeight), // size
					"Confirm",
					null, // dataBindingForIsEnabled
					confirm
				),

				new ControlButton
				(
					"buttonCancel",
					new Coords
					(
						(
							containerSize.x 
							- (buttonWidth * 2 + margin)
						) / 2 
						+ buttonWidth + margin, 
						100
					), // pos
					new Coords(buttonWidth, controlHeight), // size
					"Cancel",
					null, // dataBindingForIsEnabled
					cancel
				),
			]
		);

		return returnValue;
	}

	ControlBuilder.profileDetail = function()
	{
		var containerSize = Globals.Instance.displayHelper.viewSize.clone();
		var controlHeight = containerSize.y / 12;
		var buttonWidth = 45;
		var margin = 10;

		var returnValue = new ControlContainer
		(
			"containerProfileDetail",
			ControlBuilder.ColorsForeAndBackDefault,
			new Coords(0, 0), // pos
			containerSize,
			// children
			[
				new ControlLabel
				(
					"labelProfileName",
					new Coords
					(
						(containerSize.x - 100) / 2, 
						controlHeight
					), // pos
					new Coords(100, controlHeight), // size
					true, // isTextCentered
					new DataBinding(Globals.Instance.universe.profile.name)
				),

				new ControlSelect
				(
					"listWorlds",
					new Coords((containerSize.x - 150) / 2, 50), // pos
					new Coords(150, 50), // size
					// dataBindingForValueSelected
					new DataBinding(Globals.Instance.universe, "world"), 
					// dataBindingForOptions
					new DataBinding
					(
						Globals.Instance.universe.profile.worlds,
						null
					),
					null, // bindingExpressionForOptionValues
					"name", // bindingExpressionForOptionText
					new DataBinding(true), // dataBindingForIsEnabled
					4 // numberOfItemsVisible
				),

				new ControlButton
				(
					"buttonBack",
					new Coords(margin, margin), // pos
					new Coords(controlHeight, controlHeight), // size
					"<",
					null, // dataBindingForIsEnabled
					// click
					function ()
					{
						var venueNext = new VenueControls
						(
							ControlBuilder.profileSelect()
						);
						venueNext = new VenueFader(venueNext);
						var universe = Globals.Instance.universe;
						universe.venueNext = venueNext;
					}
				),
	
				new ControlButton
				(
					"buttonNew",
					new Coords
					(
						(
							containerSize.x 
							- (buttonWidth * 2 + margin)
						) / 2, 
						110
					), // pos
					new Coords(buttonWidth, controlHeight), // size
					"New",
					null, // dataBindingForIsEnabled
					// click
					function ()
					{
						var world = World.new();

						var universe = Globals.Instance.universe;
						var profile = universe.profile;
						profile.worlds.push(world);

						Globals.Instance.profileHelper.profileSave
						(
							profile
						);				

						universe.world = world;
						var venueNext = new VenueControls
						(
							ControlBuilder.worldDetail()
						);
						venueNext = new VenueVideo
						(
							"Intro", // videoName
							venueNext
						);
						venueNext = new VenueFader(venueNext);
						universe.venueNext = venueNext;
					}
				),

				new ControlButton
				(
					"buttonSelectWorld",
					new Coords
					(
						(
							containerSize.x 
							- (buttonWidth * 2 + margin)
						) / 2 + 45 + margin, 
						110
					), // pos
					new Coords(buttonWidth, controlHeight), // size
					"Select",
					// dataBindingForIsEnabled
					new DataBinding(Globals.Instance.universe, "isWorldSelected"), 
					// click
					function ()
					{
						var venueNext = new VenueControls
						(
							ControlBuilder.worldDetail()
						);
						venueNext = new VenueFader(venueNext);
						Globals.Instance.universe.venueNext = venueNext;
					}
				),	

				new ControlButton
				(
					"buttonDeleteProfile",
					new Coords(containerSize.x - controlHeight - margin, margin), // pos
					new Coords(controlHeight, controlHeight), // size
					"X",
					null, // dataBindingForIsEnabled
					// click
					function ()
					{
						var universe = Globals.Instance.universe;
						var profile = universe.profile;

						var controlConfirm = ControlBuilder.confirm
						(
							"Delete Profile \"" 
								+ profile.name 
								+ "\"?",
							// confirm
							function()
							{
								var universe = Globals.Instance.universe;
								var profile = universe.profile;
								Globals.Instance.profileHelper.profileDelete
								(
									profile
								);
								universe.profile = null;

								var venueNext = new VenueControls
								(
									ControlBuilder.profileSelect()
								);
								venueNext = new VenueFader(venueNext);
								universe.venueNext = venueNext;
							},
							// cancel
							function()
							{
								var venueNext = new VenueControls
								(
									ControlBuilder.profileDetail()
								);
								venueNext = new VenueFader(venueNext);
								var universe = Globals.Instance.universe;
								universe.venueNext = venueNext;
							}						
						);

						var venueNext = new VenueControls(controlConfirm);
						venueNext = new VenueFader(venueNext);
						universe.venueNext = venueNext;
					}
				),
			]
		);

		return returnValue;
	}

	ControlBuilder.profileNew = function()
	{
		var containerSize = Globals.Instance.displayHelper.viewSize.clone();
		var buttonWidth = 45;
		var controlHeight = containerSize.y / 12;
		var margin = 10;

		return new ControlContainer
		(
			"containerProfileNew",
			ControlBuilder.ColorsForeAndBackDefault,
			new Coords(0, 0), // pos
			containerSize,
			// children
			[
				new ControlLabel
				(
					"labelName",
					new Coords((containerSize.x - 100) / 2, 25), // pos
					new Coords(100, 25), // size
					true, // isTextCentered
					new DataBinding("Name:")
				),

				new ControlTextBox
				(
					"textBoxName",
					new Coords((containerSize.x - 100) / 2, 50), // pos
					new Coords(100, 25), // size
					""
				),

				new ControlButton
				(
					"buttonCreate",
					new Coords((containerSize.x - (buttonWidth * 2 + margin)) / 2, 80), // pos
					new Coords(buttonWidth, controlHeight), // size
					"Create",
					null, // dataBindingForIsEnabled
					// click
					function ()
					{
						var container = Globals.Instance.universe.venueCurrent.controlRoot;
						var textBoxName = container.children["textBoxName"];
						var profileName = textBoxName.text();
						if (profileName == "")
						{
							return;
						}

						var profile = new Profile(profileName, []);
						Globals.Instance.profileHelper.profileAdd
						(
							profile
						);

						var universe = Globals.Instance.universe;
						universe.profile = profile;
						var venueNext = new VenueControls
						(
							ControlBuilder.profileDetail()
						);
						venueNext = new VenueFader(venueNext);
						universe.venueNext = venueNext;
					}
				),

				new ControlButton
				(
					"buttonCancel",
					new Coords
					(
						(
							containerSize.x 
							- (buttonWidth * 2 + margin)
						) / 2 
						+ buttonWidth 
						+ margin, 
						80
					), // pos
					new Coords(buttonWidth, controlHeight), // size
					"Cancel",
					null, // dataBindingForIsEnabled
					// click
					function ()
					{
						var universe = Globals.Instance.universe;
						var venueNext = new VenueControls
						(
							ControlBuilder.profileSelect()
						);
						venueNext = new VenueFader(venueNext);
						universe.venueNext = venueNext;
					}
				),
			]
		);
	}

	ControlBuilder.profileSelect = function()
	{
		var profiles = Globals.Instance.profileHelper.profiles();
		
		var containerSize = Globals.Instance.displayHelper.viewSize.clone();
		var controlHeight = containerSize.y / 12;
		var buttonWidth = 45;
		var margin = 10;

		var returnValue = new ControlContainer
		(
			"containerProfileSelect",
			ControlBuilder.ColorsForeAndBackDefault,
			new Coords(0, 0), // pos
			containerSize,
			// children
			[
				new ControlLabel
				(
					"labelSelectAProfile",
					new Coords((containerSize.x - 100) / 2, 25), // pos
					new Coords(100, controlHeight), // size
					true, // isTextCentered
					new DataBinding("Select a Profile:")
				),

				new ControlSelect
				(
					"listProfiles",
					new Coords((containerSize.x - 100) / 2, 55), // pos
					new Coords(100, 50), // size
					// dataBindingForValueSelected
					new DataBinding(Globals.Instance.universe, "profile"), 
					new DataBinding(profiles), // options
					null, // bindingExpressionForOptionValues
					"name", // bindingExpressionForOptionText,
					new DataBinding(true), // isEnabled
					4 // numberOfItemsVisible
				),

				new ControlButton
				(
					"buttonNew",
					new Coords((containerSize.x - 100) / 2, 110), // pos
					new Coords(buttonWidth, controlHeight), // size
					"New",
					null, // dataBindingForIsEnabled
					// click
					function ()
					{
						var universe = Globals.Instance.universe;
						var venueNext = new VenueControls
						(
							ControlBuilder.profileNew()
						);
						venueNext = new VenueFader(venueNext);
						universe.venueNext = venueNext;
					}
				),

				new ControlButton
				(
					"buttonInstant",
					new Coords((containerSize.x - 100) / 2, 150), // pos
					new Coords(100, controlHeight), // size
					"Instant",
					null, // dataBindingForIsEnabled
					// click
					function ()
					{

						var universe = Globals.Instance.universe;

						var profile = new Profile("Default", []);
						universe.profile = profile;
						var world = World.new();
						profile.worlds.push(world);
						universe.world = world;
						var venueNext = new VenueWorld
						(
							universe.world
						);
						venueNext = new VenueFader(venueNext);
						universe.venueNext = venueNext;
					}
				),				

				new ControlButton
				(
					"buttonSelectProfile",
					new Coords((containerSize.x - 100) / 2 + buttonWidth + margin, 110), // pos
					new Coords(buttonWidth, controlHeight), // size
					"Select",
					// dataBindingForIsEnabled
					new DataBinding(Globals.Instance.universe, "isProfileSelected"),
					// click
					function()
					{						
						var venueNext = new VenueControls
						(
							ControlBuilder.profileDetail()
						);				
						venueNext = new VenueFader(venueNext);		
						Globals.Instance.universe.venueNext = venueNext;
					}
				),

			]
		);

		return returnValue;
	}

	ControlBuilder.selection = function
	(
		pos, 
		size, 
		margin,
		controlHeight
	)
	{	
		var returnValue = new ControlContainer
		(
			"containerSelected",
			ControlBuilder.ColorsForeAndBackDefault,
			pos.clone(),
			size.clone(),
			// children
			[
				new ControlLabel
				(
					"labelSelected",
					new Coords(margin, 0), // pos
					new Coords(0, controlHeight), // size
					false, // isTextCentered
					new DataBinding("Selection:")
				),

				new ControlPlaceholder
				(
					"placeholderSelection",
					new Coords(margin, controlHeight), // pos
					size.clone(), // size - hack
					"[none]",
					new DataBinding
					(
						Globals.Instance.universe,
						"venueCurrent.selection.controlBuild_Selection"
					)
				),
			]
		);

		return returnValue;
	}

	ControlBuilder.timeAndPlace = function
	(
		containerMainSize, 
		containerInnerSize, 
		margin,
		controlHeight
	)
	{
		var returnValue = new ControlContainer
		(
			"containerTimeAndPlace",
			ControlBuilder.ColorsForeAndBackDefault,
			new Coords
			(
				margin,
				margin
			),
			containerInnerSize,
			// children
			[
				new ControlLabel
				(
					"textDate",
					new Coords(margin,  margin), // pos
					new Coords
					(
						containerInnerSize.x - 30 - margin * 3, 
						controlHeight
					), // size
					false, // isTextCentered
					new DataBinding(Globals.Instance.universe, "venueCurrent.model.name")
				),

				new ControlLabel
				(
					"labelTurn",
					new Coords(margin, margin + controlHeight), // pos
					new Coords(0, controlHeight), // size
					false, // isTextCentered
					new DataBinding("Turn:")
				),

				new ControlLabel
				(
					"textTurn",
					new Coords(margin + 25, margin + controlHeight), // pos
					new Coords
					(
						containerInnerSize.x - 30 - margin * 3, 
						controlHeight
					), // size
					false, // isTextCentered
					new DataBinding(Globals.Instance.universe.world, "turnsSoFar")
				),

				new ControlButton
				(
					"buttonTurnNext", // name, 
					new Coords(margin + 50, margin + controlHeight), // pos
					new Coords(controlHeight, controlHeight), // size, 
					">", // text, 
					null, // dataBindingForIsEnabled, 
					// click
					function() 
					{ 
						var universe = Globals.Instance.universe;
						universe.world.updateForTurn();
					}
				),

				new ControlButton
				(
					"buttonTurnFastForward", // name, 
					new Coords(margin + 50 + controlHeight, margin + controlHeight), // pos
					new Coords(controlHeight, controlHeight), // size, 
					">>", // text, 
					null, // dataBindingForIsEnabled, 
					// click
					function() 
					{ 
						alert("todo - fast forward");
					}
				)

			]
		);

		return returnValue;
	}

	ControlBuilder.title = function()
	{
		var containerSize = Globals.Instance.displayHelper.viewSize.clone();

		var returnValue = new ControlContainer
		(
			"containerTitle",
			ControlBuilder.ColorsForeAndBackDefault,
			new Coords(0, 0), // pos
			containerSize,
			// children
			[
				new ControlImage
				(
					"imageTitle",
					new Coords(0, 0),
					containerSize,
					"Title.png"
				),
	
				new ControlButton
				(
					"buttonStart",
					new Coords
					(
						(containerSize.x - 50) / 2, 
						containerSize.y - 50
					), // pos
					new Coords(50, 25), // size
					"Start",
					null, // dataBindingForIsEnabled
					// click
					function()
					{
						var venueNext = new VenueControls
						(
							ControlBuilder.profileSelect()
						);
						venueNext = new VenueFader(venueNext);
						var universe = Globals.Instance.universe;
						universe.venueNext = venueNext;
					}
				),
			]
		);

		return returnValue;
	}

	ControlBuilder.view = function
	(
		containerMainSize, 
		containerInnerSize, 
		margin,
		controlHeight
	)
	{
		var cameraSpeed = 10;

		var returnValue = new ControlContainer
		(
			"containerViewControls",
			ControlBuilder.ColorsForeAndBackDefault,
			new Coords
			(
				margin,
				containerMainSize.y 
					- margin
					- containerInnerSize.y
			),
			containerInnerSize,
			// children
			[
				new ControlLabel
				(
					"labelControls",
					new Coords(margin, 0),// pos
					new Coords(0, controlHeight), // size
					false, // isTextCentered
					new DataBinding("View")
				),

				new ControlButton
				(
					"buttonViewUp",
					new Coords
					(
						(containerInnerSize.x - (controlHeight * 3)) / 2 + controlHeight, 
						controlHeight
					), // pos
					new Coords(controlHeight, controlHeight), // size
					"^",
					null, // dataBindingForIsEnabled
					// click
					function ()
					{
						var venueCurrent = Globals.Instance.universe.venueCurrent;
						var camera = venueCurrent.camera;
						new Action_CameraMove([0, cameraSpeed]).perform(camera);
					}
				),

				new ControlButton
				(
					"buttonViewDown",
					new Coords
					(
						(
							containerInnerSize.x 
							- (controlHeight * 3)
						) 
						/ 2 
						+ controlHeight, 
						controlHeight * 2
					), // pos
					new Coords(controlHeight, controlHeight), // size
					"v",
					null, // dataBindingForIsEnabled
					// click
					function ()
					{
						var universe = Globals.Instance.universe;
						var venueCurrent = universe.venueCurrent;
						var camera = venueCurrent.camera;
						new Action_CameraMove([0, 0 - cameraSpeed]).perform(camera);
					}
				),
				
				new ControlButton
				(
					"buttonViewLeft",
					new Coords
					(
						(containerInnerSize.x - (controlHeight * 3)) / 2, 
						controlHeight * 2
					), // pos
					new Coords(controlHeight, controlHeight), // size
					"<",
					null, // dataBindingForIsEnabled
					// click
					function ()
					{
						var venueCurrent = Globals.Instance.universe.venueCurrent;
						var camera = venueCurrent.camera;
						new Action_CameraMove([cameraSpeed, 0]).perform(camera);
					}
				),

				new ControlButton
				(
					"buttonViewRight",
					new Coords
					(
						(
							containerInnerSize.x 
							- (controlHeight * 3)
						) / 2 
						+ controlHeight * 2, 
						controlHeight * 2
					), // pos
					new Coords(controlHeight, controlHeight), // size
					">",
					null, // dataBindingForIsEnabled
					// click
					function ()
					{
						var venueCurrent = Globals.Instance.universe.venueCurrent;
						var camera = venueCurrent.camera;
						new Action_CameraMove([0 - cameraSpeed, 0]).perform
						(
							camera
						);
					}
				),
			]
		);

		return returnValue;
	}

	ControlBuilder.worldDetail = function()
	{
		var universe = Globals.Instance.universe;
		var world = universe.world;

		var containerSize = Globals.Instance.displayHelper.viewSize.clone();
		var controlHeight = containerSize.y / 12;
		var margin = 10;

		var returnValue = new ControlContainer
		(
			"containerWorldDetail",
			ControlBuilder.ColorsForeAndBackDefault,
			new Coords(0, 0), // pos
			containerSize,
			// children
			[
				new ControlLabel
				(
					"labelProfileName",
					new Coords((containerSize.x - 100) / 2, 15), // pos
					new Coords(100, controlHeight), // size
					true, // isTextCentered
					new DataBinding(universe.profile.name)
				),
				new ControlLabel
				(
					"labelWorldName",
					new Coords((containerSize.x - 100) / 2, 30), // pos
					new Coords(100, controlHeight), // size
					true, // isTextCentered
					new DataBinding(world.name)
				),
				new ControlLabel
				(
					"labelStartDate",
					new Coords((containerSize.x - 100) / 2, 45), // pos
					new Coords(100, controlHeight), // size
					true, // isTextCentered
					new DataBinding
					(
						"Started:" 
						+ world.dateCreated.toStringTimestamp()
					)
				),
				new ControlLabel
				(
					"labelSavedDate",
					new Coords((containerSize.x - 100) / 2, 60), // pos
					new Coords(100, controlHeight), // size
					true, // isTextCentered
					new DataBinding
					(
						"Saved:" 
						+ world.dateSaved.toStringTimestamp()
					)
				),

				new ControlButton
				(
					"buttonStart",
					new Coords((containerSize.x - 100) / 2, 100), // pos
					new Coords(100, controlHeight), // size
					"Start",
					null, // dataBindingForIsEnabled
					// click
					function ()
					{
						var universe = Globals.Instance.universe;
						var venueNext = new VenueWorld
						(
							universe.world
						);
						venueNext = new VenueFader(venueNext);
						universe.venueNext = venueNext;
					}
				),

				new ControlButton
				(
					"buttonBack",
					new Coords(margin, margin), // pos
					new Coords(controlHeight, controlHeight), // size
					"<",
					null, // dataBindingForIsEnabled
					// click
					function ()
					{
						var venueNext = new VenueControls
						(
							ControlBuilder.profileDetail()
						);
						venueNext = new VenueFader(venueNext);
						var universe = Globals.Instance.universe;
						universe.venueNext = venueNext;
					}
				),	

				new ControlButton
				(
					"buttonDeleteWorld",
					new Coords(containerSize.x - margin - controlHeight, margin), // pos
					new Coords(controlHeight, controlHeight), // size
					"X",
					null, // dataBindingForIsEnabled
					// click
					function ()
					{
						var universe = Globals.Instance.universe;
						var profile = universe.profile;
						var world = universe.world;

						var controlConfirm = ControlBuilder.confirm
						(
							"Delete World \"" 
								+ world.name 
								+ "\"?",
							// confirm
							function()
							{
								var universe = Globals.Instance.universe;
								var profile = universe.profile;
								var world = universe.world;
								var worlds = profile.worlds;
								var worldIndex = worlds.indexOf(world);

								worlds.splice
								(
									worldIndex,
									1
								);
								universe.world = null;
								
								Globals.Instance.profileHelper.profileSave
								(
									profile
								);

								var venueNext = new VenueControls
								(
									ControlBuilder.profileDetail()
								);
								venueNext = new VenueFader(venueNext);
								universe.venueNext = venueNext;
							},
							// cancel
							function()
							{
								var venueNext = new VenueControls
								(
									ControlBuilder.worldDetail()
								);
								venueNext = new VenueFader(venueNext);
								var universe = Globals.Instance.universe;
								universe.venueNext = venueNext;
							}						
						);

						var venueNext = new VenueControls(controlConfirm);
						venueNext = new VenueFader(venueNext);

						universe.venueNext = venueNext;
					}
				),
			]
		);

		return returnValue;
	}	
}
