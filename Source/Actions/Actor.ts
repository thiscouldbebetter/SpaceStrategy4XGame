
interface Actor extends Namable
{
	activity(): Activity;
	activitySet(value: Activity): void;
	locatable(): Locatable;
	order: Order;
	toEntity(): Entity;
}
