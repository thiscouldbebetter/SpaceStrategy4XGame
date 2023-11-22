
class FactionDefn
{
	name: string;
	planetStartingTypeName: string;
	ability: FactionAbility;
	visual: VisualBase;

	constructor
	(
		name: string,
		planetStartingTypeName: string,
		ability: FactionAbility,
		visual: VisualBase
	)
	{
		this.name = name;
		this.planetStartingTypeName = planetStartingTypeName;
		this.ability = ability;
		this.visual = visual;
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

	static chooseRandomly(numberToChoose: number): FactionDefn[]
	{
		var factionsChosen = [];

		var factionsRemaining = FactionDefn.Instances().all();

		for (var i = 0; i < numberToChoose; i++)
		{
			var factionIndexRandom =
				Math.floor(Math.random() * factionsRemaining.length);
			var factionChosen = factionsRemaining[factionIndexRandom];

			factionsChosen.push(factionChosen);

			factionsRemaining.splice(factionsRemaining.indexOf(factionChosen), 1);
		}

		return factionsChosen;
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

		var fd = (name: string, pt: PlanetType, fa: FactionAbility, v: VisualBase) =>
			new FactionDefn(name, pt.name(), fa, v);

		var visualDefault = new VisualNone();

		this.Adaptable 		= fd("Adaptable", 		pt(pss.Large, pes.Primordial), 		fas.Adapt, 			visualDefault);
		this.Charming 		= fd("Charming", 		pt(pss.Large, pes.Special), 		fas.Charm, 			visualDefault);
		this.Clairvoyant 	= fd("Clairvoyant", 	pt(pss.Giant, pes.Chapel), 			fas.Clairvoyize, 	visualDefault);
		this.Cramming 		= fd("Cramming", 		pt(pss.Large, pes.Tycoon), 			fas.Cram, 			visualDefault);
		this.Disruptive 	= fd("Disruptive", 		pt(pss.Large, pes.Congenial), 		fas.Disrupt, 		visualDefault);
		this.Energetic 		= fd("Energetic", 		pt(pss.Large, pes.Chapel), 			fas.Energize, 		visualDefault);
		this.Enervating 	= fd("Enervating", 		pt(pss.Large, pes.Mineral), 		fas.Enervate, 		visualDefault);
		this.Farsighted 	= fd("Farsighted", 		pt(pss.Large, pes.Cathedral), 		fas.Farsee, 		visualDefault);
		this.Hermited 		= fd("Hermited", 		pt(pss.Giant, pes.Eden), 			fas.Hermitize, 		visualDefault);
		this.Inspired 		= fd("Inspired", 		pt(pss.Large, pes.Cathedral), 		fas.Inspire, 		visualDefault);
		this.Intractable	= fd("Intractable", 	pt(pss.Giant, pes.Special), 		fas.Intractablize, 	visualDefault);
		this.Invasive 		= fd("Invasive", 		pt(pss.Giant, pes.Supermineral), 	fas.Invade, 		visualDefault);
		this.Larcenous 		= fd("Larcenous", 		pt(pss.Giant, pes.Cathedral), 		fas.Larcenize, 		visualDefault);
		this.Manipulative 	= fd("Manipulative", 	pt(pss.Large, pes.Supermineral), 	fas.Manipulate, 	visualDefault);
		this.Nurturing 		= fd("Nurturing", 		pt(pss.Large, pes.Cornucopia), 		fas.Nurture, 		visualDefault);
		this.Prolific 		= fd("Prolific", 		pt(pss.Giant, pes.Tycoon), 			fas.Prolificate, 	visualDefault);
		this.Regenerative 	= fd("Regenerative", 	pt(pss.Giant, pes.Congenial), 		fas.Regenerate, 	visualDefault);
		this.Speedy 		= fd("Speedy", 			pt(pss.Medium, pes.Eden), 			fas.Speed, 			visualDefault);
		this.Telepathic 	= fd("Telepathic", 		pt(pss.Large, pes.Eden), 			fas.Telepathicize, 	visualDefault);
		this.Tough 			= fd("Tough", 			pt(pss.Giant, pes.Primordial), 		fas.Toughen, 		visualDefault);
		this.Xenophobic 	= fd("Xenophobic", 		pt(pss.Giant, pes.Mineral), 		fas.Xenophobicize, 	visualDefault);

		this._All = this.all();
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


class FactionAbility
{
	name: string;
	roundsToCharge: number;
	private _perform: ()=>void;

	roundLastUsed: number;

	constructor(name: string, roundsToCharge: number, perform: ()=>void)
	{
		this.name = name;
		this.roundsToCharge = roundsToCharge;
		this._perform = perform;

		this.roundLastUsed = 0;
	}

	private static _instances: FactionAbility_Instances;
	static Instances(): FactionAbility_Instances
	{
		if (FactionAbility._instances == null)
		{
			FactionAbility._instances = new FactionAbility_Instances();
		}
		return FactionAbility._instances;
	}

	isCharged(world: WorldExtended): boolean
	{
		return (this.roundsUntilCharged(world) == 0);
	}

	perform(world: WorldExtended): void
	{
		this._perform();

		this.roundLastUsed = world.roundsSoFar;
	}

	roundsUntilCharged(world: WorldExtended): number
	{
		var roundsChargingSoFar =
			world.roundsSoFar
			- this.roundLastUsed;

		var roundsRemainingToCharge =
			this.roundsToCharge - roundsChargingSoFar;

		if (roundsRemainingToCharge < 0)
		{
			roundsRemainingToCharge = 0;
		}
		return roundsRemainingToCharge;
	}

	toString(world: WorldExtended): string
	{
		return this.name + "(" + this.roundsUntilCharged(world) + " rounds to charge)";
	}
}

class FactionAbility_Instances
{
	Default: FactionAbility;

	Adapt: FactionAbility;
	Charm: FactionAbility;
	Clairvoyize: FactionAbility;
	Cram: FactionAbility;
	Disrupt: FactionAbility;
	Energize: FactionAbility;
	Enervate: FactionAbility;
	Farsee: FactionAbility;
	Hermitize: FactionAbility;
	Inspire: FactionAbility;
	Intractablize: FactionAbility;
	Invade: FactionAbility;
	Larcenize: FactionAbility;
	Manipulate: FactionAbility;
	Nurture: FactionAbility;
	Prolificate: FactionAbility;
	Regenerate: FactionAbility;
	Speed: FactionAbility;
	Telepathicize: FactionAbility;
	Toughen: FactionAbility;
	Xenophobicize: FactionAbility;

	_All: FactionAbility[];

	constructor()
	{
		var fa = (name: string, rtc: number, perform: ()=>void) =>
			new FactionAbility(name, rtc, perform);

		this.Default = fa("Default", 100, () => { alert("todo - faction ability - todo"); } );

		this.Adapt 			= fa("Adapt", 			null, 	() => { alert("todo - faction ability - Adapt"); } );
		this.Charm 			= fa("Charm", 			100, 	() => { alert("todo - faction ability - Charm"); } );
		this.Clairvoyize 	= fa("Clairvoyize", 	null, 	() => { alert("todo - faction ability - Clairvoyize"); } );
		this.Cram 			= fa("Cram", 			68, 	() => { alert("todo - faction ability - Cram"); } );
		this.Disrupt 		= fa("Disrupt", 		70, 	() => { alert("todo - faction ability - Disrupt"); } );
		this.Energize 		= fa("Energize", 		62, 	() => { alert("todo - faction ability - Energize"); } );
		this.Enervate 		= fa("Enervate", 		90, 	() => { alert("todo - faction ability - Enervate"); } );
		this.Farsee 		= fa("Farsee", 			null, 	() => { alert("todo - faction ability - Farsee"); } );
		this.Hermitize 		= fa("Hermitize", 		100, 	() => { alert("todo - faction ability - Hermitize"); } );
		this.Inspire 		= fa("Inspire", 		89, 	() => { alert("todo - faction ability - Inspire"); } );
		this.Intractablize 	= fa("Intractablize", 	66, 	() => { alert("todo - faction ability - Intractiblize"); } );
		this.Invade 		= fa("Invade", 			null, 	() => { alert("todo - faction ability - Invade"); } );
		this.Larcenize 		= fa("Larcenize", 		63, 	() => { alert("todo - faction ability - Larcenize"); } );
		this.Manipulate 	= fa("Manipulate", 		100, 	() => { alert("todo - faction ability - Manipulate"); } );
		this.Nurture 		= fa("Nurture", 		150, 	() => { alert("todo - faction ability - Nurture"); } );
		this.Prolificate 	= fa("Prolificate", 	72, 	() => { alert("todo - faction ability - Prolificate"); } );
		this.Regenerate 	= fa("Regenerate", 		60, 	() => { alert("todo - faction ability - Regenerate"); } );
		this.Speed 			= fa("Speed", 			null, 	() => { alert("todo - faction ability - Speed"); } );
		this.Telepathicize 	= fa("Telepathicize", 	null, 	() => { alert("todo - faction ability - Telepathicize"); } );
		this.Toughen 		= fa("Toughen", 		null, 	() => { alert("todo - faction ability - Toughen"); } );
		this.Xenophobicize 	= fa("Xenophobicize ", 	77, 	() => { alert("todo - faction ability - Xenophobicize"); } );


		this._All =
		[
			this.Default,

			this.Adapt,
			this.Charm,
			this.Clairvoyize,
			this.Cram,
			this.Disrupt,
			this.Energize,
			this.Enervate,
			this.Farsee,
			this.Hermitize,
			this.Inspire,
			this.Intractablize,
			this.Invade,
			this.Larcenize,
			this.Manipulate,
			this.Nurture,
			this.Prolificate,
			this.Regenerate,
			this.Speed,
			this.Telepathicize,
			this.Toughen,
			this.Xenophobicize,

		];
	}
}
