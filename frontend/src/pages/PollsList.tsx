import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getPolls, getCategories, type PollsFilters } from "../api/pollsService";
import PollsFiltersBar from "../components/PollsFiltersBar";
import PollCard from "../components/PollCard";
import PollsResults from "../components/PollsResults";

function PollsList() {
  const [filters, setFilters] = useState<PollsFilters>({
    sort: "newest",
    page: 1,
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
        renderItem={(poll) => <PollCard poll={poll} />}
        onPageChange={goToPage}
      />
    </div>
  );
}

export default PollsList;
