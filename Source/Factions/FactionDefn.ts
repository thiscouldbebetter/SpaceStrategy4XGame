
class FactionDefn
{
	name: string;
	planetStartingTypeName: string;
	ability: FactionAbility;
	visual: VisualBase;

	canBuildOnBarrenTerrain: boolean;
	ignoresPlanetarySurfaceShields: boolean;
	shipHullIntegrityMultiplier: number;
	starlaneTravelSpeedMultiplier: number;

	constructor
	(
		name: string,
		planetStartingTypeName: string,
		ability: FactionAbility,
		visual: VisualBase,
		canBuildOnBarrenTerrain: boolean,
		ignoresPlanetarySurfaceShields: boolean,
		shipHullIntegrityMultiplier: number,
		starlaneTravelSpeedMultiplier: number
	)
	{
		this.name = name;
		this.planetStartingTypeName = planetStartingTypeName;
		this.ability = ability;
		this.visual = visual;

		this.canBuildOnBarrenTerrain = canBuildOnBarrenTerrain || false;
		this.ignoresPlanetarySurfaceShields = ignoresPlanetarySurfaceShields || false;
		this.shipHullIntegrityMultiplier = shipHullIntegrityMultiplier || 1;
		this.starlaneTravelSpeedMultiplier = starlaneTravelSpeedMultiplier || 1;
	}

	private static _instances: FactionDefn_Instances;
	static Instances(): FactionDefn_Instances
	{
		if (FactionDefn._instances == null)
		{
			FactionDefn._instances = new FactionDefn_Instances();
		}
		return FactionDefn._instances;
	}

	static byName(name: string): FactionDefn
	{
		return FactionDefn.Instances().byName(name);
	}

	canBuildOnBarrenTerrainSet(): FactionDefn
	{
		this.canBuildOnBarrenTerrain = true;
		return this;
	}

	ignoresPlanetarySurfaceShieldsSet(): FactionDefn
	{
		this.ignoresPlanetarySurfaceShields = true;
		return this;
	}

	shipHullIntegrityMultiplierSet(value: number): FactionDefn
	{
		this.shipHullIntegrityMultiplier = value;
		return this;
	}

	starlaneTravelSpeedMultiplierSet(value: number): FactionDefn
	{
		this.starlaneTravelSpeedMultiplier = value;
		return this;
	}

}

class FactionDefn_Instances
{
	Adaptable: FactionDefn;
	Charming: FactionDefn;
	Clairvoyant: FactionDefn;
	Cramming: FactionDefn;
	Disruptive: FactionDefn;
	Energetic: FactionDefn;
	Enervating: FactionDefn;
	Farsighted: FactionDefn;
	Hermited: FactionDefn;
	Inspired: FactionDefn;
	Intractable: FactionDefn;
	Invasive: FactionDefn;
	Larcenous: FactionDefn;
	Manipulative: FactionDefn;
	Nurturing: FactionDefn;
	Prolific: FactionDefn;
	Regenerative: FactionDefn;
	Speedy: FactionDefn;
	Telepathic: FactionDefn;
	Tough: FactionDefn;
	Xenophobic: FactionDefn;

	_All: FactionDefn[];

