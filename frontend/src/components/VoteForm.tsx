import { useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { vote, type PollQuestion } from "../api/pollsService";
import { getErrorMessage } from "../api/client";
import ErrorMessage from "./ErrorMessage";

type Props = {
  pollId: number;
  questions: PollQuestion[];
};

function VoteForm({ pollId, questions }: Props) {
  const [selected, setSelected] = useState<number[]>([]);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => vote(pollId, selected),
    onSuccess: (updatedPoll) => {
      queryClient.setQueryData(["poll", pollId], updatedPoll);
      queryClient.invalidateQueries({ queryKey: ["polls"] });
    },
    onError: (error) => {
      const code = axios.isAxiosError(error)
        ? error.response?.data?.error?.code
        : undefined;
      if (code === "ALREADY_VOTED" || code === "POLL_CLOSED") {
        queryClient.invalidateQueries({ queryKey: ["poll", pollId] });
      }
    },
  });

  function toggleOption(question: PollQuestion, optionId: number) {
    if (question.allowMultiple) {
      setSelected((prev) =>
        prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId],
      );
    } else {
      const otherIds = question.options.map((o) => o.id);
      setSelected((prev) => [
        ...prev.filter((id) => !otherIds.includes(id)),
        optionId,
      ]);
    }
  }

  const allAnswered = questions.every((q) =>
    q.options.some((o) => selected.includes(o.id)),
  );

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!confirm("ההצבעה סופית ואי אפשר לשנות אותה. להמשיך?")) return;
    mutation.mutate();
  }

  return (
    <form onSubmit={handleSubmit}>
      {questions.map((q) => (
        <fieldset key={q.id}>
          <legend>{q.text}</legend>
          {q.options.map((o) => (
            <label key={o.id}>
              <input
                type={q.allowMultiple ? "checkbox" : "radio"}
                name={`q-${q.id}`}
                checked={selected.includes(o.id)}
                onChange={() => toggleOption(q, o.id)}
              />
              {o.text}
            </label>
          ))}
        </fieldset>
      ))}

      {mutation.isError && (
        <ErrorMessage message={getErrorMessage(mutation.error)} />
      )}

      <button type="submit" disabled={!allAnswered || mutation.isPending}>
        {mutation.isPending ? "שולח..." : "הצבעה"}
      </button>
    </form>
  );
}

export default VoteForm;
