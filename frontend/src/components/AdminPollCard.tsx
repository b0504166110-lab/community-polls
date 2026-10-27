import type { AdminPoll } from "../api/adminService";
import PollCard from "./PollCard";
import AdminPollActions from "./AdminPollActions";
import PollStatusInfo from "./PollStatusInfo";

function AdminPollCard({ poll }: { poll: AdminPoll }) {
  return (
    <PollCard poll={poll}>
      <PollStatusInfo poll={poll} />
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
