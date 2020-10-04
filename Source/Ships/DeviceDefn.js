
class DeviceDefn
{
	constructor(name, isActive, needsTarget, categoryNames, initialize, updateForTurn, use)
	{
		this.name = name;
		this.isActive = isActive;
		this.needsTarget = needsTarget;
		this.categoryNames = categoryNames;
		this.initialize = initialize;
		this.updateForTurn = updateForTurn;
		this.use = use;
	}
}
