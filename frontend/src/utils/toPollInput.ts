import type { PollDetails, PollInput } from "../api/pollsService";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toLocalInputValue(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function toPollInput(poll: PollDetails): PollInput {
  return {
    title: poll.title,
    description: poll.description ?? "",
    category: poll.category,
    closesAt: toLocalInputValue(poll.closesAt),
    questions: poll.questions.map((q) => ({
      text: q.text,
      allowMultiple: q.allowMultiple,
      options: q.options.map((o) => o.text),
    })),
  };
}
