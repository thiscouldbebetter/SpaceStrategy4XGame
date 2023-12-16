
class Technology
{
	name: string;
	researchToLearn: number;
	namesOfPrerequisiteTechnologies: string[];
	namesOfBuildablesEnabled: string[];

	constructor
	(
		name: string,
		researchToLearn: number,
		namesOfPrerequisiteTechnologies: string[],
		namesOfBuildablesEnabled: string[]
	)
	{
		this.name = name;
		this.researchToLearn = researchToLearn;
		this.namesOfPrerequisiteTechnologies = namesOfPrerequisiteTechnologies;
		this.namesOfBuildablesEnabled = namesOfBuildablesEnabled;
	}

	buildablesEnabled(world: WorldExtended): BuildableDefn[]
	{
		var returnValues = new Array<BuildableDefn>();

		for (var i = 0; i < this.namesOfBuildablesEnabled.length; i++)
		{
			var buildableName = this.namesOfBuildablesEnabled[i];
			var buildableDefn = world.buildableDefnByName(buildableName);
			returnValues.push(buildableDefn);
		}

		return returnValues;
	}

	strategicValue(world: WorldExtended): number
	{
		var multiplier = 1; // todo
		return this.researchToLearn * multiplier;
	}
}
