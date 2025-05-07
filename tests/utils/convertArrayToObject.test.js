const { convertArrayToObject } = require('../../src/utils/convertArrayToObject');

describe('convertArrayToObject', () => {
    it('converts keys and values into an object', () => {
        const keys = ['id', 'name', 'difficulty'];
        const values = [1, 'Two Sum', 'Easy'];
        const expected = { id: 1, name: 'Two Sum', difficulty: 'Easy' };
    
        expect(convertArrayToObject(keys, values)).toEqual(expected);
    });

    it('throws an error when keys and values length differ', () => {
        const keys = ['id', 'name'];
        const values = [1, 'Two Sum', 'Extra'];
    
        expect(() => convertArrayToObject(keys, values)).toThrow('Keys and values arrays must be of the same length.');
    });
});