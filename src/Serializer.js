
function Serializer(knownTypes)
{
	this.knownTypes = knownTypes;

	for (var i = 0; i < this.knownTypes.length; i++)
	{
		var knownType = this.knownTypes[i];
		this.knownTypes[knownType.name] = knownType;
	}
}

{
	// constants

	Serializer.TypeNamesBuiltIn = [ "Boolean", "Function", "Number", "String" ];

	// instance methods

	Serializer.prototype.deleteClassNameRecursively = function(objectToDeleteClassNameOn)
	{
		if (objectToDeleteClassNameOn == null)
		{
			return;
		}

		var className = objectToDeleteClassNameOn.constructor.name;
		if (this.knownTypes[className] != null)
		{
			delete objectToDeleteClassNameOn.className;

			for (var childPropertyName in objectToDeleteClassNameOn)
			{
				var childProperty = objectToDeleteClassNameOn[childPropertyName];
				this.deleteClassNameRecursively(childProperty);
			}
		}
		else if (className == "Array")
		{
			for (var i = 0; i < objectToDeleteClassNameOn.length; i++)
			{
				var element = objectToDeleteClassNameOn[i];
				this.deleteClassNameRecursively(element);
			}
		}
	}

	Serializer.prototype.deserialize = function(stringToDeserialize)
	{
		var objectDeserialized = JSON.parse(stringToDeserialize);

		this.setPrototypeRecursively(objectDeserialized);

		this.deleteClassNameRecursively(objectDeserialized);

		return objectDeserialized;
	}

	Serializer.prototype.serialize = function(objectToSerialize)
	{
		this.setClassNameRecursively(objectToSerialize);

		var returnValue = JSON.stringify(objectToSerialize);

		this.deleteClassNameRecursively(objectToSerialize);

		return returnValue;
	}

	Serializer.prototype.setClassNameRecursively = function(objectToSetClassNameOn)
	{
		if (objectToSetClassNameOn == null)
		{
			return;
		}

		var className = objectToSetClassNameOn.constructor.name;
		
		if (this.knownTypes[className] != null)
		{
			for (var childPropertyName in objectToSetClassNameOn)
			{
				var childProperty = objectToSetClassNameOn[childPropertyName];
				this.setClassNameRecursively(childProperty);
			}

			objectToSetClassNameOn.className = className;
		}
		else if (className == "Array")
		{
			for (var i = 0; i < objectToSetClassNameOn.length; i++)
			{
				var element = objectToSetClassNameOn[i];
				this.setClassNameRecursively(element);
			}
		}
		else if (Serializer.TypeNamesBuiltIn.indexOf(className) == -1)
		{
			throw "Unknown type!";
		}
	}

	Serializer.prototype.setPrototypeRecursively = function(objectToSetPrototypeOn)
	{
		if (objectToSetPrototypeOn == null)
		{
			return;
		}
		var className = objectToSetPrototypeOn.className;

		var typeOfObjectToSetPrototypeOn = this.knownTypes[className];

		if (typeOfObjectToSetPrototypeOn != null)
		{
			objectToSetPrototypeOn.__proto__ = typeOfObjectToSetPrototypeOn.prototype;
	
			for (var childPropertyName in objectToSetPrototypeOn)
			{
				var childProperty = objectToSetPrototypeOn[childPropertyName];
				this.setPrototypeRecursively(childProperty);
			}
		}
		else 
		{
			var typeName = objectToSetPrototypeOn.constructor.name;
			if (typeName == "Array")
			{
				for (var i = 0; i < objectToSetPrototypeOn.length; i++)
				{
					var element = objectToSetPrototypeOn[i];
					this.setPrototypeRecursively(element);
				}
			}
			else if (Serializer.TypeNamesBuiltIn.indexOf(typeName) == -1)
			{
				throw "Unknown type!";
			}
		}
	}
}
