import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectPoll, approvePoll, setPollHidden } from "../api/adminService";
import { deletePoll } from "../api/pollsService";
import { getErrorMessage } from "../api/client";
import ErrorMessage from "./ErrorMessage";

type Props = {
  pollId: number;

  status: "APPROVED" | "REJECTED" | "PENDING";

  isHidden: boolean;
};

function AdminPollActions({ pollId, status, isHidden }: Props) {
  const queryClient = useQueryClient();
  const [reason, setReason] = useState("");

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ["polls"] });
    queryClient.invalidateQueries({ queryKey: ["admin-polls"] });
  }

  const approveMutation = useMutation({
    mutationFn: () => approvePoll(pollId),
    onSuccess: refresh,
  });
  const rejectMutation = useMutation({
    mutationFn: () => rejectPoll(pollId, reason.trim() ),
    onSuccess: () => {
      setReason("");
      refresh();
    },
  });
  const hiddenMutation = useMutation({
    mutationFn: () => setPollHidden(pollId, !isHidden),
    onSuccess: refresh,
  });
  const deleteMutation=useMutation({
    mutationFn:()=>deletePoll(pollId),
    onSuccess:refresh
  })

  const isBusy =
    approveMutation.isPending ||
    rejectMutation.isPending ||
    hiddenMutation.isPending ||
    deleteMutation.isPending;

  function handleDelete() {
    if (!confirm("למחוק את הסקר? גם ההצבעות יימחקו ואי אפשר לבטל.")) return;
    deleteMutation.mutate();
  }
  return (
    <div>
      {status !== "APPROVED" && (
        <button onClick={() => approveMutation.mutate()} disabled={isBusy}>
          {approveMutation.isPending ? "מאשר..." : "אישור"}
        </button>
      )}{" "}

      {status !== "REJECTED" && (
        <>
          <input
            type="text"
            placeholder="סיבת הדחייה (חובה)"
            maxLength={300}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />{" "}
          <button
            onClick={() => rejectMutation.mutate()}
            disabled={isBusy || !reason.trim()}
          >
            {rejectMutation.isPending ? "דוחה..." : "דחייה"}
          </button>{" "}
        </>
      )}

      {status === "APPROVED" && (
        <button onClick={() => hiddenMutation.mutate()} disabled={isBusy}>
          {hiddenMutation.isPending
            ? "מעדכן..."
            : isHidden
              ? "החזרה לתצוגה"
              : "הסתרה"}
        </button>
      )}{" "}

      <button onClick={handleDelete} disabled={isBusy}>
        {deleteMutation.isPending ? "מוחק..." : "מחיקה"}
      </button>
      {approveMutation.isError && (
        <ErrorMessage message={getErrorMessage(approveMutation.error)} />
      )}
      {rejectMutation.isError && (
        <ErrorMessage message={getErrorMessage(rejectMutation.error)} />
      )}
      {hiddenMutation.isError && (
        <ErrorMessage message={getErrorMessage(hiddenMutation.error)} />
      )}
      {deleteMutation.isError && (
        <ErrorMessage message={getErrorMessage(deleteMutation.error)} />
      )}
    </div>
  );
}

export default AdminPollActions;
