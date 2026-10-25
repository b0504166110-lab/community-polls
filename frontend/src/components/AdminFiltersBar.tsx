import type { AdminPollsFilters } from "../api/adminService";
import FilterSelect from "./FilterSelect";
import SearchBox from "./SearchBox";

const STATUS_OPTIONS = [
  { value: "PENDING", label: "ממתינים" },
  { value: "APPROVED", label: "מאושרים" },
  { value: "REJECTED", label: "נדחו" },
];

const HIDDEN_OPTIONS = [
  { value: "true", label: "מוסתרים" },
  { value: "false", label: "גלויים" },
];

type AdminFiltersBarProps = {
  filters: AdminPollsFilters;
  onChange: (name: keyof AdminPollsFilters, value: string) => void;
};

function AdminFiltersBar({ filters, onChange }: AdminFiltersBarProps) {
  return (
    <div>
      <SearchBox onSearch={(text) => onChange("search", text)} />

      <FilterSelect
        value={filters.status}
        options={STATUS_OPTIONS}
        allLabel="כל הסטטוסים"
        onChange={(v) => onChange("status", v)}
      />

      <FilterSelect
        value={filters.hidden === undefined ? undefined : String(filters.hidden)}
        options={HIDDEN_OPTIONS}
        allLabel="מוסתרים וגלויים"
        onChange={(v) => onChange("hidden", v)}
      />
    </div>
  );
}

export default AdminFiltersBar;
