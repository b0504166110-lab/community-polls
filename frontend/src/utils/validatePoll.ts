import type { PollInput } from "../api/pollsService";

const YEAR_MS = 365 * 24 * 60 * 60 * 1000;

// אותם כללים כמו בשרת, כדי לתפוס טעויות לפני השליחה.
// מחזיר שגיאות באותו מבנה כמו השרת: { שם שדה: הודעה }. אובייקט ריק = הכול תקין
export function validatePoll(poll: PollInput): Record<string, string> {
  const errors: Record<string, string> = {};

  if (poll.title.length < 5) errors.title = "הכותרת חייבת להכיל לפחות 5 תווים";
  else if (poll.title.length > 150) errors.title = "הכותרת יכולה להכיל עד 150 תווים";

  if ((poll.description?.length ?? 0) > 500) errors.description = "התיאור יכול להכיל עד 500 תווים";

  if (!poll.category) errors.category = "יש לבחור קטגוריה";

  if (!poll.closesAt) {
    errors.closesAt = "יש לבחור תאריך סגירה";
  } else {
    const time = new Date(poll.closesAt).getTime();
    if (time <= Date.now()) errors.closesAt = "תאריך הסגירה חייב להיות בעתיד";
    else if (time > Date.now() + YEAR_MS) errors.closesAt = "תאריך הסגירה יכול להיות עד שנה מהיום";
  }

  poll.questions.forEach((q, i) => {
    if (q.text.length < 2) errors[`questions.${i}.text`] = "השאלה חייבת להכיל לפחות 2 תווים";
    else if (q.text.length > 150) errors[`questions.${i}.text`] = "השאלה יכולה להכיל עד 150 תווים";

    q.options.forEach((o, j) => {
      if (!o) errors[`questions.${i}.options.${j}`] = "יש למלא את התשובה";
      else if (o.length > 100) errors[`questions.${i}.options.${j}`] = "תשובה יכולה להכיל עד 100 תווים";
    });

    // תשובות זהות (בלי הבדל בין אותיות גדולות לקטנות, כמו בשרת)
    const lower = q.options.filter((o) => o).map((o) => o.toLowerCase());
    if (new Set(lower).size !== lower.length) {
      errors[`questions.${i}.options`] = "אסור שתהיינה שתי תשובות זהות";
    }
  });

  return errors;
}
