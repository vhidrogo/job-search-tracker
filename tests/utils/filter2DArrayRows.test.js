const { filter2DArrayRows } = require("../../src/utils/filter2DArrayRows");

const testData = [
    ['ID', 'Company', 'Location'],
    [1, 'Amazon.com', 'Seattle'],
    [2, 'Google', 'Seattle'],
    [3, 'Microsoft', 'Redmond']
];

describe('filter2DArrayRows', () => {
    it('filters single matching row', () => {
        const searchField = 'Company';
        const searchValue = 'Amazon.com';

        result = filter2DArrayRows(testData, searchField, searchValue);

        expect(result).toEqual([
            ['ID', 'Company', 'Location'],
            [1, 'Amazon.com', 'Seattle']
        ]);
    });

    it('filters multiple matching rows', () => {
        const searchField = 'Location';
        const searchValue = 'Seattle';

        result = filter2DArrayRows(testData, searchField, searchValue);

        expect(result.length).toBe(3);
    });

    it('filters case insensitive', () => {
        const searchField = 'Location';
        const searchValue = 'seattle';

        result = filter2DArrayRows(testData, searchField, searchValue);

        expect(result.length).toBe(3);
    });

    it('filters for partial match', () => {
        const searchField = 'Location';
        const searchValue = 'sea';

        result = filter2DArrayRows(testData, searchField, searchValue);

        expect(result.length).toBe(3);
    });

    it('returns empty array when no match', () => {
        const searchField = 'Location';
        const searchValue = 'San Francisco';

        result = filter2DArrayRows(testData, searchField, searchValue);

        expect(result.length).toBe(0);
    });

    it('throws error if search field not found', () => {
        const searchField = 'Invalid';
        const searchValue = 'Hello world';

        expect(() => {
            filter2DArrayRows(testData, searchField, searchValue);
        }).toThrow('Field "Invalid" not found in headers.');
    });
});
