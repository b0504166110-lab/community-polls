import type { Poll } from "../api/pollsService";
import PollCard from "./PollCard";
import PollActions from "./PollActions";

function MyPollCard({ poll }: { poll: Poll }) {

  return (
    <PollCard poll={poll}>
      <p>
        {poll.status === "APPROVED"
          ? "מאושר"
          : poll.status === "PENDING"
            ? "ממתין לאישור"
            : "נדחה"}
      </p>
      {poll.status === "REJECTED" && poll.rejectionReason && (
        <p>סיבת הדחייה: {poll.rejectionReason}</p>
      )}
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
