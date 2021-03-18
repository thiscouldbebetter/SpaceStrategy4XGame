
class VenueFaderExtended
{
	constructor(venueFaderInner)
	{
		this.venueFaderInner = venueFaderInner;
	}

	model()
	{
		return this.venueCurrent().model();
	}
}
