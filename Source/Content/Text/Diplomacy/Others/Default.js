"use strict";
class ConversationStyleDefault {
}
ConversationStyleDefault.Content = `

Greet.Alliance
Welcome, friend.

Greet.Peace
Greetings, neighbor.

Greet.War
We accept your offer of parlay, foe.

Quit
Until next time, then.

StateChange.Alliance.ToPeace
If that's really how you feel.

StateChange.Peace.ToAlliance.Accept
Yes, we are stronger together.

StateChange.Peace.ToAlliance.Reject
We doubt that's in our interest.

StateChange.Peace.ToWar
It is war, then.  You'll regret this.

StateChange.War.ToPeace.Accept
Enough of fighting.  We welcome peace.

StateChange.War.ToPeace.Reject
No, you haven't learned your lesson yet.

StateCurrent.Prompt
What did you want to talk about?

StateCurrent.PromptAgain
Was there anything else?

TradeInformation.Cancel.Do
Very well, then.

TradeInformation.Confirm
Very well, let's trade.

TradeInformation.Prompt
What kind of info do you want to trade?
	`;
