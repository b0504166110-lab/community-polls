import type { QuestionInput } from "../api/pollsService";
import ErrorMessage from "./ErrorMessage";

type QuestionEditorProps = {
  question: QuestionInput;
  index: number;
  errors: Record<string, string>;
  onChange: (question: QuestionInput) => void;
  onRemove: () => void;
  canRemove: boolean;
};

function QuestionEditor({ question, index, errors, onChange, onRemove, canRemove }: QuestionEditorProps) {
  const { options } = question;

  function changeOption(oIndex: number, value: string) {
    onChange({ ...question, options: options.map((o, j) => (j === oIndex ? value : o)) });
  }

  function addOption() {
    onChange({ ...question, options: [...options, ""] });
  }

  function removeOption(oIndex: number) {
    onChange({ ...question, options: options.filter((_, j) => j !== oIndex) });
  }

  return (
    <fieldset>
      <legend>שאלה {index + 1}</legend>

      <input
        placeholder="טקסט השאלה"
        value={question.text}
        onChange={(e) => onChange({ ...question, text: e.target.value })}
      />
      <ErrorMessage message={errors[`questions.${index}.text`]} />

      <label>
        <input
          type="checkbox"
          checked={question.allowMultiple ?? false}
          onChange={(e) => onChange({ ...question, allowMultiple: e.target.checked })}
        />
        אפשר בחירה מרובה?
      </label>

      {options.map((option, oIndex) => (
        <div key={oIndex}>
          <input
            placeholder={`תשובה ${oIndex + 1}`}
            value={option}
            onChange={(e) => changeOption(oIndex, e.target.value)}
          />
          <button
            type="button"
            onClick={() => removeOption(oIndex)}
            disabled={options.length <= 2}
          >
            מחיקה
          </button>
          <ErrorMessage message={errors[`questions.${index}.options.${oIndex}`]} />
        </div>
      ))}
      <ErrorMessage message={errors[`questions.${index}.options`]} />

      <button type="button" onClick={addOption} disabled={options.length >= 6}>
        הוספת תשובה
      </button>

      <button type="button" onClick={onRemove} disabled={!canRemove}>
        מחיקת שאלה
      </button>
    </fieldset>
  );
}

export default QuestionEditor;
