import { paginateData } from './pagination.utils';

interface TestData {
  id: number;
  name: string;
}

describe('paginateData', () => {
  const testData: TestData[] = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
    { id: 4, name: 'Item 4' },
    { id: 5, name: 'Item 5' },
    { id: 6, name: 'Item 6' },
    { id: 7, name: 'Item 7' },
    { id: 8, name: 'Item 8' },
    { id: 9, name: 'Item 9' },
    { id: 10, name: 'Item 10' },
  ];

  it('should return the correct page of data (first page)', () => {
    const pageSize = 3;
    const currentPage = 1;
    const paginatedData = paginateData(testData, currentPage, pageSize);

    expect(paginatedData).toEqual([
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' },
    ]);
  });

  it('should return the correct page of data (second page)', () => {
    const pageSize = 3;
    const currentPage = 2;
    const paginatedData = paginateData(testData, currentPage, pageSize);

    expect(paginatedData).toEqual([
      { id: 4, name: 'Item 4' },
      { id: 5, name: 'Item 5' },
      { id: 6, name: 'Item 6' },
    ]);
  });

  it('should return the correct page of data (last page with fewer items)', () => {
    const pageSize = 4;
    const currentPage = 3;
    const paginatedData = paginateData(testData, currentPage, pageSize);

    expect(paginatedData).toEqual([
      { id: 9, name: 'Item 9' },
      { id: 10, name: 'Item 10' },
    ]);
  });

  it('should return an empty array if the page is out of range', () => {
    const pageSize = 5;
    const currentPage = 5; // There is no page 5 with this page size
    const paginatedData = paginateData(testData, currentPage, pageSize);

    expect(paginatedData).toEqual([]);
  });

  it('should return all data if pageSize is larger than the data size', () => {
    const pageSize = 20;
    const currentPage = 1;
    const paginatedData = paginateData(testData, currentPage, pageSize);

    expect(paginatedData).toEqual(testData);
  });
});
