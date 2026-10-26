import type { Poll } from "../api/pollsService";
import PollCard from "./PollCard";
import PollActions from "./PollActions";
import PollStatusInfo from "./PollStatusInfo";

function MyPollCard({ poll }: { poll: Poll }) {

  return (
    <PollCard poll={poll}>
      <PollStatusInfo poll={poll} />
      <PollActions
        pollId={poll.id}
        canEdit={poll.permissions.canEdit}
        canDelete={poll.permissions.canDelete}
        canClose={poll.isOpen}
      />
    </PollCard>
  );
}

export default MyPollCard;
