const { convert2DArrayToObjects } = require('../../src/utils/convert2DArrayToObjects');

describe('convert2DArrayToObjects', () => {
  it('converts 2D array of values into array of objects', () => {
    const keys = ['id', 'name', 'difficulty'];
    const rows = [
      [1, 'Two Sum', 'Easy'],
      [2, 'Add Two Numbers', 'Medium']
    ];

    const expected = [
      { id: 1, name: 'Two Sum', difficulty: 'Easy' },
      { id: 2, name: 'Add Two Numbers', difficulty: 'Medium' }
    ];

    expect(convert2DArrayToObjects(keys, rows)).toEqual(expected);
  });

  it('throws error if any row length does not match keys length', () => {
    const keys = ['id', 'name'];
    const rows = [
      [1, 'Two Sum'],
      [2, 'Add Two Numbers', 'Medium']
    ];

    // use .toThrow for the specific row that breaks
    expect(() => convert2DArrayToObjects(keys, rows)).toThrow();
  });
});