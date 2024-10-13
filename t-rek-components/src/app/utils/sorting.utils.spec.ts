import { sortData } from './sorting.utils';

interface TestData {
  id: number;
  name: string;
  age: number | undefined;
  score?: number;
}

describe('sortData', () => {
  const data: TestData[] = [
    { id: 3, name: 'Alice', age: 30 },
    { id: 1, name: 'Bob', age: 25, score: 88 },
    { id: 2, name: 'Charlie', age: 35, score: 92 },
    { id: 4, name: 'Dave', age: 28 },
  ];

  it('should sort data ascending by id', () => {
    const sorted = sortData(data, 'id', 'asc');
    expect(sorted.map((item) => item.id)).toEqual([1, 2, 3, 4]);
  });

  it('should sort data descending by id', () => {
    const sorted = sortData(data, 'id', 'desc');
    expect(sorted.map((item) => item.id)).toEqual([4, 3, 2, 1]);
  });

  it('should sort data ascending by name', () => {
    const sorted = sortData(data, 'name', 'asc');
    expect(sorted.map((item) => item.name)).toEqual([
      'Alice',
      'Bob',
      'Charlie',
      'Dave',
    ]);
  });

  it('should sort data descending by age', () => {
    const sorted = sortData(data, 'age', 'desc');
    expect(sorted.map((item) => item.age)).toEqual([35, 30, 28, 25]);
  });

  it('should handle undefined values gracefully', () => {
    const dataWithUndefined: TestData[] = [
      { id: 5, name: 'Eve', age: undefined },
      ...data,
    ];
    const sorted = sortData(dataWithUndefined, 'age', 'asc');
    expect(sorted.map((item) => item.id)).toEqual([1, 4, 3, 2, 5]);
  });

  it('should not mutate the original array', () => {
    const originalData = [...data];
    sortData(data, 'id', 'asc');
    expect(data).toEqual(originalData);
  });
});
