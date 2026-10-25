import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories, type PollInput, type QuestionInput } from "../api/pollsService";
import { validatePoll } from "../utils/validatePoll";
import FilterSelect from "./FilterSelect";
import ErrorMessage from "./ErrorMessage";
import QuestionEditor from "./QuestionEditor";

const emptyQuestion: QuestionInput = { text: "", allowMultiple: false, options: ["", ""] };

const emptyPoll: PollInput = {
  title: "",
  description: "",
  category: "",
  closesAt: "",
  questions: [emptyQuestion],
};

type PollFormProps = {
  onSubmit: (poll: PollInput) => void;
  isSubmitting: boolean;
  errors: Record<string, string>;
  initialValues?: PollInput;
  submitLabel?: string;
};

function PollForm({ onSubmit, isSubmitting, errors, initialValues = emptyPoll, submitLabel = "שליחה" }: PollFormProps) {
  const [poll, setPoll] = useState<PollInput>(initialValues);
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const shownErrors = Object.keys(clientErrors).length > 0 ? clientErrors : errors;

  function changeField(name: "title" | "description" | "category" | "closesAt", value: string) {
    setPoll((prev) => ({ ...prev, [name]: value }));
  }

  function changeQuestion(qIndex: number, question: QuestionInput) {
    setPoll((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) => (i === qIndex ? question : q)),
    }));
  }

  function addQuestion() {
    setPoll((prev) => ({ ...prev, questions: [...prev.questions, emptyQuestion] }));
  }

  function removeQuestion(qIndex: number) {
    setPoll((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== qIndex),
    }));
  }

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    const data: PollInput = {
      title: poll.title.trim(),
      description: poll.description?.trim() || null,
      category: poll.category,
      closesAt: poll.closesAt ? new Date(poll.closesAt).toISOString() : "",
      questions: poll.questions.map((q) => ({
        text: q.text.trim(),
        allowMultiple: q.allowMultiple,
        options: q.options.map((o) => o.trim()),
      })),
    };

    const found = validatePoll(data);
    setClientErrors(found);
    if (Object.keys(found).length > 0) return;

    onSubmit(data);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>כותרת</label>
        <input
          value={poll.title}
          onChange={(e) => changeField("title", e.target.value)}
        />
        <ErrorMessage message={shownErrors.title} />
      </div>

      <div>
        <label>תיאור</label>
        <textarea
          value={poll.description ?? ""}
          onChange={(e) => changeField("description", e.target.value)}
        />
        <ErrorMessage message={shownErrors.description} />
      </div>

      <div>
        <label>קטגוריה</label>
        <FilterSelect
          value={poll.category}
          options={categories ?? []}
          onChange={(value) => changeField("category", value)}
          allLabel="בחירת קטגוריה"
        />
        <ErrorMessage message={shownErrors.category} />
      </div>

      <div>
        <label>תאריך סגירה</label>
        <input
          type="datetime-local"
          value={poll.closesAt}
          onChange={(e) => changeField("closesAt", e.target.value)}
        />
        <ErrorMessage message={shownErrors.closesAt} />
      </div>

      {poll.questions.map((q, qIndex) => (
        <QuestionEditor
          key={qIndex}
          question={q}
          index={qIndex}
          errors={shownErrors}
          onChange={(question) => changeQuestion(qIndex, question)}
          onRemove={() => removeQuestion(qIndex)}
          canRemove={poll.questions.length > 1}
        />
      ))}

      <button
        type="button"
        onClick={addQuestion}
        disabled={poll.questions.length >= 10}
      >
        הוספת שאלה
      </button>

      <div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "שולח..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default PollForm;
