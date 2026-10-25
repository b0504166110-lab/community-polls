import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getPolls, getCategories, type PollsFilters } from "../api/pollsService";
import { getErrorMessage } from "../api/client";
import ErrorMessage from "../components/ErrorMessage";
import PollsFiltersBar from "../components/PollsFiltersBar";
import MyPollCard from "../components/MyPollCard";
import Pagination from "../components/Pagination";

function MyPollsList() {
  const [filters, setFilters] = useState<PollsFilters>({
    sort: "newest",
    page: 1,
    mine:true
  });

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["polls", filters],
    queryFn: () => getPolls(filters),
    placeholderData: keepPreviousData,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  function changeFilter(name: keyof PollsFilters, value: string) {
    setFilters((prev) => ({ ...prev, [name]: value || undefined, page: 1 }));
  }

  function goToPage(page: number) {
    setFilters((prev) => ({ ...prev, page }));
  }

  return (
    <div>
      <h2>הסקרים שלי</h2>
      <PollsFiltersBar
        filters={filters}
        categories={categories}
        onChange={changeFilter}
      />

      {isPending ? (
        <p>טוען...</p>
      ) : isError ? (
        <ErrorMessage message={getErrorMessage(error)} />
      ) : data.items.length === 0 ? (
        <p>לא נמצאו סקרים</p>
      ) : (
        <>
          <ul>
            {data.items.map((poll) => (
              <MyPollCard key={poll.id} poll={poll} />
            ))}
          </ul>

          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            onPageChange={goToPage}
          />
        </>
      )}
    </div>
  );
}

export default MyPollsList;
