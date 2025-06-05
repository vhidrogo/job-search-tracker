const { relatedLoggerWorkflow } = require("./relatedLogger");

function onInterviewLoggerLogClick() {
    const requiredFields = [
        'Stage',
        'Type',
        'Interview Date',
        'Interviewer Title',
        'Interviewer Name',
    ];

    const defaultsMap = {
        'Stage': 'Recruiter Screen',
        'Type': 'Video Call',
        'Interviewer Title': 'Recruiter'
    };

    const prefixValues = [Utilities.getUuid()];

    relatedLoggerWorkflow({
        relatedName: 'Interview',
        requiredFields: requiredFields,
        defaultsMap: defaultsMap,
        prefixValues: prefixValues
    })
}