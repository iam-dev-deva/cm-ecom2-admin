import React from 'react'

export default function Pagination({
  totalItems,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
}) {
  const pageCount = Math.max(1, Math.ceil(totalItems / pageSize))

  const paginationRange = (() => {
    const maxButtons = 5
    let start = Math.max(1, currentPage - 2)
    let end = Math.min(pageCount, start + maxButtons - 1)
    if (end - start < maxButtons - 1) {
      start = Math.max(1, end - maxButtons + 1)
    }
    return Array.from({ length: end - start + 1 }, (_, index) => start + index)
  })()

  return (
    <div className="table-footer">
      <div className="pagination-info">
        <span>
          {totalItems === 0
            ? 'No items to display.'
            : `Showing ${Math.min((currentPage - 1) * pageSize + 1, totalItems)}-${Math.min(currentPage * pageSize, totalItems)} of ${totalItems}`}
        </span>
        <label>
          Rows per page:
          <select value={pageSize} onChange={onPageSizeChange} className="page-size-select">
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="pagination-controls">
        <button
          type="button"
          className="page-button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {paginationRange.map(page => (
          <button
            key={page}
            type="button"
            className={`page-button ${page === currentPage ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          className="page-button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === pageCount}
        >
          Next
        </button>
      </div>
    </div>
  )
}
