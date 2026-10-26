import type { Poll } from "../api/pollsService";

function PollStatusInfo({ poll }: { poll: Poll }) {
  return (
    <>
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
    </>
  );
}

export default PollStatusInfo;
