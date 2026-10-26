import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getAdminPolls, type AdminPollsFilters } from "../api/adminService";
import AdminFiltersBar from "../components/AdminFiltersBar";
import AdminPollCard from "../components/AdminPollCard";
import PollsResults from "../components/PollsResults";

function AdminPage() {
  const [filters, setFilters] = useState<AdminPollsFilters>({
    status: "PENDING",
    page: 1,
  });

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["admin-polls", filters],
    queryFn: () => getAdminPolls(filters),
    placeholderData: keepPreviousData,
  });

  function changeFilter(name: keyof AdminPollsFilters, value: string) {
    const converted = name === "hidden" ? (value === "" ? undefined : value === "true") : value || undefined;
    setFilters((prev) => ({ ...prev, [name]: converted, page: 1 }));
  }

  function goToPage(page: number) {
    setFilters((prev) => ({ ...prev, page }));
  }

  return (
    <div>
      <h2>ניהול סקרים</h2>
      <AdminFiltersBar filters={filters} onChange={changeFilter} />

      <PollsResults
        data={data}
        isPending={isPending}
        isError={isError}
        error={error}
        renderItem={(poll) => <AdminPollCard poll={poll} />}
        onPageChange={goToPage}
      />
    </div>
  );
}

export default AdminPage;
