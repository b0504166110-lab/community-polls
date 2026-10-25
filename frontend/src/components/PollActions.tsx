import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { closePoll, deletePoll } from "../api/pollsService";
import { getErrorMessage } from "../api/client";
import ErrorMessage from "./ErrorMessage";

type Props = {
  pollId: number;
  canEdit: boolean;
  canDelete: boolean;
  canClose: boolean;
  onDeleted?: () => void;
};

function PollActions({ pollId, canEdit, canDelete, canClose, onDeleted }: Props) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => deletePoll(pollId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["polls"] });
      onDeleted?.();
    },
  });

  const closeMutation = useMutation({
    mutationFn: () => closePoll(pollId),
    onSuccess: (updatedPoll) => {
      queryClient.setQueryData(["poll", pollId], updatedPoll);
      queryClient.invalidateQueries({ queryKey: ["polls"] });
    },
  });

  function handleDelete() {
    if (!confirm("למחוק את הסקר? אי אפשר לבטל את המחיקה.")) return;
    deleteMutation.mutate();
  }

  function handleClose() {
    if (!confirm("לסגור את הסקר? אחרי הסגירה אי אפשר יהיה להצביע.")) return;
    closeMutation.mutate();
  }

  return (
    <div>
      {canEdit && <Link to={`/polls/${pollId}/edit`}>עריכה</Link>}{" "}
      {canDelete && (
        <button onClick={handleDelete} disabled={deleteMutation.isPending}>
          {deleteMutation.isPending ? "מוחק..." : "מחיקה"}
        </button>
      )}{" "}
      {canClose && (
        <button onClick={handleClose} disabled={closeMutation.isPending}>
          {closeMutation.isPending ? "סוגר..." : "סגירה"}
        </button>
      )}

      {deleteMutation.isError && (
        <ErrorMessage message={getErrorMessage(deleteMutation.error)} />
      )}
      {closeMutation.isError && (
        <ErrorMessage message={getErrorMessage(closeMutation.error)} />
      )}
    </div>
  );
}

export default PollActions;
