"use strict";
class FactionIntelligence {
    constructor(name, moveChoose) {
        this.name = name;
        this._starsystemMoveChoose = moveChoose;
    }
    static Instances() {
        if (FactionIntelligence._instances == null) {
            FactionIntelligence._instances = new FactionIntelligence_Instances();
        }
        return FactionIntelligence._instances;
    }
    starsystemMoveChoose(uwpe) {
        this._starsystemMoveChoose(uwpe);
    }
}
class FactionIntelligence_Instances {
    constructor() {
        this.Computer = new FactionIntelligence("Computer", (uwpe) => {
            // For now, choose a random ship and move it toward a random position.
            var universe = uwpe.universe;
            var venueStarsystem = universe.venueCurrent();
            var starsystem = venueStarsystem.starsystem;
            var world = universe.world;
            var factionToMove = starsystem.factionToMove(world);
            var shipsAll = starsystem.ships;
            var factionToMoveShips = shipsAll.filter(x => x.factionable().faction() == factionToMove);
            var factionToMoveShipsWithEnergyToMove = factionToMoveShips.filter(x => x.deviceUser().energyRemainingThisRoundIsEnoughToMove(uwpe.entitySet(x)));
            if (factionToMoveShipsWithEnergyToMove.length == 0) {
                starsystem.factionToMoveAdvance(world);
            }
            else {
                var shipToMove = factionToMoveShipsWithEnergyToMove[0];
                var shipToMoveOrder = shipToMove.orderable().order(shipToMove);
                var orderDefns = OrderDefn.Instances();
                shipToMoveOrder.defnSet(orderDefns.Go);
                var posToTarget = Coords.random(universe.randomizer).multiply(starsystem.size());
                var entityToTarget = Entity.fromProperty(Locatable.fromPos(posToTarget));
                shipToMoveOrder.entityBeingTargetedSet(entityToTarget);
                shipToMoveOrder.obey(uwpe);
            }
        });
        this.Human = new FactionIntelligence("Human", (uwpe) => {
            // Do nothing.
        });
    }
}
