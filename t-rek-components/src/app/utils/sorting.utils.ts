export function sortData<T>(
  data: T[],
  sortColumn: keyof T,
  sortDirection: 'asc' | 'desc',
): T[] {
  return data.slice().sort((a, b) => {
    const valueA = a[sortColumn];
    const valueB = b[sortColumn];

    if (valueA == null) return 1;
    if (valueB == null) return -1;

    const comparison = valueA > valueB ? 1 : valueA < valueB ? -1 : 0;

    return sortDirection === 'asc' ? comparison : -comparison;
  });
}
