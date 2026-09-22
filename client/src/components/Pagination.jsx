// Page numbers around the current page, for example: 3 4 [5] 6 7
function getPageNumbers(currentPage, totalPages) {
  const firstPage = Math.max(
    1,
    Math.min(currentPage - 2, totalPages - 4)
  );

  const lastPage = Math.min(totalPages, firstPage + 4);

  const pages = [];

  for (let page = firstPage; page <= lastPage; page += 1) {
    pages.push(page);
  }

  return pages;
}

function Pagination({
  currentPage,
  totalPages,
  start,
  end,
  total,
  onPageChange,
  disabled = false,
}) {
  return (
    <div className="pagination">
      <p className="pagination-info">
        Showing {start}–{end} of {total}
      </p>

      {totalPages > 1 && (
        <div className="pagination-buttons">
          <button
            type="button"
            className="secondary-button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={disabled || currentPage === 1}
          >
            Previous
          </button>

          {getPageNumbers(currentPage, totalPages).map((page) => (
            <button
              key={page}
              type="button"
              className={
                page === currentPage
                  ? "page-button page-button-active"
                  : "page-button"
              }
              onClick={() => onPageChange(page)}
              disabled={disabled}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            className="secondary-button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={disabled || currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Pagination;
