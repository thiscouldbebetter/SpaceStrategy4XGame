"use strict";
class ConversationStyleRobotic {
}
ConversationStyleRobotic.Content = `

Greet.Alliance
Trusted node acknowledged.

Greet.Peace
Peer node acknowledged.

Greet.War
Threat node acknowledged.

Quit
Session terminated.

StateChange.Alliance.ToPeace
Trusted privileges revoked.

StateChange.Peace.ToAlliance.Accept
Trusted helper privileges granted.

StateChange.Peace.ToAlliance.Reject
Peer node unauthorized for trusted privileges.

StateChange.Peace.ToWar
Peer privileges revoked.  Threat protocols enabled.

StateChange.War.ToPeace.Accept
Threat protocols disabled.  Peer privileges granted.

StateChange.War.ToPeace.Reject
Bad request.  Threat protocols remain in effect.

StateCurrent.Prompt
Ready for query.

StateCurrent.PromptAgain
Ready for query.

TradeInformation.Cancel.Do
End duplex data transfer.  Returning to main loop.

TradeInformation.Confirm
Duplex data transfer initiated.

TradeInformation.Prompt
Duplex data transfer initiated.
	`;
