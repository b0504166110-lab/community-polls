import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getPoll } from "../api/pollsService";
import { getErrorMessage } from "../api/client";
import ErrorMessage from "../components/ErrorMessage";
import VoteForm from "../components/VoteForm";
import PollResults from "../components/PollResults";
import PollQuestions from "../components/PollQuestions";
import PollActions from "../components/PollActions";

function PollDetails() {
  const { id } = useParams();
  const pollId = Number(id);
  const navigate = useNavigate();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["poll", pollId],
    queryFn: () => getPoll(pollId),
  });

  if (isPending) return <p>טוען...</p>;
  if (isError) return <ErrorMessage message={getErrorMessage(error)} />;

  const isApproved = data.status === "APPROVED";

  return (
    <div>
      <h2>{data.title}</h2>
      {data.description && <p>{data.description}</p>}
      <p>קטגוריה: {data.categoryLabel}</p>
      {isApproved && <p>{data.isOpen ? "פתוח" : "סגור"}</p>}
      <p>נסגר ב: {new Date(data.closesAt).toLocaleString("he-IL")}</p>
      <p>{data.voterCount} מצביעים</p>

      {data.status === "PENDING" && <p>ממתין לאישור המנהל</p>}
      {data.status === "REJECTED" && (
        <p>הסקר נדחה{data.rejectionReason && `: ${data.rejectionReason}`}</p>
      )}
      <PollActions
        pollId={data.id}
        canEdit={data.permissions.canEdit}
        canDelete={data.permissions.canDelete}
        canClose={data.permissions.canClose}
        onDeleted={() => navigate("/my-polls")}
      />

      {!data.permissions.canVote && !data.permissions.canSeeResults && (
        <PollQuestions questions={data.questions} />
      )}

      {data.permissions.canVote ? (
        <VoteForm pollId={data.id} questions={data.questions} />
      ) : data.permissions.canSeeResults ? (
        <PollResults pollId={data.id} />
      ) : (
        isApproved && <p>הסקר סגור</p>
      )}
    </div>
  );
}

export default PollDetails;
