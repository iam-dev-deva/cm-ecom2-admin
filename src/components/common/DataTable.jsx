import React, { useEffect, useMemo, useState } from 'react'

export default function DataTable({
  data = [],
  columns = [],
  loading = false,
  emptyMessage = 'No records available.',
  renderActions,
  searchPlaceholder = 'Search...',
  initialPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const normalizedSearch = searchTerm.trim().toLowerCase()

  const filteredData = useMemo(() => {
    let result = [...data]

    if (normalizedSearch) {
      result = result.filter(row =>
        columns.some(column => {
          const value = column.accessor ? column.accessor(row) : row[column.key]
          return String(value ?? '')
            .toLowerCase()
            .includes(normalizedSearch)
        })
      )
    }

    if (sortConfig.key) {
      const column = columns.find(item => item.key === sortConfig.key)
      if (column?.accessor) {
        result.sort((a, b) => {
          const valueA = column.accessor(a)
          const valueB = column.accessor(b)

          if (valueA == null && valueB == null) return 0
          if (valueA == null) return 1
          if (valueB == null) return -1

          const comparableA = typeof valueA === 'string' ? valueA.toLowerCase() : valueA
          const comparableB = typeof valueB === 'string' ? valueB.toLowerCase() : valueB

          if (comparableA < comparableB) return sortConfig.direction === 'asc' ? -1 : 1
          if (comparableA > comparableB) return sortConfig.direction === 'asc' ? 1 : -1
          return 0
        })
      }
    }

    return result
  }, [columns, data, normalizedSearch, sortConfig])

  const pageCount = Math.max(1, Math.ceil(filteredData.length / pageSize))
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  useEffect(() => {
    if (currentPage > pageCount) {
      setCurrentPage(pageCount)
    }
  }, [currentPage, pageCount])

  const handleSort = key => {
    setSortConfig(current => {
      if (current.key === key) {
        return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
      }

      return { key, direction: 'asc' }
    })
    setCurrentPage(1)
  }

  const handlePageChange = page => {
    if (page < 1 || page > pageCount) return
    setCurrentPage(page)
  }

  const handlePageSizeChange = event => {
    setPageSize(Number(event.target.value))
    setCurrentPage(1)
  }

  const renderCellValue = (row, column) => {
    if (column.render) {
      return column.render(row)
    }

    const value = column.accessor ? column.accessor(row) : row[column.key]
    return value ?? '-'
  }

  return (
    <div className="table-card">
      <div className="table-toolbar">
        <div className="table-status">
          {loading ? 'Loading records...' : `${filteredData.length} record${filteredData.length === 1 ? '' : 's'} found`}
        </div>

        <div className="table-search">
          <input
            type="search"
            value={searchTerm}
            onChange={event => {
              setSearchTerm(event.target.value)
              setCurrentPage(1)
            }}
            placeholder={searchPlaceholder}
            className="search-input"
          />
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map(column => (
                <th key={column.key}>
                  {column.sortable ? (
                    <button
                      type="button"
                      className="sort-button"
                      onClick={() => handleSort(column.key)}
                    >
                      <span>{column.label}</span>
                      <span className="sort-icon">
                        {sortConfig.key === column.key ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
                      </span>
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
              {renderActions ? <th>Actions</th> : null}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + (renderActions ? 1 : 0)} className="empty-state">
                  Loading...
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (renderActions ? 1 : 0)} className="empty-state">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr key={row.id || `${index}-${JSON.stringify(row)}`}>
                  {columns.map(column => (
                    <td key={`${row.id || index}-${column.key}`}>{renderCellValue(row, column)}</td>
                  ))}
                  {renderActions ? <td>{renderActions(row)}</td> : null}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <div className="pagination-info">
          <span>
            {filteredData.length === 0
              ? 'No items to display.'
              : `Showing ${Math.min((currentPage - 1) * pageSize + 1, filteredData.length)}-${Math.min(currentPage * pageSize, filteredData.length)} of ${filteredData.length}`}
          </span>
          <label>
            Rows per page:
            <select value={pageSize} onChange={handlePageSizeChange} className="page-size-select">
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
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {Array.from({ length: pageCount }, (_, index) => index + 1).map(page => (
            <button
              key={page}
              type="button"
              className={`page-button ${page === currentPage ? 'active' : ''}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            className="page-button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pageCount}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
