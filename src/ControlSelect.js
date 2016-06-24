
function ControlSelect
(
	name, 
	pos, 
	size, 
	dataBindingForValueSelected,
	dataBindingForOptions,
	bindingExpressionForOptionValues,
	bindingExpressionForOptionText,
	dataBindingForIsEnabled,
	numberOfItemsVisible
)
{
	this.name = name;
	this.pos = pos;
	this.size = size;
	this.dataBindingForValueSelected = dataBindingForValueSelected;
	this.dataBindingForOptions = dataBindingForOptions;
	this.bindingExpressionForOptionValues = bindingExpressionForOptionValues;
	this.bindingExpressionForOptionText = bindingExpressionForOptionText;
	this.dataBindingForIsEnabled = dataBindingForIsEnabled;
	this.numberOfItemsVisible = (numberOfItemsVisible == null ? 1 : numberOfItemsVisible);

	if (this.dataBindingForValueSelected == null)
	{
		this.dataBindingForValueSelected = new DataBinding(this, "_valueSelected");
	}

	var options = this.options();
	var numberOfOptions = (options == null ? 0 : options.length);
	this.indexOfFirstOptionVisible = 0;
	var scrollbarWidth = 12;
	this.scrollbar = new ControlScrollbar
	(
		name, 
		new Coords(this.size.x - scrollbarWidth, 0), // pos
		new Coords(scrollbarWidth, this.size.y), // size
		new DataBinding(0), // dataBindingForMin
		new DataBinding(numberOfOptions), // dataBindingForMax
		new DataBinding(0) // dataBindingForValue
	);
}

{
	ControlSelect.prototype.draw = function(pos)
	{
		if (this.numberOfItemsVisible == 1)
		{
			Globals.Instance.displayHelper.drawControlSelect(this, pos);
		}
		else
		{
			Globals.Instance.displayHelper.drawControlList(this, pos);	
		}
	}

	ControlSelect.prototype.isEnabled = Control.isEnabled;

	ControlSelect.prototype.optionSelected = function()
	{
		var returnValue = null;

		var options = this.options();

		if (options != null)
		{
			var valueSelected = this.dataBindingForValueSelected.get();
	
			for (var i = 0; i < options.length; i++)
			{
				var optionAsObject = options[i];
		
				var optionValue = DataBinding.get
				(
					optionAsObject, 
					this.bindingExpressionForOptionValues
				);
	
				if (optionValue == valueSelected)
				{
					returnValue = optionAsObject;
					break;
				}
			}
		}
	
		return returnValue;	
	}

	ControlSelect.prototype.options = function()
	{
		return this.dataBindingForOptions.get();
	}

	ControlSelect.prototype.mouseClick = function(clickPos, pos)
	{
		if (this.isEnabled() == false)
		{
			return;
		}
		
		if (this.numberOfItemsVisible == 1)
		{
			this.mouseClick1(clickPos, pos);
		}
		else
		{
			this.mouseClick2(clickPos, pos);
		}
		Globals.Instance.inputHelper.isMouseLeftPressed = false;
	}

	ControlSelect.prototype.mouseClick1 = function(clickPos, pos)
	{
		var options = this.options();

		var valueSelected = this.dataBindingForValueSelected.get();
		var optionSelected = this.optionSelected();

		if (optionSelected == null)
		{
			optionSelected = options[0];
		}
		else for (var i = 0; i < options.length; i++)
		{
			var optionAsObject = options[i];
			var optionValue = DataBinding.get
			(
				optionAsObject, 
				this.bindingExpressionForOptionValues
			);

			if (optionValue == valueSelected)
			{
				i++;
				if (i >= options.length) 
				{ 
					i = 0; 
				}
				optionSelected = options[i];

				break;
			}
		}

		valueSelected = DataBinding.get
		(
			optionSelected, this.bindingExpressionForOptionValues
		);

		this.dataBindingForValueSelected.set(valueSelected);
	}

	ControlSelect.prototype.mouseClick2 = function(clickPos, pos)
	{
		var itemSpacing = 12; // hack

		var offsetOfOptionClicked = clickPos.y - pos.y;
		var indexOfOptionClicked = 
			this.indexOfFirstOptionVisible 
			+ Math.floor
			(
				offsetOfOptionClicked 
				/ itemSpacing
			);

		var options = this.options();
		if (indexOfOptionClicked < options.length)
		{
			var optionClicked = options[indexOfOptionClicked];
			valueSelected = DataBinding.get
			(
				optionClicked, 
				this.bindingExpressionForOptionValues
			);
			this.dataBindingForValueSelected.set
			(
				valueSelected
			);
		}	

	}

	ControlSelect.prototype.valueSelected = function()
	{
		return this.dataBindingForValueSelected.get();
	}
}
