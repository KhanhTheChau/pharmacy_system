import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown, faList } from '@fortawesome/free-solid-svg-icons';

export type Column<T> = {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  sortValue?: (row: T) => unknown;
};

type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  title?: string;
  onRowClick?: (row: T) => void;
  selectedRowId?: string | number;
  rowKey: keyof T;
};

// type SortOrder = 'asc' | 'desc';
type SortOrder = 'asc' | 'desc' | 'none';

function DataTable<T extends object>({
  data,
  columns,
  title,
  onRowClick,
  selectedRowId,
  rowKey,
}: DataTableProps<T>) {

  const [sortKey, setSortKey] = React.useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = React.useState<SortOrder>('asc');

  const handleRowClick = (row: T) => {
    if (onRowClick) {
      onRowClick(row); 
    }
  };

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      let nextOrder: SortOrder;

      if (sortOrder === 'asc') nextOrder = 'desc';
      else if (sortOrder === 'desc') nextOrder = 'none';
      else nextOrder = 'asc';

      setSortOrder(nextOrder);

      if (nextOrder === 'none') {
        setSortKey(null);
      }
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };



  const sortedData = React.useMemo(() => {
    if (!sortKey) return [...data];

    const col = columns.find((c) => c.key === sortKey);
    if (!col) return [...data];

    return [...data].sort((a, b) => {
      const getValue = (row: T) =>
        col.sortValue ? col.sortValue(row) : row[sortKey];

      const aVal = getValue(a);
      const bVal = getValue(b);

      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return sortOrder === 'asc'
        ? String(aVal).localeCompare(String(bVal), 'vi', { numeric: true })
        : String(bVal).localeCompare(String(aVal), 'vi', { numeric: true });
    });
  }, [data, sortKey, sortOrder, columns]);


  return (
    <div className=''>
      {title && 
      <h2 className="font-bold text-2xl mb-5"> 
      <FontAwesomeIcon icon={faList} className="mr-2 w-5 h-5" />
         {title}
         </h2>}
      {data.length === 0 ? (
        <div className="flex justify-center items-center h-40">
          <svg className="animate-spin h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <span className="ml-2 text-gray-500">Đang tải dữ liệu...</span>
        </div>
      ) : (
        <div className="overflow-x-auto overflow-y-auto max-h-[90vh] max-w-[60vw]">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                {columns.map((col) => (
                  <th key={String(col.key)} className="border border-gray-300 px-4 py-2 text-left" onClick={() => handleSort(col.key)}>
                    <div className="flex items-center gap-1">
                      {col.label}
                      {sortKey === col.key && (
                        <span className="ml-1 text-sm">
                          <FontAwesomeIcon
                            icon={
                              sortKey === col.key
                                ? sortOrder === 'asc'
                                  ? faSortUp
                                  : faSortDown
                                : faSort
                            }
                          />

                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedData.map((row, idx) => {
                const isSelected = selectedRowId !== undefined && row[rowKey] === selectedRowId;
                return (
                  <tr
                    key={idx}
                    className={`hover:bg-gray-100 cursor-pointer ${isSelected ? 'bg-gray-200' : ''}`}
                    onClick={() => handleRowClick(row)}
                  >
                    {columns.map((col) => (
                      <td key={String(col.key)} className="border border-gray-300 px-4 py-2">
                        {col.render
                          ? col.render(row[col.key], row)
                          : String(row[col.key as keyof T] ?? 'N/A')}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DataTable;