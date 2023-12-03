"use strict";
class DeviceDefns {
    constructor() {
        this.ColonyHub = new DeviceDefn("Colony Hub", false, // isActive
        false, // needsTarget
        [], // categoryNames
        (uwpe) => // init
         { }, (uwpe) => // updateForRound
         { }, (uwpe) => // use
         {
            var ship = uwpe.entity;
            ship.planetColonize(uwpe.universe, uwpe.world);
        });
        this.ShipDriveBasic = new DeviceDefn("Ship Drive, Basic", false, // isActive
        false, // needsTarget
        ["Drive"], // categoryNames
        (uwpe) => // init
         { }, (uwpe) => // updateForRound
         {
            var ship = uwpe.entity;
            var shipTurnTaker = ship.turnTaker();
            shipTurnTaker.distancePerMove += 50;
            shipTurnTaker.energyPerMove += 1;
        }, (uwpe) => // use
         {
            var ship = uwpe.entity;
            var shipTurnTaker = ship.turnTaker();
            shipTurnTaker.energyForMoveDeduct();
        });
        this.ShipGeneratorBasic = new DeviceDefn("Ship Generator, Basic", false, // isActive
        false, // needsTarget
        ["Generator"], // categoryNames
        (uwpe) => // init
         { }, (uwpe) => // updateForRound
         {
            var ship = uwpe.entity;
            var shipTurnTaker = ship.turnTaker();
            shipTurnTaker.energyThisTurn += 10;
        }, (uwpe) => // use
         {
            // Do nothing.
        });
        this.ShipShieldBasic = new DeviceDefn("Ship Shield, Basic", true, // isActive
        false, // needsTarget
        ["Shield"], // categoryNames
        (uwpe) => // intialize
         {
            var device = Device.ofEntity(uwpe.entity2);
            device.isActive = false;
        }, (uwpe) => // updateForRound
         {
            var ship = uwpe.entity;
            var device = Device.ofEntity(uwpe.entity2);
            if (device.isActive) {
                var shipTurnTaker = ship.turnTaker();
                shipTurnTaker.energyThisTurn -= 1;
                shipTurnTaker.shieldingThisTurn += 1;
            }
        }, (uwpe) => // use
         {
            var ship = uwpe.entity;
            var device = Device.ofEntity(uwpe.entity2);
            var shipTurnTaker = ship.turnTaker();
            if (device.isActive) {
                device.isActive = false;
                shipTurnTaker.energyThisTurn += 1;
            }
            else {
                device.isActive = true;
                shipTurnTaker.energyThisTurn -= 1;
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
        }, (uwpe) => // updateForRound
         {
            var device = Device.ofEntity(uwpe.entity2);
            device.usesThisTurn = 3;
        }, this.shipWeaponBasicUse);
    }
    shipWeaponBasicUse(uwpe) {
        var ship = uwpe.entity;
        var device = Device.ofEntity(uwpe.entity2);
        if (device.usesThisTurn > 0) {
            var target = device.targetEntity; // todo
            if (target == null) {
                var venue = uwpe.universe.venueCurrent();
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
