type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  return (
    <div>
      <button onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
        הקודם
      </button>
      <span>
        {" "}
        עמוד {page} מתוך {totalPages}{" "}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        הבא
      </button>
    </div>
  );
}

export default Pagination;
