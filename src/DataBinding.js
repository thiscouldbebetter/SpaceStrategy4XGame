
function DataBinding(context, bindingExpression)
{
	this.context = context;
	this.bindingExpression = bindingExpression;
}

{
	DataBinding.get = function(context, bindingExpression)
	{
		var expressionValue = context;

		if (bindingExpression != null)
		{
			var bindingExpressionHierarchy = bindingExpression.split(".");
			
			for (var i = 0; i < bindingExpressionHierarchy.length; i++)
			{
				var bindingExpressionLevel = bindingExpressionHierarchy[i]; 
				var expressionValue = context[bindingExpressionLevel];

				if (expressionValue == null)
				{
					break;
				}
				else
				{
					if (expressionValue.constructor.name == "Function")
					{
						expressionValue = expressionValue.call(context);	
					}

					context = expressionValue;
				}
			}
		}

		return expressionValue;
	}

	DataBinding.set = function(context, bindingExpression, valueToSet)
	{
		var contextCurrent = context;

		if (bindingExpression != null)
		{
			var bindingExpressionHierarchy = bindingExpression.split(".");
			var hierarchySizeMinusOne = bindingExpressionHierarchy.length - 1;

			for (var i = 0; i < hierarchySizeMinusOne; i++)
			{
				var bindingExpressionLevel = bindingExpressionHierarchy[i]; 
				contextCurrent = contextCurrent[bindingExpressionLevel];

				if (contextCurrent == null)
				{
					break;
				}
				else
				{
					if (contextCurrent.constructor.name == "Function")
					{
						contextCurrent = contextCurrent.call(context);	
					}
				}
			}

			var bindingExpressionLevelLast = bindingExpressionHierarchy[hierarchySizeMinusOne];
			contextCurrent[bindingExpressionLevelLast] = valueToSet;
		}
	}

	// instance methods

	DataBinding.prototype.get = function()
	{
		return DataBinding.get(this.context, this.bindingExpression);
	}

	DataBinding.prototype.set = function(valueToSet)
	{
		if (this.bindingExpression == null)
		{
			this.context = valueToSet;
		}
		else
		{
			DataBinding.set(this.context, this.bindingExpression, valueToSet);
		}
	}
}