	constructor()
	{
		var fas = FactionAbility.Instances();

		var pss = PlanetSize.Instances();
		var pes = PlanetEnvironment.Instances();

		var pt = (size: PlanetSize, env: PlanetEnvironment) =>
			PlanetType.byName(size.name + " " + env.name);

		var fd =
		(
			name: string,
			planetType: PlanetType,
			factionAbility: FactionAbility,
			visual: VisualBase
		) =>
		{
			return new FactionDefn
			(
				name,
				planetType.name(),
				factionAbility,
				visual,
				null, // canBuildOnBarrenTerrain
				null, // ignoresPlanetarySurfaceShields
				null, // shipHullIntegrityMultiplier
				null // starlaneTravelSpeedMultiplier
			);
		}

		var visualDefault = new VisualNone();

		var factionNames = FactionNames.Instance()._All;

		this.Adaptable 		= fd(factionNames[0], 	pt(pss.Large, pes.Primordial), 		fas.Adapt, 			visualDefault).canBuildOnBarrenTerrainSet();
		this.Charming 		= fd(factionNames[1], 	pt(pss.Large, pes.Special), 		fas.Charm, 			visualDefault);
		this.Clairvoyant 	= fd(factionNames[2], 	pt(pss.Giant, pes.Chapel), 			fas.Clairvoyize, 	visualDefault);
		this.Cramming 		= fd(factionNames[3], 	pt(pss.Large, pes.Tycoon), 			fas.Cram, 			visualDefault);
		this.Disruptive 	= fd(factionNames[4], 	pt(pss.Large, pes.Congenial), 		fas.Disrupt, 		visualDefault);
		this.Energetic 		= fd(factionNames[5], 	pt(pss.Large, pes.Chapel), 			fas.Energize, 		visualDefault);
		this.Enervating 	= fd(factionNames[6], 	pt(pss.Large, pes.Mineral), 		fas.Enervate, 		visualDefault);
		this.Farsighted 	= fd(factionNames[7], 	pt(pss.Large, pes.Cathedral), 		fas.Farsee, 		visualDefault);
		this.Hermited 		= fd(factionNames[8], 	pt(pss.Giant, pes.Eden), 			fas.Hermitize, 		visualDefault);
		this.Inspired 		= fd(factionNames[9], 	pt(pss.Large, pes.Cathedral), 		fas.Inspire, 		visualDefault);
		this.Intractable	= fd(factionNames[10], 	pt(pss.Giant, pes.Special), 		fas.Intractablize, 	visualDefault);
		this.Invasive 		= fd(factionNames[11], 	pt(pss.Giant, pes.Supermineral), 	fas.Invade, 		visualDefault).ignoresPlanetarySurfaceShieldsSet();
		this.Larcenous 		= fd(factionNames[12], 	pt(pss.Giant, pes.Cathedral), 		fas.Larcenize, 		visualDefault);
		this.Manipulative 	= fd(factionNames[13], 	pt(pss.Large, pes.Supermineral), 	fas.Manipulate, 	visualDefault);
		this.Nurturing 		= fd(factionNames[14], 	pt(pss.Large, pes.Cornucopia), 		fas.Nurture, 		visualDefault);
		this.Prolific 		= fd(factionNames[15], 	pt(pss.Giant, pes.Tycoon), 			fas.Prolificate, 	visualDefault);
		this.Regenerative 	= fd(factionNames[16], 	pt(pss.Giant, pes.Congenial), 		fas.Regenerate, 	visualDefault);
		this.Speedy 		= fd(factionNames[17], 	pt(pss.Medium, pes.Eden), 			fas.Speed, 			visualDefault).starlaneTravelSpeedMultiplierSet(2);
		this.Telepathic 	= fd(factionNames[18], 	pt(pss.Large, pes.Eden), 			fas.Telepathicize, 	visualDefault);
		this.Tough 			= fd(factionNames[19], 	pt(pss.Giant, pes.Primordial), 		fas.Toughen, 		visualDefault).shipHullIntegrityMultiplierSet(2);
		this.Xenophobic 	= fd(factionNames[20], 	pt(pss.Giant, pes.Mineral), 		fas.Xenophobicize, 	visualDefault);

		this._All = this.all();
		this._All.sort( (a, b) => a.name >= b.name ? 1 : -1);
	}

	all(): FactionDefn[]
	{
		var factionsAll =
		[
			this.Adaptable,
			this.Charming,
			this.Clairvoyant,
			this.Cramming,
			this.Disruptive,
			this.Energetic,
			this.Enervating,
			this.Farsighted,
			this.Hermited,
			this.Inspired,
			this.Intractable,
			this.Invasive,
			this.Larcenous,
			this.Manipulative,
			this.Prolific,
			this.Regenerative,
			this.Nurturing,
			this.Speedy,
			this.Telepathic,
			this.Tough,
			this.Xenophobic
		];

		return factionsAll;
	}

	byName(name: string): FactionDefn
	{
		return this._All.find(x => x.name == name);
	}
}
