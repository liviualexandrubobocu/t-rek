/**
 * Paginates an array of data by returning a subset corresponding to the specified page.
 *
 * @template T - The type of items in the data array.
 *
 * @param {T[]} data - The complete array of data items to paginate.
 * @param {number} currentPage - The current page number (1-based index).
 * @param {number} pageSize - The number of items to display per page.
 *
 * @returns {T[]} A subset of the data array containing items for the specified page.
 *
 * @throws {Error} Throws an error if `currentPage` or `pageSize` is less than 1.
 *
 */
 export function paginateData<T>(
  data: T[],
  currentPage: number,
  pageSize: number,
): T[] {
  if (currentPage < 1) {
    throw new Error('currentPage must be at least 1.');
  }
  if (pageSize < 1) {
    throw new Error('pageSize must be at least 1.');
  }

  const startIndex = (currentPage - 1) * pageSize;
  return data.slice(startIndex, startIndex + pageSize);
}
