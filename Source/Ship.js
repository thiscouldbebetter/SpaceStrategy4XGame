
function Ship(name, defn, pos, factionName, devices)
{
	this.name = name;
	this.defn = defn;
	this.loc = new Location(pos);
	this.factionName = factionName;
	this.devices = devices;

	this.integrity = 10;
	this.energyThisTurn = 0;
	this.distancePerMove = 0;
	this.shieldingThisTurn = 0;
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
					null // bindingExpressionForItemValue
				),

				new ControlButton
				(
					"buttonDeviceUse",
					new Coords(margin, margin * 2 + controlSpacing * 7), // pos
					buttonSize,
					"Use Device",
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var venue = universe.venueCurrent;
						var starsystem = venue.starsystem;
						var ship = venue.selection;
						var device = ship.deviceSelected;
						var deviceDefn = device.defn;
						if (deviceDefn.needsTarget == true)
						{
							var projectile = new Projectile(ship);
							var cursor = new Cursor(projectile);
							venue.selection = cursor;
						}
						else
						{
							device.use(universe, starsystem, ship);
						}
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

	Ship.prototype.updateForTurn = function(universe, faction)
	{
		this.energyThisTurn = 0;
		this.distancePerMove = 0;
		this.shieldingThisTurn = 0;

		for (var i = 0; i < this.devices.length; i++)
		{
			var device = this.devices[i];
			device.updateForTurn(universe, this);
		}
	}
}
