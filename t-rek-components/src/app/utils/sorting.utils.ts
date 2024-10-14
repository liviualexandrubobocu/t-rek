/**
 * Sorts an array of data objects based on a specified column and direction.
 *
 * @template T - The type of items in the data array.
 *
 * @param {T[]} data - The array of data items to be sorted.
 * @param {keyof T} sortColumn - The key of the property to sort by.
 * @param {'asc' | 'desc'} sortDirection - The direction to sort the data ('asc' for ascending, 'desc' for descending).
 *
 * @returns {T[]} A new array sorted based on the specified column and direction.
 *
 *  TO DO: 
 *  slice.sort() to be moved to Array.prototype.toSorted() by moving ES to ES2023
 *  Currently didn't work
 */
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
  
      const comparison =
        valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
  
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }
  