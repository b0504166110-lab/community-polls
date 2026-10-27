type Option = { value: string; label: string };

type FilterSelectProps = {
  value: string | undefined;
  options: Option[];
  onChange: (value: string) => void;
  allLabel?: string;
};

function FilterSelect({
  value,
  options,
  onChange,
  allLabel,
}: FilterSelectProps) {
  return (
    <select value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
      {allLabel && <option value="">{allLabel}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export default FilterSelect;
