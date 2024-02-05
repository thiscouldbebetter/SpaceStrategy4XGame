"use strict";
class ConversationStyleMercantile {
}
ConversationStyleMercantile.Content = `

Greet.Alliance
Ah, hello, preferred customer!

Greet.Peace
Welcome.  What can we exchange today?

Greet.War
YOU are bad for business.  What do you want?

Quit
Come again!

StateChange.Alliance.ToPeace
Your preferred customer status is revoked.

StateChange.Peace.ToAlliance.Accept
You have been approved for preferred customer status!

StateChange.Peace.ToAlliance.Reject
Sorry, you simply don't have the credit for that.

StateChange.Peace.ToWar
This will hurt your bottom line more than ours.

StateChange.War.ToPeace.Accept
We welcome this return to business as usual.

StateChange.War.ToPeace.Reject
We see no way to resume normal trade relations at this time.

StateCurrent.Prompt
Let's get down to business.

StateCurrent.PromptAgain
How else may we help you today?

TradeInformation.Cancel.Do
Yes, let's break for now, and circle back later.

TradeInformation.Confirm
Thank you for your business.

TradeInformation.Prompt
All right, make us an offer.
	`;
