"use strict";
class FactionAbility {
    constructor(name, roundsToCharge, perform, description) {
        this.name = name;
        this.roundsToCharge = roundsToCharge;
        this._perform = perform;
        this.description = description;
        this.roundLastUsed = 0;
    }
    static Instances() {
        if (FactionAbility._instances == null) {
            FactionAbility._instances = new FactionAbility_Instances();
        }
        return FactionAbility._instances;
    }
    isCharged(world) {
        return (this.roundsUntilCharged(world) == 0);
    }
    perform(uwpe) {
        var world = uwpe.world;
        this._perform(uwpe);
        this.roundLastUsed = world.roundsSoFar;
    }
    roundsUntilCharged(world) {
        var roundsChargingSoFar = world.roundsSoFar
            - this.roundLastUsed;
        var roundsRemainingToCharge = this.roundsToCharge - roundsChargingSoFar;
        if (roundsRemainingToCharge < 0) {
            roundsRemainingToCharge = 0;
        }
        return roundsRemainingToCharge;
    }
    toString(world) {
        return this.name + "(" + this.roundsUntilCharged(world) + " rounds to charge)";
    }
}
class FactionAbility_Instances {
    constructor() {
        var fa = (name, rtc, perform, descr) => new FactionAbility(name, rtc, perform, descr);
        this.Adapt = fa("Adapt", null, null, "Can use black planet surface cells.");
        this.Charm = fa("Charm", 100, this.charm, "Force other factions to make peace.");
        this.Clairvoyize = fa("Clairvoyize", null, this.clairvoyize, "Discover all other factions' home starsystems.");
        this.Cram = fa("Cram", 68, this.cram, "Double industry on all planets for one round.");
        this.Disrupt = fa("Disrupt", 70, this.disrupt, "Bump all ships in starlanes back to start.");
        this.Energize = fa("Energize", 62, this.energize, "Double power of all ships for one round.");
        this.Enervate = fa("Enervate", 90, this.enervate, "Drain power of all others' ships for one round.");
        this.Farsee = fa("Farsee", null, this.farsee, "Discover all starlanes.");
        this.Hermitize = fa("Hermitize", 100, this.hermitize, "Block all starlanes into occupied starsystems.");
        this.Inspire = fa("Inspire", 89, this.inspire, "Discover the currently researched technology.");
        this.Intractablize = fa("Intractablize", 66, this.intractablize, "Make all planets invincible for one round.");
        this.Invade = fa("Invade", null, null, "Ignore planetary surface shields.");
        this.Larcenize = fa("Larcenize", 63, this.larcenize, "Steal a technology known to two other factions.");
        this.Manipulate = fa("Manipulate", 100, this.manipulate, "Make others dislike enemy factions.");
        this.Nurture = fa("Nurture", 150, this.nurture, "Convert least populated planet to rich type.");
        this.Prolificate = fa("Prolificate", 72, this.prolificate, "Increase the max population of all planets.");
        this.Regenerate = fa("Regenerate", 60, this.regenerate, "Repair all damage to all ships.");
        this.Speed = fa("Speed", null, null, "Move through starlanes twice as fast.");
        this.Telepathicize = fa("Telepathicize", null, this.telepathicize, "Establish diplomacy with all other factions.");
        this.Toughen = fa("Toughen", null, null, "Ship hulls can withstand twice as much damage.");
        this.Xenophobicize = fa("Xenophobicize ", 77, this.xenophobicize, "Warp others' ships out of occupied starsystems.");
        this._All =
            [
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
    charm(uwpe) {
        var world = uwpe.world;
        var factionSelf = world.factionCurrent();
        var factionSelfDiplomacy = factionSelf.diplomacy;
        var relationships = factionSelfDiplomacy.relationships;
        var relationshipStates = DiplomaticRelationshipState.Instances();
        for (var i = 0; i < relationships.length; i++) {
            var relationship = relationships[i];
            var relationshipState = relationship.state;
            if (relationshipState == relationshipStates.War) {
                relationship.state = relationshipStates.Peace;
                // todo - Notifications?
            }
        }
    }
    clairvoyize(uwpe) {
        var world = uwpe.world;
        var factionSelf = world.factionCurrent();
        var factionSelfKnowledge = factionSelf.knowledge;
        var factions = world.factions;
        for (var i = 0; i < factions.length; i++) {
            var faction = factions[i];
            if (faction != factionSelf) {
                var factionHomeStarsystem = faction.starsystemHome(world);
                factionSelfKnowledge.starsystemAdd(factionHomeStarsystem, world);
            }
        }
    }
    cram(uwpe) {
        var world = uwpe.world;
        var factionSelf = world.factionCurrent();
        var planets = factionSelf.planets;
        for (var i = 0; i < planets.length; i++) {
            var planet = planets[i];
            var industryThisRound = planet.industryThisRound(uwpe.universe, world);
            planet.industryThisRoundAdd(industryThisRound);
        }
    }
    disrupt(uwpe) {
        var world = uwpe.world;
        var starCluster = world.starCluster;
        var links = starCluster.links;
        for (var i = 0; i < links.length; i++) {
            var link = links[i];
            var shipsInLink = link.ships;
            for (var s = 0; s < shipsInLink.length; s++) {
                console.log("todo - shipInLink reset");
            }
        }
    }
    energize(uwpe) {
        var world = uwpe.world;
        var factionSelf = world.factionCurrent();
        var ships = factionSelf.ships;
        for (var i = 0; i < ships.length; i++) {
            var ship = ships[i];
            var shipDeviceUser = ship.deviceUser();
            var energyRemainingThisRound = shipDeviceUser.energyRemainingThisRound();
            shipDeviceUser.energyRemainingThisRoundAdd(energyRemainingThisRound);
        }
    }
    enervate(uwpe) {
        var world = uwpe.world;
        var factionSelf = world.factionCurrent();
        var starsystems = factionSelf.starsystems(world);
        for (var i = 0; i < starsystems.length; i++) {
            var starsystem = starsystems[i];
            var shipsInStarsystem = starsystem.ships;
            for (var s = 0; s < shipsInStarsystem.length; s++) {
                var ship = shipsInStarsystem[s];
                var shipDeviceUser = ship.deviceUser();
                shipDeviceUser.energyRemainingThisRoundClear();
            }
        }
    }
    farsee(uwpe) {
        var world = uwpe.world;
        var factionSelf = world.factionCurrent();
        var factionSelfKnowledge = factionSelf.knowledge;
        var starCluster = world.starCluster;
        var links = starCluster.links;
        for (var i = 0; i < links.length; i++) {
            var link = links[i];
            factionSelfKnowledge.linkAdd(link);
        }
    }
    hermitize(uwpe) {
        var world = uwpe.world;
        var factionSelf = world.factionCurrent();
        var starsystems = factionSelf.starsystems(world);
        for (var i = 0; i < starsystems.length; i++) {
            var starsystem = starsystems[i];
            var linkPortalsInStarsystem = starsystem.linkPortals;
            for (var p = 0; p < linkPortalsInStarsystem.length; p++) {
                var linkPortal = linkPortalsInStarsystem[p];
                console.log("todo - link portal block: " + linkPortal.toString());
            }
        }
    }
    inspire(uwpe) {
        var world = uwpe.world;
        var factionSelf = world.factionCurrent();
        var factionSelfResearcher = factionSelf.technologyResearcher;
        factionSelfResearcher.technologyBeingResearchedLearn();
    }
    intractablize(uwpe) {
        var world = uwpe.world;
        var factionSelf = world.factionCurrent();
        var planets = factionSelf.planets;
        for (var i = 0; i < planets.length; i++) {
            var planet = planets[i];
            console.log("todo - intractablize: " + planet.toString()); // Tricky to implement.
        }
    }
    larcenize(uwpe) {
        var world = uwpe.world;
        var factionSelf = world.factionCurrent();
        var factions = world.factions;
        var factionsOther = factions.filter(x => x != factionSelf);
        var technologiesAll = world.technologyGraph.technologies;
        var factionsKnowingByTechnologyName = new Map();
        var technologiesKnownByAtLeastTwoOthers = new Array();
        technologiesAll.forEach(tech => {
            var techName = tech.name;
            for (var f = 0; f < factionsOther.length; f++) {
                var faction = factionsOther[f];
                var researcher = faction.technologyResearcher;
                var techIsKnown = researcher.technologyIsKnown(tech);
                if (techIsKnown) {
                    var factionsKnowing = factionsKnowingByTechnologyName.get(techName);
                    if (factionsKnowing == null) {
                        factionsKnowing = new Array();
                        factionsKnowingByTechnologyName.set(techName, factionsKnowing);
                    }
                    else {
                        technologiesKnownByAtLeastTwoOthers.push(tech);
                    }
                    factionsKnowing.push(faction);
                }
            }
        });
        var notificationText = "";
        if (technologiesKnownByAtLeastTwoOthers.length == 0) {
            notificationText =
                "There are no technologies unknown to you "
                    + "but known by two or more other factions.";
        }
        else {
            var techWithCostMinSoFar = technologiesKnownByAtLeastTwoOthers[0];
            var techCostMinSoFar = techWithCostMinSoFar.researchToLearn;
            for (var t = 1; t < technologiesKnownByAtLeastTwoOthers.length; t++) {
                var tech = technologiesKnownByAtLeastTwoOthers[t];
                var techCost = tech.researchToLearn;
                if (techCost < techCostMinSoFar) {
                    techCostMinSoFar = techCost;
                    techWithCostMinSoFar = tech;
                }
            }
            var techToSteal = techWithCostMinSoFar;
            factionSelf.technologyResearcher.technologyLearn(techToSteal);
            notificationText =
                "You have stolen the technology of " + techToSteal.name + ".";
        }
        var notification = new Notification2(notificationText, null // todo - jumpTo
        );
        factionSelf.notificationSession.notificationAdd(notification);
    }
    manipulate(uwpe) {
        alert("todo - faction ability - manipulate");
    }
    nurture(uwpe) {
        var world = uwpe.world;
        var factionSelf = world.factionCurrent();
        var planets = factionSelf.planets;
        var planetWithPopulationLeastSoFar = planets[0];
        var populationLeastSoFar = planetWithPopulationLeastSoFar.population();
        for (var i = 1; i < planets.length; i++) {
            var planet = planets[i];
            var planetPopulation = planet.population();
            if (planetPopulation < populationLeastSoFar) {
                populationLeastSoFar = planetPopulation;
                planetWithPopulationLeastSoFar = planet;
            }
        }
        var planetToEnrich = planetWithPopulationLeastSoFar;
        var planetEnvironments = PlanetEnvironment.Instances();
        planetToEnrich.planetType.environment = planetEnvironments.Cornucopia;
    }
    prolificate(uwpe) {
        var world = uwpe.world;
        var factionSelf = world.factionCurrent();
        var planets = factionSelf.planets;
        for (var i = 0; i < planets.length; i++) {
            var planet = planets[i];
            planet.populationMaxAdd(1);
        }
    }
    regenerate(uwpe) {
        var world = uwpe.world;
        var factionSelf = world.factionCurrent();
        var ships = factionSelf.ships;
        for (var i = 0; i < ships.length; i++) {
            var ship = ships[i];
            ship.killable().integritySetToMax();
        }
    }
    telepathicize(uwpe) {
        var world = uwpe.world;
        var factionSelf = world.factionCurrent();
        var factionSelfDiplomacy = factionSelf.diplomacy;
        var factions = world.factions;
        var factionsOther = factions.filter(x => x != factionSelf);
        for (var i = 0; i < factionsOther.length; i++) {
            var factionOther = factionsOther[i];
            var relationship = factionSelfDiplomacy.relationshipByFaction(factionOther);
            relationship.stateSetToPeace();
        }
    }
    xenophobicize(uwpe) {
        var randomizer = uwpe.universe.randomizer;
        var world = uwpe.world;
        var factionSelf = world.factionCurrent();
        var starsystems = factionSelf.starsystems(world);
        for (var i = 0; i < starsystems.length; i++) {
            var starsystem = starsystems[i];
            var linkPortalsInStarsystem = starsystem.linkPortals;
            var shipsInStarsystem = starsystem.ships;
            var shipsInStarsystemBelongingToOthers = shipsInStarsystem.filter(x => x.factionable().faction() != factionSelf);
            for (var s = 0; s < shipsInStarsystemBelongingToOthers.length; s++) {
                var shipToExpel = shipsInStarsystemBelongingToOthers[s];
                var linkPortalToExpelThrough = randomizer.chooseRandomElementFromArray(linkPortalsInStarsystem);
                shipToExpel.linkPortalEnter(world.starCluster, linkPortalToExpelThrough, shipToExpel);
                // todo - Notify victims?
            }
        }
    }
}
