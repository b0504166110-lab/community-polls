import type { Category, PollsFilters } from "../api/pollsService";
import FilterSelect from "./FilterSelect";
import SearchBox from "./SearchBox";

const STATE_OPTIONS = [
  { value: "open", label: "פתוחים" },
  { value: "closed", label: "סגורים" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "החדשים ביותר" },
  { value: "popular", label: "הפופולריים ביותר" },
  { value: "closingSoon", label: "נסגרים בקרוב" },
];

type PollsFiltersBarProps = {
  filters: PollsFilters;
  categories: Category[] | undefined;
  onChange: (name: keyof PollsFilters, value: string) => void;
};

function PollsFiltersBar({ filters, categories, onChange }: PollsFiltersBarProps) {
  return (
    <div>
      <SearchBox onSearch={(text) => onChange("search", text)} />

      <FilterSelect
        value={filters.category}
        options={categories ?? []}
        allLabel="כל הקטגוריות"
        onChange={(v) => onChange("category", v)}
      />

      <FilterSelect
        value={filters.state}
        options={STATE_OPTIONS}
        allLabel="פתוחים וסגורים"
        onChange={(v) => onChange("state", v)}
      />

      <FilterSelect
        value={filters.sort}
        options={SORT_OPTIONS}
        onChange={(v) => onChange("sort", v)}
      />
    </div>
  );
}

export default PollsFiltersBar;
