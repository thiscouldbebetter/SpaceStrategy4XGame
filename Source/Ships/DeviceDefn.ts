
class DeviceDefn
{
	name: string;
	isActive: boolean;
	needsTarget: boolean;
	categoryNames: string[];
	initialize: any;
	updateForTurn: any;
	use: any;

	constructor
	(
		name: string,
		isActive: boolean,
		needsTarget: boolean,
		categoryNames: string[],
		initialize: any,
		updateForTurn: any,
		use: any
	)
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
