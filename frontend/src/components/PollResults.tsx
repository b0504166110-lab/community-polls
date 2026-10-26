import { lazy, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { getResults } from "../api/pollsService";
import { getErrorMessage } from "../api/client";
import ErrorMessage from "./ErrorMessage";

const QuestionChart = lazy(() => import("./QuestionChart"));

type Props = {
  pollId: number;
};

function PollResults({ pollId }: Props) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["results", pollId],
    queryFn: () => getResults(pollId),
  });

  if (isPending) return <p>טוען תוצאות...</p>;
  if (isError) return <ErrorMessage message={getErrorMessage(error)} />;

  return (
    <div>
      <h3>תוצאות ({data.totalVoters} מצביעים)</h3>

      {/* דיאגרמה נפרדת לכל שאלה */}
      <Suspense fallback={<p>טוען דיאגרמות...</p>}>
        {data.questions.map((q) => (
          <QuestionChart key={q.id} question={q} myChoices={data.myChoices} />
        ))}
      </Suspense>
    </div>
  );
}

export default PollResults;
