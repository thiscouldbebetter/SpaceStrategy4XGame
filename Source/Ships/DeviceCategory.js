
function DeviceCategory(name)
{
	this.name = name;
}
{
	DeviceCategory.Instances = new DeviceCategory_Instances();

	function DeviceCategory_Instances()
	{
		this.Drive = new DeviceCategory("Drive");
		this.Generator = new DeviceCategory("Generator");
		this.Shield = new DeviceCategory("Shield");
		this.Special = new DeviceCategory("Special");
		this.Weapon = new DeviceCategory("Weapon");

		this._All = 
		[
			this.Drive,
			this.Generator,
			this.Shield,
			this.Special,
			this.Weapon,
		].addLookups("name");
	}
}