
function Ship(name, defn, pos, factionName)
{
	this.name = name;
	this.defn = defn;
	this.loc = new Location(pos);
	this.factionName = factionName;

	this.vel = new Coords(0, 0, 0);

	var deviceDefnDefault = new DeviceDefn
	(
		"DeviceDefn0",
		100, // range
		function (actor, device, target)
		{
			var universe = Globals.Instance.universe;
			var venueCurrent = universe.venueCurrent;

			var projectile = new Ship
			(
				"[projectile]",
				Ship.bodyDefnBuild(Color.Instances.Yellow),
				actor.loc.pos.clone(),
				actor.factionName
			);

			projectile.activity = new Activity
			(
				"MoveToTarget",
				[ target ]
			);

			venueCurrent.model().bodies.push(projectile);
		}
	);

	this.devices = 
	[
		new Device(deviceDefnDefault),
		new Device(deviceDefnDefault),
		new Device(deviceDefnDefault),
	];

	this.movesThisTurn = 0;
}

{
	// static methods

	Ship.bodyDefnBuild = function(color)
	{
		var returnValue = new BodyDefn
		(
			"Ship", 
			new Coords(10, 10), // size
			new VisualGroup
			([
				new VisualRectangle(color, new Coords(10, 10)),
			])
		);

		return returnValue;
	}

	// instance methods

	Ship.prototype.faction = function()
	{
		return (this.factionName == null ? null : Globals.Instance.universe.world.factions[this.factionName]);
	}

	Ship.prototype.id = function()
	{
		return this.factionName + this.name;
	}

	// controls

	Ship.prototype.controlBuild_Selection = function()
	{
		var viewSize = Globals.Instance.display.sizeInPixels;
		var containerSize = new Coords(100, viewSize.y);

		var margin = 10;
		var controlSpacing = 20;
		var buttonSize = new Coords
		(
			containerSize.x - margin * 4,
			15
		);

		var returnValue = new ControlContainer
		(
			"containerShip",
			new Coords(viewSize.x - margin - containerSize.x, margin), // pos
			new Coords(containerSize.x - margin * 2, containerSize.y - margin * 4),
			// children
			[
				new ControlLabel
				(	
					"labelShipAsSelection",
					new Coords(margin, margin),
					new Coords(0, 0), // this.size
					false, // isTextCentered
					new DataBinding(this.name)
				),

				new ControlButton
				(
					"buttonView",
					new Coords(margin, margin + controlSpacing), // pos
					buttonSize, // size
					"View",
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					// click
					function ()
					{
						alert("todo - view")
					}
				),

				new ControlButton
				(
					"buttonMove",
					new Coords(margin, margin + controlSpacing * 2), // pos
					buttonSize,
					"Move",
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					function ()
					{
						var venueCurrent = Globals.Instance.universe.venueCurrent;
						venueCurrent.cursorBuild();
					}
				),
				new ControlButton
				(
					"buttonRepeat",
					new Coords(margin, margin + controlSpacing * 3), // pos
					buttonSize,
					"Repeat",
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					// click
					function ()
					{
						alert("todo - repeat")
					}
				),

				new ControlLabel
				(	
					"labelDevices",
					new Coords(margin, margin + controlSpacing * 4), // pos
					new Coords(0, 0), // this.size
					false, // isTextCentered
					new DataBinding("Devices:")
				),

				new ControlSelect
				(
					"listDevices",
					new Coords(margin, margin + controlSpacing * 5), // pos
					new Coords(buttonSize.x, controlSpacing * 4), // size
					// dataBindingForValueSelected
					new DataBinding(Globals.Instance.universe.venueCurrent.selection, "deviceSelected"),
					// dataBindingForOptions
					new DataBinding
					(
						this.devices,
						null
					),
					null, // bindingExpressionForOptionValues
					"defn.name", // bindingExpressionForOptionText
					fontHeightInPixels,
					true, // hasBorder
					4 // numberOfItemsVisible
				),

				new ControlButton
				(
					"buttonDeviceUse",
					new Coords(margin, margin + controlSpacing * 10), // pos
					buttonSize,
					"Use Device",
					true, // hasBorder
					true, // isEnabled
					// click
					function ()
					{
						alert("todo - use device")
					}
				),


			]
		);

		return returnValue;
	}

	// diplomacy

	Ship.prototype.strength = function()
	{
		return 1;
	}

	// turns

	Ship.prototype.updateForTurn = function()
	{
		// todo
	}
}
