
class Device
{
	defn: DeviceDefn;

	energyThisTurn: number;
	isActive: boolean;
	shieldingThisTurn: number;
	usesThisTurn: number;

	projectile: Ship;

	constructor(defn: DeviceDefn)
	{
		this.defn = defn;
	}

	updateForTurn(universe: Universe, actor: Actor)
	{
		this.defn.updateForTurn(universe, actor, this);
	}

	use(universe: Universe, place: any, actor: Entity)
	{
		this.defn.use(universe, place, actor, this);
	}
}
