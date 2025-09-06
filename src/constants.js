const METRIC_LABELS = {
    CompanyView: {
        APPLIED_COUNT: 'Applied Count',
        REJECTION_COUNT: 'Rejection Count',
    }
}

const NAMED_RANGES = {
    APPLICATION_LOGGER: {
        ANALYST_RESUME_ENABLED: 'ApplicationLogger_AnalystResume',
        COMPANY: 'ApplicationLogger_Company',
        RESUME: 'ApplicationLogger_Resume',
    },
    ApplicationView: {
        APPLICATION_DETAIL_OUTPUTS: 'ApplicationView_ApplicationDetailOutputs',
        APPLICATION_FUTURE_INTERVIEWS: 'ApplicationView_FutureInterviews',
        APPLICATION_INTERVIEW_HEADERS: 'ApplicationView_InterviewHeaders',
        APPLICATION_PAST_INTERVIEWS: 'ApplicationView_PastInterviews',
        CONSIDERATION_DETAIL_OUTPUTS: 'ApplicationView_ConsiderationDetailOutputs',
        INTERVIEW_DOC_LINK: 'ApplicationView_InterviewDoc',
        JOB_DESCRIPTION_LINK: 'ApplicationView_JobDescription',
        LISTING_LINK: 'ApplicationView_ListingLink',
        OUTCOME: 'ApplicationView_Outcome',
        SEARCH_CRITERIA_INPUTS: 'ApplicationView_SearchCriteriaInputs',
    },
    DATA: {
        RESUME_TEMPLATE_ANALYST_FILE_ID: 'Data_ResumeTemplateAnalystFileID',
        RESUME_TEMPLATE_FILE_ID: 'Data_ResumeTemplateFileID',
        TAILORED_RESUMES_DRIVE_FOLDER_ID: 'Data_TailoredResumesDriveFolderID',
    },
    CompanyView: {
        COMPANY_NAME: 'CompanyView_CompanyName',
        LATEST_APPLICATIONS: 'CompanyView_LatestApplications',
        METRICS: 'CompanyView_Metrics',
    },
    LatestApplications: {
        APPLICATION_STATUS: 'LatestApplications_ApplicationStatus',
        APPLICATIONS: 'LatestApplications_Applications',
        COUNT: 'LatestApplications_Count',
        DESCENDING: 'LatestApplications_Descending',
        SORT_FIELD: 'LatestApplications_SortField',
    }
}

const SHEET_NAMES = {
    APPLICATIONS: 'Applications',
    CLOSURES: 'Closures',
    CONSIDERATIONS: 'Considerations',
    REJECTIONS: 'Rejections',
}

module.exports = {
    METRIC_LABELS,
    NAMED_RANGES,
    SHEET_NAMES,
}
