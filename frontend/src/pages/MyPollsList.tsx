import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  getPolls,
  getCategories,
  type PollsFilters,
} from "../api/pollsService";
import PollsFiltersBar from "../components/PollsFiltersBar";
import MyPollCard from "../components/MyPollCard";
import PollsResults from "../components/PollsResults";

function MyPollsList() {
  const [filters, setFilters] = useState<PollsFilters>({
    sort: "newest",
    page: 1,
    mine: true,
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
      <PollsResults
        data={data}
        isPending={isPending}
        isError={isError}
        error={error}
        renderItem={(poll) => <MyPollCard poll={poll} />}
        onPageChange={goToPage}
      />
    </div>
  );
}

export default MyPollsList;
