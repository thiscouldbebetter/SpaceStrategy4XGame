
function NumberHelper()
{}
{
	NumberHelper.wrapValueToRangeMinMax = function(value, min, max)
	{
		var range = max - min;

		while (value < min)
		{
			value += range;
		}
		while (value > max)
		{
			value -= range;
		}

		return value;
	}
}
