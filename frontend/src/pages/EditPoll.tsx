import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { getPoll, updatePoll, type PollInput } from "../api/pollsService";
import { getErrorMessage, getFieldErrors } from "../api/client";
import { toPollInput } from "../utils/toPollInput";
import PollForm from "../components/PollForm";
import ErrorMessage from "../components/ErrorMessage";

function EditPoll() {
  const { id } = useParams();
  const pollId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["poll", pollId],
    queryFn: () => getPoll(pollId),
  });

  const mutation = useMutation({
    mutationFn: (poll: PollInput) => updatePoll(pollId, poll),
    onSuccess: (updated) => {
      queryClient.setQueryData(["poll", pollId], updated);
      queryClient.invalidateQueries({ queryKey: ["polls"] });
      navigate(`/polls/${pollId}`);
    },
  });

  if (isPending) return <p>טוען...</p>;
  if (isError) return <ErrorMessage message={getErrorMessage(error)} />;
  if (!data.permissions.canEdit) return <p>אי אפשר לערוך את הסקר הזה</p>;

  return (
    <>
      <h2>עריכת סקר</h2>
      {data.status === "REJECTED" && (
        <p>
          הסקר נדחה{data.rejectionReason && `: ${data.rejectionReason}`}
        </p>
      )}
      <p>אחרי השמירה הסקר יישלח שוב לאישור המנהל.</p>

      <PollForm
        initialValues={toPollInput(data)}
        onSubmit={(poll) => mutation.mutate(poll)}
        isSubmitting={mutation.isPending}
        errors={getFieldErrors(mutation.error)}
        submitLabel="שמירה"
      />
      {mutation.isError && <ErrorMessage message={getErrorMessage(mutation.error)} />}
    </>
  );
}

export default EditPoll;
