
function NotificationType(name)
{
	this.name = name;
}

{
	function NotificationType_Instances()
	{
		this.Default = new NotificationType("Default");
	}

	NotificationType.Instances = new NotificationType_Instances();
}
