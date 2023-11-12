"use strict";
class DeviceDefns {
    constructor() {
        this.ColonyHub = new DeviceDefn("Colony Hub", false, // isActive
        false, // needsTarget
        [], // categoryNames
        (uwpe) => // init
         { }, (uwpe) => // updateForTurn
         { }, (uwpe) => // use
         {
            var ship = uwpe.entity;
            ship.planetColonize(uwpe.universe, uwpe.world);
        });
        this.ShipDriveBasic = new DeviceDefn("Ship Drive, Basic", false, // isActive
        false, // needsTarget
        ["Drive"], // categoryNames
        (uwpe) => // init
         { }, (uwpe) => // updateForTurn
         {
            var ship = uwpe.entity;
            var shipTurnAndMove = ship.turnAndMove;
            shipTurnAndMove.distancePerMove += 50;
            shipTurnAndMove.energyPerMove += 1;
        }, (uwpe) => // use
         {
            var ship = uwpe.entity;
            var shipTurnAndMove = ship.turnAndMove;
            shipTurnAndMove.energyForMoveDeduct();
        });
        this.ShipGeneratorBasic = new DeviceDefn("Ship Generator, Basic", false, // isActive
        false, // needsTarget
        ["Generator"], // categoryNames
        (uwpe) => // init
         { }, (uwpe) => // updateForTurn
         {
            var ship = uwpe.entity;
            ship.turnAndMove.energyThisTurn += 10;
        }, (uwpe) => // use
         {
            // Do nothing.
        });
        this.ShipShieldBasic = new DeviceDefn("Ship Shield, Basic", true, // isActive
        false, // needsTarget
        ["Shield"], // categoryNames
        (uwpe) => // intialize
         {
            var device = Device.fromEntity(uwpe.entity2);
            device.isActive = false;
        }, (uwpe) => // updateForTurn
         {
            var ship = uwpe.entity;
            var device = Device.fromEntity(uwpe.entity2);
            if (device.isActive) {
                var turnAndMove = ship.turnAndMove;
                turnAndMove.energyThisTurn -= 1;
                turnAndMove.shieldingThisTurn += 1;
            }
        }, (uwpe) => // use
         {
            var ship = uwpe.entity;
            var device = Device.fromEntity(uwpe.entity2);
            var turnAndMove = ship.turnAndMove;
            if (device.isActive) {
                device.isActive = false;
                turnAndMove.energyThisTurn += 1;
            }
            else {
                device.isActive = true;
                turnAndMove.energyThisTurn -= 1;
            }
        });
        this.ShipWeaponBasic = this.shipWeaponBasic();
        this._All =
            [
                this.ColonyHub,
                this.ShipDriveBasic,
                this.ShipGeneratorBasic,
                this.ShipShieldBasic,
                this.ShipWeaponBasic,
            ];
    }
    static Instance() {
        if (DeviceDefns._instance == null) {
            DeviceDefns._instance = new DeviceDefns();
        }
        return DeviceDefns._instance;
    }
    shipWeaponBasic() {
        return new DeviceDefn("Ship Weapon, Basic", true, // isActive
        true, // needsTarget
        ["Weapon"], // categoryNames
        (uwpe) => // initialize
         {
            // todo
        }, (uwpe) => // updateForTurn
         {
            var device = Device.fromEntity(uwpe.entity2);
            device.usesThisTurn = 3;
        }, this.shipWeaponBasicUse);
    }
    shipWeaponBasicUse(uwpe) {
        var ship = uwpe.entity;
        var device = Device.fromEntity(uwpe.entity2);
        if (device.usesThisTurn > 0) {
            var target = device.targetEntity; // todo
            if (target == null) {
                var venue = uwpe.universe.venueCurrent;
                venue.cursor.entityAndOrderNameSet(ship, "UseDevice");
            }
            else // if (target != null)
             {
                device.usesThisTurn--;
                var targetKillable = target.killable();
                targetKillable.integrity -= 1;
                if (targetKillable.integrity <= 0) {
                    alert("todo - ship destroyed");
                }
            }
        }
    }
}
