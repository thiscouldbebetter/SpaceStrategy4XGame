
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
		function use(universe, actor, device, target)
		{
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
				new VisualRectangle(new Coords(10, 10), color.systemColor),
			])
		);

		return returnValue;
	}

	// instance methods

	Ship.prototype.faction = function(universe)
	{
		return (this.factionName == null ? null : universe.world.factions[this.factionName]);
	}

	Ship.prototype.id = function()
	{
		return this.factionName + this.name;
	}

	// controls

	Ship.prototype.controlBuild = function(universe, containerSize)
	{
		var margin = 10;
		var controlSpacing = 20;
		var buttonSize = new Coords
		(
			containerSize.x - margin * 2,
			15
		);
		var fontHeightInPixels = margin;

		var returnValue = new ControlContainer
		(
			"containerShip",
			new Coords(0, 0), // pos
			containerSize,
			// children
			[
				new ControlLabel
				(
					"labelShipAsSelection",
					new Coords(margin, margin),
					new Coords(containerSize.x, 0), // this.size
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
					function click(universe)
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
					function click(universe)
					{
						var venueCurrent = universe.venueCurrent;
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
					function click(universe)
					{
						alert("todo - repeat")
					}
				),

				new ControlLabel
				(
					"labelDevices",
					new Coords(margin, margin + controlSpacing * 4), // pos
					new Coords(containerSize.x, 0), // this.size
					false, // isTextCentered
					new DataBinding("Devices:")
				),

				new ControlList
				(
					"listDevices",
					new Coords(margin, margin + controlSpacing * 5), // pos
					new Coords(buttonSize.x, controlSpacing * 2), // size
					// dataBindingForItems
					new DataBinding(this.devices, null),
					"defn.name", // bindingExpressionForOptionText
					fontHeightInPixels,
					new DataBinding(this, "deviceSelected"), // dataBindingForItemSelected
					"defn.name" // bindingExpressionForItemValue
				),

				new ControlButton
				(
					"buttonDeviceUse",
					new Coords(margin, margin * 2 + controlSpacing * 7), // pos
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
