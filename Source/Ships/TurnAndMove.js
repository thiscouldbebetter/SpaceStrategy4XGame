"use strict";
class TurnAndMove {
    constructor() {
        this.distanceLeftThisMove = null;
        this.distancePerMove = 0;
        this.energyPerMove = null;
        this.energyThisTurn = 0;
        this.initiativeThisTurn = 1;
        this.shieldingThisTurn = 0;
        // Helper variables.
        this._displacement = Coords.create();
    }
    clear() {
        this.distanceLeftThisMove = null;
        this.distancePerMove = 0;
        this.energyThisTurn = 0;
        this.energyPerMove = 0;
        this.shieldingThisTurn = 0;
    }
    energyForMoveDeduct() {
        this.energyThisTurn -= this.energyPerMove;
    }
    moveShipTowardTarget(uwpe, ship, target) {
        if (this.distanceLeftThisMove == null) {
            if (this.energyThisTurn >= this.energyPerMove) {
                this.energyThisTurn -= this.energyPerMove;
                this.distanceLeftThisMove = this.distancePerMove;
            }
        }
        if (this.distanceLeftThisMove > 0) {
            var shipLocatable = ship.locatable();
            var targetLocatable = target.locatable();
            var distanceMaxPerTick = 3; // hack
            var distanceToTarget = shipLocatable.approachOtherWithAccelerationAndSpeedMaxAndReturnDistance(targetLocatable, distanceMaxPerTick, // accel
            distanceMaxPerTick // speedMax
            );
            if (distanceToTarget < this.distanceLeftThisMove) {
                this.distanceLeftThisMove = null;
                ship.actor().activity.doNothing();
                var shipOrder = ship.order();
                if (shipOrder != null) // hack
                 {
                    shipOrder.complete();
                }
            }
        }
    }
    moveShipTowardTarget_Old(uwpe, ship, target) {
        if (this.distanceLeftThisMove == null) {
            if (this.energyThisTurn >= this.energyPerMove) {
                this.energyThisTurn -= this.energyPerMove;
                this.distanceLeftThisMove = this.distancePerMove;
            }
        }
        if (this.distanceLeftThisMove > 0) {
            this.moveShipTowardTarget2(uwpe, ship, target);
        }
    }
    moveShipTowardTarget2(uwpe, ship, target) {
        var shipLoc = ship.locatable().loc;
        var shipPos = shipLoc.pos;
        var targetLoc = target.locatable().loc;
        var targetPos = targetLoc.pos;
        var displacementToTarget = this._displacement.overwriteWith(targetPos).subtract(shipPos);
        var distanceToTarget = displacementToTarget.magnitude();
        var distanceMaxPerTick = 3; // hack
        var distanceToMoveThisTick = (this.distanceLeftThisMove < distanceMaxPerTick
            ? this.distanceLeftThisMove
            : distanceMaxPerTick);
        this.moveShipTowardTarget3(uwpe, displacementToTarget, distanceToTarget, distanceToMoveThisTick, ship, target);
    }
    moveShipTowardTarget3(uwpe, displacementToTarget, distanceToTarget, distanceToMoveThisTick, ship, target) {
        var universe = uwpe.universe;
        var shipLoc = ship.locatable().loc;
        var shipPos = shipLoc.pos;
        if (distanceToTarget <= distanceToMoveThisTick) {
            var targetPos = target.locatable().loc.pos;
            shipPos.overwriteWith(targetPos);
            // hack
            this.distanceLeftThisMove = null;
            ship.actor().activity.doNothing();
            universe.inputHelper.isEnabled = true;
            var shipOrder = ship.order();
            if (shipOrder != null) // hack
             {
                shipOrder.complete();
            }
            ship.collideWithEntity(uwpe, target);
        }
        else {
            var directionToTarget = displacementToTarget.divideScalar(distanceToTarget);
            var shipAccel = shipLoc.accel;
            shipAccel.overwriteWith(directionToTarget).multiplyScalar(distanceToMoveThisTick);
            this.distanceLeftThisMove -= distanceToMoveThisTick;
            if (this.distanceLeftThisMove <= 0) {
                // hack
                this.distanceLeftThisMove = null;
                ship.actor().activity.doNothing();
                universe.inputHelper.isEnabled = true;
            }
        }
    }
    toStringDescription() {
        return "Energy: " + this.energyThisTurn;
    }
}
