const { SHEET_NAMES } = require("../../src/constants");

describe('getApplicationStatus', () => {
    let getApplicationStatus;
    let ApplicationStatus;
    let getColumnDataFromSheet;

    beforeEach(() => {
        jest.resetModules();

        jest.mock('../../src/helpers/dataSheetHelpers', () => {
            const mockFn = jest.fn((sheetName) => {
                const { SHEET_NAMES } = require("../../src/constants");
                if (sheetName === SHEET_NAMES.REJECTIONS) return ['a', 'b'];
                if (sheetName === SHEET_NAMES.CLOSURES) return ['c', 'd'];
                if (sheetName === SHEET_NAMES.CONSIDERATIONS) return ['e', 'f'];
                return [];
            });
            return { getColumnDataFromSheet: mockFn };
        });

        const dataSheetHelpers = require('../../src/helpers/dataSheetHelpers');
        getColumnDataFromSheet = dataSheetHelpers.getColumnDataFromSheet;

        const mod = require('../../src/helpers/getApplicationStatus');
        getApplicationStatus = mod.getApplicationStatus;
        ApplicationStatus = mod.ApplicationStatus;
    });

    it('Correctly returns Rejected status', () => {
        const result = getApplicationStatus('a');
        expect(result).toBe(ApplicationStatus.REJECTED);
    });

    it('Correctly returns Closed status', () => {
        const result = getApplicationStatus('c');
        expect(result).toBe(ApplicationStatus.CLOSED);
    });

    it('Correctly returns Consideration status', () => {
        const result = getApplicationStatus('e');
        expect(result).toBe(ApplicationStatus.CONSIDERED);
    });

    it('Correctly returns No Response status', () => {
        const result = getApplicationStatus('z');
        expect(result).toBe(ApplicationStatus.NONE);
    });

    it('Uses module cached after first call with multiple calls', () => {
        // First call (no cache)
        const result1 = getApplicationStatus('a');
        expect(result1).toBe(ApplicationStatus.REJECTED);
        expect(getColumnDataFromSheet).toHaveBeenCalled();

        // Second call (cache)
        getColumnDataFromSheet.mockClear();
        const result2 = getApplicationStatus('a');
        expect(result2).toBe(ApplicationStatus.REJECTED);
        expect(getColumnDataFromSheet).not.toHaveBeenCalled();
    });
});