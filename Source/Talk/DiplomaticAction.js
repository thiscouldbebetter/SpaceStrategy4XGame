"use strict";
class DiplomaticAction {
    constructor(name, effect) {
        this.name = name;
        this.effect = effect;
    }
    static Instances() {
        if (DiplomaticAction._instances == null) {
            DiplomaticAction._instances = new DiplomaticAction_Instances();
        }
        return DiplomaticAction._instances;
    }
}
class DiplomaticAction_Instances {
    constructor() {
        this.War = new DiplomaticAction("Declare War on", (universe, factionActing, factionReceiving) => {
            var message;
            var relationshipStates = DiplomaticRelationship.States();
            var stateExisting = factionActing.relationshipByFactionName(factionReceiving.name).state;
            if (stateExisting == relationshipStates.War) {
                message =
                    "The "
                        + factionActing.name
                        + " are already at war with the "
                        + factionReceiving.name + ".";
            }
            else {
                var relationship = factionActing.relationshipByFactionName(factionReceiving.name);
                relationship.state = relationshipStates.War;
                relationship =
                    factionReceiving.relationshipByFactionName(factionActing.name);
                relationship.state = relationshipStates.War;
                message =
                    "The " + factionActing.name
                        + " have declared war on the "
                        + factionReceiving.name + ".";
            }
            alert(message);
        }),
            this.Peace = new DiplomaticAction("Offer Peace to", (universe, factionActing, factionReceiving) => {
                var world = universe.world;
                var message;
                var stateExisting = factionActing.relationshipByFactionName(factionReceiving.name).state;
                if (stateExisting == DiplomaticRelationship.States().Alliance) {
                    message =
                        "The " + factionReceiving.name
                            + " are already allied with the " + factionActing.name + ".";
                }
                else if (stateExisting == DiplomaticRelationship.States().Peace) {
                    message =
                        "The " + factionReceiving.name
                            + " are already at peace with the " + factionActing.name + ".";
                }
                else // if (stateExisting == DiplomaticRelationship.States().War)
                 {
                    var strengthOfEnemies = DiplomaticRelationship.strengthOfFactions(world, factionReceiving.enemies(world));
                    var strengthOfSelfAndAllies = DiplomaticRelationship.strengthOfFactions(world, factionReceiving.selfAndAllies(world));
                    var strengthOfAlliesMinusEnemies = strengthOfSelfAndAllies - strengthOfEnemies;
                    if (strengthOfAlliesMinusEnemies <= 0) {
                        var statePeace = DiplomaticRelationship.States().Peace;
                        var relationship = factionActing.relationshipsByFactionName.get(factionReceiving.name);
                        relationship.state = statePeace;
                        relationship =
                            factionReceiving.relationshipsByFactionName.get(factionActing.name);
                        relationship.state = statePeace;
                        message =
                            "The " + factionReceiving.name
                                + " have accepted a peace offer from the "
                                + factionActing.name + ".";
                    }
                    else {
                        message =
                            "The " + factionReceiving.name
                                + " have rejected a peace offer from the "
                                + factionActing.name + ".";
                    }
                }
                alert(message);
            });
        this.Alliance = new DiplomaticAction("Propose Alliance with", 
        // effect
        (universe, factionActing, factionReceiving) => {
            var world = universe.world;
            var message;
            var stateExisting = factionActing.relationshipsByFactionName.get(factionReceiving.name).state;
            var relationshipStates = DiplomaticRelationship.States();
            if (stateExisting == relationshipStates.Alliance) {
                message =
                    "The " + factionReceiving.name
                        + " are already allied with the "
                        + factionActing.name + ".";
            }
            else if (stateExisting == relationshipStates.War) {
                message =
                    "The " + factionReceiving.name
                        + " are currently at war with the "
                        + factionActing.name + ".";
            }
            else {
                var factions = [factionActing, factionReceiving];
                var doAlliesAndEnemiesOfFactionsClash = false;
                var enemiesOfEitherFaction = new Array();
                for (var f = 0; f < factions.length; f++) {
                    var factionThis = factions[f];
                    var factionOther = factions[1 - f];
                    var enemiesOfFactionThis = factionThis.enemies(world);
                    enemiesOfEitherFaction = enemiesOfEitherFaction.concat(enemiesOfFactionThis);
                    var alliesOfFactionOther = factionOther.allies(world);
                    var intersection = enemiesOfFactionThis.filter(x => alliesOfFactionOther.indexOf(x) >= 0);
                    if (intersection.length > 0) {
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
                if (doAlliesAndEnemiesOfFactionsClash == false) {
                    var factionsDeclaringWarOnActing = [];
                    var factionsDeclaringWarOnReceiving = [];
                    for (var i = 0; i < enemiesOfEitherFaction.length; i++) {
                        var enemy = enemiesOfEitherFaction[i];
                        if (factionActing.enemies(world).indexOf(enemy) == -1) {
                            factionsDeclaringWarOnActing.push(enemy);
                        }
                        if (factionReceiving.enemies(world).indexOf(enemy) == -1) {
                            factionsDeclaringWarOnReceiving.push(enemy);
                        }
                    }
                    var strengthOfNewEnemies = DiplomaticRelationship.strengthOfFactions(world, factionsDeclaringWarOnReceiving);
                    if (strengthOfNewEnemies >= factionActing.strength(world)) {
                        message =
                            "The "
                                + factionReceiving.name
                                + " have declined to join an alliance with the "
                                + factionActing.name + ".";
                    }
                    else {
                        var relationship = factionActing.relationshipsByFactionName.get(factionReceiving.name);
                        relationship.state = DiplomaticRelationship.States().Alliance;
                        relationship =
                            factionReceiving.relationshipsByFactionName.get(factionActing.name);
                        relationship.state = DiplomaticRelationship.States().Alliance;
                        message =
                            "The "
                                + factionReceiving.name
                                + " have joined an alliance with the "
                                + factionActing.name + ".";
                        if (factionsDeclaringWarOnActing.length > 0) {
                            message +=
                                "  Some enemies of the "
                                    + factionReceiving.name
                                    + " ("
                                    + factionsDeclaringWarOnActing.join(", ")
                                    + ") have declared war on the "
                                    + factionActing.name
                                    + ".";
                        }
                        if (factionsDeclaringWarOnReceiving.length > 0) {
                            message +=
                                "  Some enemies of the "
                                    + factionActing.name
                                    + " ("
                                    + factionsDeclaringWarOnReceiving.join(", ")
                                    + ") have declared war on the "
                                    + factionReceiving.name
                                    + ".";
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
}
