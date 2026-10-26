import { Fragment, type ReactNode } from "react";
import ErrorMessage from "./ErrorMessage";
import { getErrorMessage } from "../api/client";
import Pagination from "./Pagination";
type PollsResultsProps<T> = {
  data: { items: T[]; page: number; totalPages: number } | undefined;
  isPending: boolean;
  isError: boolean;
  error: unknown;
  renderItem: (poll: T) => ReactNode;
  onPageChange: (page: number) => void;
};

function PollsResults<T extends { id: number }>({
  data,
  isPending,
  isError,
  error,
  renderItem,
  onPageChange,
}: PollsResultsProps<T>) {
return(isError ? (
        <ErrorMessage message={getErrorMessage(error)} />
      ) : isPending || !data ? (
        <p>טוען...</p>
      ) : data.items.length === 0 ? (
        <p>לא נמצאו סקרים</p>
      ) : (
        <>
          <ul>
            {data.items.map((poll) => (
              <Fragment key={poll.id}>{renderItem(poll)}</Fragment>
            ))}
          </ul>

          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            onPageChange={onPageChange}
          />
        </>
      ))
}
export default PollsResults;
