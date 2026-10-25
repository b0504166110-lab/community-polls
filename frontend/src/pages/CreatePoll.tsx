import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPoll } from "../api/pollsService";
import { getErrorMessage, getFieldErrors } from "../api/client";
import PollForm from "../components/PollForm";
import ErrorMessage from "../components/ErrorMessage";

function CreatePoll() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createPoll,
    onSuccess: (poll) => {
      queryClient.invalidateQueries({ queryKey: ["polls"] });
      navigate(`/polls/${poll.id}`);
    },
  });

  return (
    <>
      <h2>סקר חדש</h2>
      <PollForm
        onSubmit={(poll) => mutation.mutate(poll)}
        isSubmitting={mutation.isPending}
        errors={getFieldErrors(mutation.error)}
      />
      {mutation.isError && (
        <ErrorMessage message={getErrorMessage(mutation.error)} />
      )}
    </>
  );
}

export default CreatePoll;
