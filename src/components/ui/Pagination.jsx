// PAGINATION: Previous / numbered buttons / Next.
// It only shows a small window of page numbers around the current page.
export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  const firstNumber = Math.max(1, Math.min(page - 2, totalPages - 4));
  const lastNumber = Math.min(totalPages, firstNumber + 4);

  const numbers = [];
  for (let number = firstNumber; number <= lastNumber; number++) {
    numbers.push(number);
  }

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        className="btn btn--sm"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>

      {numbers.map((number) => (
        <button
          key={number}
          type="button"
          className={"btn btn--sm" + (number === page ? " btn--primary" : "")}
          aria-current={number === page ? "page" : undefined}
          onClick={() => onPageChange(number)}
        >
          {number}
        </button>
      ))}

      <button
        type="button"
        className="btn btn--sm"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </nav>
  );
}
