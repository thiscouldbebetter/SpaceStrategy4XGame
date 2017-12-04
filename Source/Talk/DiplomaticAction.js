
function DiplomaticAction(name, effect)
{
	this.name = name;
	this.effect = effect;
}

{
	function DiplomaticAction_Instances()
	{
		this.War = new DiplomaticAction
		(
			"Declare War on",
			function(universe, factionActing, factionReceiving) 
			{
				var message;

				var stateExisting = factionActing.relationships[factionReceiving.name].state;
				if (stateExisting == Relationship.States.War)
				{
					message = 
						"The " 
						+ factionActing.name 
						+ " are already at war with the " 
						+ factionReceiving.name + ".";
				}
				else
				{
					var relationship = factionActing.relationships[factionReceiving.name];
					relationship.state = Relationship.States.War;
					relationship = factionReceiving.relationships[factionActing.name];
					relationship.state = Relationship.States.War;
					message = 
						"The " + factionActing.name 
						+ " have declared war on the " 
						+ factionReceiving.name + ".";
				}


				alert(message);
			}
		),

		this.Peace = new DiplomaticAction
		(
			"Offer Peace to", 
			function(universe, factionActing, factionReceiving) 
			{
				var message;

				var stateExisting = factionActing.relationships[factionReceiving.name].state;
				if (stateExisting == Relationship.States.Alliance)
				{
					message = 
						"The " + factionReceiving.name 
						+ " are already allied with the " + factionActing.name + ".";
				}
				else if (stateExisting == Relationship.States.Peace)
				{
					message = 
						"The " + factionReceiving.name 
						+ " are already at peace with the " + factionActing.name + ".";
				}
				else // if (stateExisting == Relationship.States.War)
				{
					var strengthOfEnemies = DiplomaticRelationship.strengthOfFactions
					(
						factionReceiving.enemies()
					);

					var strengthOfSelfAndAllies = DiplomaticRelationship.strengthOfFactions
					(
						factionReceiving.selfAndAllies()
					);

					var strengthOfAlliesMinusEnemies = 
						strengthOfSelfAndAllies - strengthOfEnemies;

					if (strengthOfAlliesMinusEnemies <= 0)
					{
						var relationship = factionActing.relationships[factionReceiving.name];
						relationship.state = Relationship.States.Peace;
						relationship = factionReceiving.relationships[factionActing.name];
						relationship.state = Relationship.States.Peace;
						message = 
							"The " + factionReceiving.name
							+ " have accepted a peace offer from the " 
							+ factionActing.name + ".";
					}
					else
					{
						message = 
							"The " + factionReceiving.name 
							+ " have rejected a peace offer from the " 
							+ factionActing.name + ".";
					}
				}

				alert(message);
			}
		);

		this.Alliance = new DiplomaticAction
		(
			"Propose Alliance with",
			// effect
			function(universe, factionActing, factionReceiving) 
			{
				var message;

				var stateExisting = factionActing.relationships[factionReceiving.name].state;
				if (stateExisting == Relationship.States.Alliance)
				{
					message = 
						"The " + factionReceiving.name 
						+ " are already allied with the " 
						+ factionActing.name + ".";
				}
				else if (stateExisting == Relationship.States.War)
				{
					message = 
						"The " + factionReceiving.name 
						+ " are currently at war with the " 
						+ factionActing.name + ".";
				}
				else
				{
					var factions = [ factionActing, factionReceiving ];
					var doAlliesAndEnemiesOfFactionsClash = false;

					var enemiesOfEitherFaction = [];

					for (var f = 0; f < factions.length; f++)
					{
						var factionThis = factions[f];
						var factionOther = factions[1 - f];

						var enemiesOfFactionThis = factionThis.enemies();
						enemiesOfEitherFaction = enemiesOfEitherFaction.concat
						(
							enemiesOfFactionThis
						);
						var alliesOfFactionOther = factionOther.allies();
						var intersection = enemiesOfFactionThis.intersectionWith
						(
							alliesOfFactionOther
						);

						if (intersection.length > 0)
						{
							doAlliesAndEnemiesOfFactionsClash = true;

							message = 
								"An alliance between the " 
								+ factionThis.name 
								+ " and the " 
								+ factionOther.name
								+ " is impossible because the " 
								+ factionThis.name 
								+ " are at war with some allies of the "
								+ factionOther.name
								+ " ("
								+ intersection.join(", ")
								+ ").";
						}
					}

					if (doAlliesAndEnemiesOfFactionsClash == false)
					{
						var factionsDeclaringWarOnActing = [];
						var factionsDeclaringWarOnReceiving = [];
						for (var i = 0; i < enemiesOfEitherFaction.length; i++)
						{
							var enemy = enemiesOfEitherFaction[i];
							if (factionActing.enemies().indexOf(enemy) == -1)
							{
								factionsDeclaringWarOnActing.push(enemy);
							}
							if (factionReceiving.enemies().indexOf() == -1)
							{
								factionsDeclaringWarOnReceiving.push(enemy);
							}
						}

						var strengthOfNewEnemies = DiplomaticRelationship.strengthOfFactions
						(
							factionsDeclaringWarOnReceiving
						);
						if (strengthOfNewEnemies >= factionActing.strength)
						{
							message = 
								"The " 
								+ factionReceiving.name 
								+ " have declined to join an alliance with the " 
								+ factionActing.name + ".";
						}
						else
						{
							var relationship = factionActing.relationships[factionReceiving.name]
							relationship.state = Relationship.States.Alliance;
							relationship = factionReceiving.relationships[factionActing.name];
							relationship.state = Relationship.States.Alliance;

							message = 
								"The " 
								+ factionReceiving.name 
								+ " have joined an alliance with the " 
								+ factionActing.name + ".";

							if (factionsDeclaringWarOnActing.length > 0)
							{
								message += 
									"  Some enemies of the " 
									+ factionReceiving.name
									+ " (" 
									+ factionsDeclaringWarOnActing.join(", ") 
									+ ") have declared war on the "
									+ factionActing.name 
									+ "."
							}

							if (factionsDeclaringWarOnReceiving.length > 0)
							{
								message += 
									"  Some enemies of the " 
									+ factionActing.name
									+ " (" 
									+ factionsDeclaringWarOnReceiving.join(", ") 
									+ ") have declared war on the "
									+ factionReceiving.name 
									+ "."
							}

						} // end if strengthOfNewEnemies >= factionActing.strength else

					} // end if doAlliesAndEnemiesOfFactionsClash

				} // end if stateExisting

				alert(message);

			} // end effect
		); // end new DiplomaticAction

		this._All = 
		[
			this.Peace,
			this.Alliance,
			this.War,
		];
	}

	DiplomaticAction.Instances = new DiplomaticAction_Instances();
}
