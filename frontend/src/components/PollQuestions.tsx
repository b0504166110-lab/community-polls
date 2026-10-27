import type { PollQuestion } from "../api/pollsService";

type Props = {
  questions: PollQuestion[];
};

function PollQuestions({ questions }: Props) {
  return (
    <div>
      {questions.map((q) => (
        <fieldset key={q.id}>
          <legend>
            {q.text}
            {q.allowMultiple && " (אפשר לבחור כמה תשובות)"}
          </legend>
          {q.options.map((o) => (
            <p key={o.id}>{o.text}</p>
          ))}
        </fieldset>
      ))}
    </div>
  );
}

export default PollQuestions;
