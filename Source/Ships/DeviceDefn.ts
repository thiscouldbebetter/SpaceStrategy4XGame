
class DeviceDefn
{
	name: string;
	isActive: boolean;
	needsTarget: boolean;
	categoryNames: string[];
	initialize: (u: Universe, w: World, p: Place, e: Entity, d: Device)=>void;
	updateForTurn: (u: Universe, w: World, p: Place, e: Entity, d: Device)=>void;
	use: (u: Universe, w: World, p: Place, e: Entity, d: Device)=>void;

	constructor
	(
		name: string,
		isActive: boolean,
		needsTarget: boolean,
		categoryNames: string[],
		initialize: (u: Universe, w: World, p: Place, e: Entity, d: Device)=>void,
		updateForTurn: (u: Universe, w: World, p: Place, e: Entity, d: Device)=>void,
		use: (u: Universe, w: World, p: Place, e: Entity, d: Device)=>void
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
