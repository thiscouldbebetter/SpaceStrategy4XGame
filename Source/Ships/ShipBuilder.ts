
class ShipBuilder
{
	itemHolderShip: ItemHolder;
	itemHolderShipyard: ItemHolder;
	statusMessage: string;

	constructor()
	{
		this.itemHolderShip = ItemHolder.create();
		this.itemHolderShipyard = ItemHolder.create();
		this.statusMessage = "todo";
	}

	// Controls.

	toControl
	(
		universe: Universe,
		size: Coords,
		venuePrev: Venue
	): ControlBase
	{
		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var margin = 8;
		var fontHeight = margin;
		var font = FontNameAndHeight.fromHeightInPixels(fontHeight);
		var buttonSize = Coords.fromXY(4, 2).multiplyScalar(fontHeight);
		var labelHeight = margin * 3;
		var columnWidth = margin * 10;
		var listSize = Coords.fromXY
		(
			(size.x - margin * 3) / 2,
			size.y - margin * 4 - buttonSize.y - fontHeight
		);

		var world = universe.world;

		var back = () =>
		{
			universe.venueTransitionTo(venuePrev);
		};

		var add = () =>
		{
			alert("todo - add");
		};

		var remove = () =>
		{
			alert("todo - remove");
		};

		var labelItemsAvailable = ControlLabel.from4Uncentered
		(
			Coords.fromXY(margin, margin), // pos
			Coords.fromXY(listSize.x, labelHeight), // size
			DataBinding.fromContext("ItemsAvailable:"),
			font
		);

		var listItemsAvailable = ControlList.from10
		(
			"listItemsAvailable",
			Coords.fromXY(margin, margin * 2), // pos
			listSize.clone(),
			DataBinding.fromContextAndGet
			(
				this.itemHolderShipyard,
				(c: ItemHolder) =>
					c.items //.filter(x => x.item().defnName != itemDefnNameCurrency);
			), // items
			DataBinding.fromGet
			(
				(c: Item) => c.toString(world)
			), // bindingForItemText
			font,
			new DataBinding
			(
				this.itemHolderShipyard,
				(c: ItemHolder) => c.itemSelected,
				(c: ItemHolder, v: Item) => c.itemSelected = v
			), // bindingForItemSelected
			DataBinding.fromGet( (c: Item) => c ), // bindingForItemValue
			DataBinding.fromTrue(), // isEnabled
			add // confirm
		);

		var labelShipItems = ControlLabel.from4Uncentered
		(
			Coords.fromXY(size.x - margin - listSize.x, margin), // pos
			Coords.fromXY(columnWidth, labelHeight), // size
			DataBinding.fromContext("Items to Build into Ship:"),
			font
		);

		var buttonAdd = ControlButton.from8
		(
			"buttonAdd",
			Coords.fromXY
			(
				size.x / 2 - buttonSize.x - margin / 2,
				size.y - margin - buttonSize.y
			), // pos
			buttonSize.clone(),
			"Add",
			font,
			true, // hasBorder
			DataBinding.fromTrue(), // isEnabled
			add // click
		);

		var listShipItems = ControlList.from10
		(
			"listShipItems",
			Coords.fromXY
			(
				size.x - margin - listSize.x,
				margin * 2
			), // pos
			listSize.clone(),
			DataBinding.fromContextAndGet
			(
				this.itemHolderShip,
				(c: ItemHolder) => 
					c.items //.filter(x => x.item().defnName != itemDefnNameCurrency);
			), // items
			DataBinding.fromGet
			(
				(c: Item) => c.toString(world)
			), // bindingForItemText
			font,
			new DataBinding
			(
				this.itemHolderShip,
				(c: ItemHolder) => c.itemSelected,
				(c: ItemHolder, v: Item) => c.itemSelected = v
			), // bindingForItemSelected
			DataBinding.fromGet( (c: Item) => c ), // bindingForItemValue
			DataBinding.fromTrue(), // isEnabled
			remove // confirm
		);

		var buttonRemove = ControlButton.from8
		(
			"buttonRemove",
			Coords.fromXY
			(
				size.x / 2 + margin / 2,
				size.y - margin - buttonSize.y
			), // pos
			buttonSize.clone(),
			"Remove",
			font,
			true, // hasBorder
			DataBinding.fromTrue(), // isEnabled
			remove // click
		);

		var infoStatus = ControlLabel.from4CenteredHorizontally
		(
			Coords.fromXY(size.x / 2, size.y - margin * 2 - buttonSize.y), // pos
			Coords.fromXY(size.x, fontHeight), // size
			DataBinding.fromContextAndGet(this, c => c.statusMessage),
			font
		);

		var buttonDone = ControlButton.from5
		(
			Coords.fromXY
			(
				size.x - margin - buttonSize.x,
				size.y - margin - buttonSize.y
			), // pos
			buttonSize.clone(),
			"Done",
			font,
			back // click
		);

		var returnValue = new ControlContainer
		(
			"containerShipBuilder",
			Coords.create(), // pos
			size.clone(),
			// children
			[
				labelItemsAvailable,
				listItemsAvailable,
				buttonAdd,
				labelShipItems,
				listShipItems,
				buttonRemove,
				infoStatus,
				buttonDone
			],

			[ new Action("Back", back) ],

			[ new ActionToInputsMapping( "Back", [ Input.Names().Escape ], true ) ],

		);

		return returnValue;
	}
}
