"use strict";
class DeviceDefns {
    constructor() {
        this.ColonyHub = new DeviceDefn("Colony Hub", false, // isActive
        false, // needsTarget
        [], // categoryNames
        (uwpe) => // init
         { }, (uwpe) => // updateForRound
         { }, 1, // usesPerRound
        0, // energyPerUse
        (uwpe) => // use
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
            // todo - var ship = uwpe.entity as Ship;
        }, 0, // usesPerRound
        1, // energyPerUse
        (uwpe) => // use
         {
            // todo - var ship = uwpe.entity as Ship;
        });
        this.ShipGeneratorBasic = new DeviceDefn("Ship Generator, Basic", false, // isActive
        false, // needsTarget
        ["Generator"], // categoryNames
        (uwpe) => // init
         { }, (uwpe) => // updateForRound
         {
            // todo - var ship = uwpe.entity as Ship;
        }, 0, // usesPerRound
        1, // energyPerUse
        (uwpe) => // use
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
            // todo
        }, 0, // usesPerRound
        1, // energyPerUse
        (uwpe) => // use
         {
            // todo
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
            // todo
            //var device = Device.ofEntity(uwpe.entity2);
            //device.usesThisTurn = 3;
        }, 1, // usesPerRound
        1, // energyPerUse
        this.shipWeaponBasicUse);
    }
    shipWeaponBasicUse(uwpe) {
        /*
        var ship = uwpe.entity as Ship;
        var device = Device.ofEntity(uwpe.entity2);

        if (device.usesThisTurn > 0)
        {
            var target = device.targetEntity; // todo
            if (target == null)
            {
                var venue = uwpe.universe.venueCurrent() as VenueStarsystem;
                venue.cursor.entityAndOrderNameSet(ship, "UseDevice");
            }
            else // if (target != null)
            {
                device.usesThisTurn--;
                var targetKillable = target.killable();
                targetKillable.integrity -= 1;
                if (targetKillable.integrity <= 0)
                {
                    alert("todo - ship destroyed");
                }
            }
        }
        */
    }
}
