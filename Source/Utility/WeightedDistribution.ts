
class WeightedDistribution<T>
{
	items: Weighted<T>[];

	totalOfWeights: number;

	constructor(items: Weighted<T>[])
	{
		this.items = items;

		this.totalOfWeights = 0;
		this.items.forEach
		(
			x => this.totalOfWeights += x.weight
		);
	}

	valueRandom(): T
	{
		var returnValue: T;

		var randomNumber = Math.random();
		var randomNumberScaledToTotal =
			randomNumber * this.totalOfWeights;

		var sumOfWeightsSoFar = 0;
		for (var i = 0; i < this.items.length; i++)
		{
			var item = this.items[i];

			sumOfWeightsSoFar += item.weight;

			var isSelected =
				randomNumberScaledToTotal <= sumOfWeightsSoFar;
	
			if (isSelected)
			{
				returnValue = item.value;
				break;
			}
		}

		return returnValue;
	}
}

class Weighted<T>
{
	weight: number;
	value: T;

	constructor(weight: number, value: T)
	{
		this.weight = weight;
		this.value = value;
	}
}