
function Universe(name, activityDefns, technologyTree, world)
{
	this.name = name;
	this.activityDefns = activityDefns;
	this.technologyTree = technologyTree;
	this.world = world;

	this.activityDefns.addLookups("name");
	this.venueNext = null;

}

{
	// static methods

	Universe.new = function(world)
	{
		var technologyTree = TechnologyTree.buildExample();

		var returnValue = new Universe
		(
			"Universe0",
			ActivityDefn.Instances._All,
			technologyTree,
			world,
			// venues
			[
				// none
			]
		);

		return returnValue;
	}

	// instance methods

	Universe.prototype.initialize = function()
	{
		var venueControlsTitle = new VenueControls
		(
			ControlBuilder.title()
		);

		venueControlsTitle = new VenueFader
		(
			venueControlsTitle, venueControlsTitle
		);

		this.venueNext = venueControlsTitle;
	}

	Universe.prototype.isProfileSelected = function()
	{
		return (this.profile != null);
	}

	Universe.prototype.isWorldSelected = function()
	{
		return (this.world != null);
	}

	Universe.prototype.updateForTimerTick = function()
	{
		if (this.venueNext != null)
		{
			if 
			(
				this.venueCurrent != null 
				&& this.venueCurrent.finalize != null
			)
			{
				this.venueCurrent.finalize();
			}			

			this.venueCurrent = this.venueNext;
			this.venueNext = null;

			if (this.venueCurrent.initialize != null)
			{
				this.venueCurrent.initialize();
			}
		}
		this.venueCurrent.updateForTimerTick();
		this.venueCurrent.draw();
	}
}
