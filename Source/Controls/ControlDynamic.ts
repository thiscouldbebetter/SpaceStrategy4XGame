
class ControlDynamic<TBoundValue> extends ControlBase
{
	binding: DataBinding<any, TBoundValue>;
	boundValueToControl: (v: TBoundValue) => ControlBase;

	boundValuePrev: TBoundValue;
	child: ControlBase;
	drawLoc: Disposition;
	drawPos: Coords;
	mouseClickPos: Coords;
	mouseMovePos: Coords;

	constructor
	(
		name: string,
		pos: Coords,
		size: Coords,
		binding: DataBinding<any, TBoundValue>,
		boundValueToControl: (v: TBoundValue) => ControlBase
	)
	{
		super(name, pos, size, null); //fontHeightInPixels

		this.name = name;
		this.pos = pos;
		this.size = size;
		this.binding = binding;
		this.boundValueToControl = boundValueToControl;

		this.boundValuePrev = null;
		this.child = null;

		// Helper variables.

		this.drawPos = Coords.create();
		this.drawLoc = Disposition.fromPos(this.drawPos);
		this.mouseClickPos = Coords.create();
		this.mouseMovePos = Coords.create();
	}

	actionHandle
	(
		actionNameToHandle: string, universe: Universe
	): boolean
	{
		var wasActionHandled = false;
		if (this.child != null)
		{
			wasActionHandled = this.child.actionHandle
			(
				actionNameToHandle, universe
			);
		}
		return wasActionHandled;
	}

	childWithFocus(): ControlBase
	{
		return (this.child == null ? null : this.child.childWithFocus());
	}

	focusGain(): void
	{
		if (this.child != null && this.child.focusGain != null)
		{
			this.child.focusGain();
		}
	}

	focusLose(): void
	{
		if (this.child != null && this.child.focusLose != null)
		{
			this.child.focusLose();
		}
	}

	isEnabled(): boolean
	{
		return true;
	}

	mouseClick(mouseClickPos: Coords): boolean
	{
		var wasHandledByChild = false;
		if (this.child != null && this.child.mouseClick != null)
		{
			mouseClickPos = this.mouseClickPos.overwriteWith(mouseClickPos).subtract(this.pos);

			wasHandledByChild = this.child.mouseClick(mouseClickPos);
		}
		return wasHandledByChild;
	}

	mouseEnter(): void
	{
		if (this.child != null && this.child.mouseEnter != null)
		{
			this.child.mouseEnter();
		}
	}

	mouseExit(): void
	{
		if (this.child != null && this.child.mouseExit != null)
		{
			this.child.mouseExit();
		}
	}

	mouseMove(mouseMovePos: Coords)
	{
		var wasHandled = false;

		if (this.child != null && this.child.mouseMove != null)
		{
			var mouseMovePos =
				this.mouseMovePos.overwriteWith(mouseMovePos).subtract(this.pos);
			wasHandled = this.child.mouseMove(mouseMovePos);
		}

		return wasHandled;
	}

	// drawable

	draw
	(
		universe: Universe,
		display: Display,
		drawLoc: Disposition,
		style: ControlStyle
	): void
	{
		var boundValue = this.binding.get();
		if (boundValue != this.boundValuePrev)
		{
			this.boundValuePrev = boundValue;
			if (boundValue == null)
			{
				this.child = null;
			}
			else
			{
				var child = this.boundValueToControl(boundValue);
				this.child = child;
			}
		}

		if (this.child != null)
		{
			var drawLoc = this.drawLoc.overwriteWith(drawLoc);
			drawLoc.pos.add(this.pos);
			this.child.draw(universe, display, drawLoc, style);
		}
	}
}
