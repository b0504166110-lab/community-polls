import type { AdminPoll } from "../api/adminService";
import PollCard from "./PollCard";
import AdminPollActions from "./AdminPollActions";

function AdminPollCard({ poll }: { poll: AdminPoll }) {
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
     <p>{poll.creator.name}</p>
      <AdminPollActions
        pollId={poll.id}
        status={poll.status}
        isHidden={poll.isHidden}
      />
    </PollCard>
  );
}

export default AdminPollCard;
