const { filter2DArrayRows } = require("../../src/utils/filter2DArrayRows");

const testData = [
    ['ID', 'Company', 'Location'],
    [1, 'Amazon.com', 'Seattle'],
    [2, 'Google', 'Seattle'],
    [3, 'Microsoft', 'Redmond']
];

describe('filter2DArrayRows', () => {
    it('filters single matching row', () => {
        const criteriaMap = {
            'Company': 'Amazon.com'
        };

        const result = filter2DArrayRows(testData, criteriaMap);

        expect(result).toEqual([
            ['ID', 'Company', 'Location'],
            [1, 'Amazon.com', 'Seattle']
        ]);
    });

    it('filters multiple matching rows', () => {
        const criteriaMap = {
            'Location': 'Seattle'
        };

        const result = filter2DArrayRows(testData, criteriaMap);

        expect(result.length).toBe(3);
    });

    it('filters case insensitive', () => {
        const criteriaMap = {
            'Location': 'seattle'
        };

        const result = filter2DArrayRows(testData, criteriaMap);

        expect(result.length).toBe(3);
    });

    it('filters for partial match', () => {
        const criteriaMap = {
            'Location': 'sea'
        };

        const result = filter2DArrayRows(testData, criteriaMap);

        expect(result.length).toBe(3);
    });

    it('returns empty array when no match', () => {
        const criteriaMap = {
            'Location': 'San Francisco'
        };

        const result = filter2DArrayRows(testData, criteriaMap);

        expect(result.length).toBe(0);
    });

    it('throws error if header not found', () => {
        const criteriaMap = {
            'Invalid': 'Hello world'
        };

        expect(() => {
            filter2DArrayRows(testData, criteriaMap);
        }).toThrow('Required column "Invalid" is missing from the data.');
    });

    it('filters for multiple matching criteria', () => {
        const criteriaMap = {
            'Location': 'Seattle',
            'Company': 'Amazon.com'
        };

        const result = filter2DArrayRows(testData, criteriaMap);

        expect(result.length).toBe(2);
    });

    it('returns empty array when only some criteria match', () => {
        const criteriaMap = {
            'Location': 'Seattle',
            'Company': 'Expedia'
        };

        const result = filter2DArrayRows(testData, criteriaMap);

        expect(result.length).toBe(0);
    });

    it('returns empty array when data is empty', () => {
        const criteriaMap = { 'Company': 'Amazon.com' };
        const result = filter2DArrayRows([], criteriaMap);
        expect(result.length).toBe(0);
    });
});
