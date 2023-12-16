
class Notification2
{
	message: string;
	_jumpTo: () => void;

	constructor(message: string, jumpTo: () => void)
	{
		this.message = message;
		this._jumpTo = jumpTo;
	}

	jumpTo(): void
	{
		this._jumpTo();
	}

	toString(): string
	{
		var returnValue = this.message;
		return returnValue;
	}
}
