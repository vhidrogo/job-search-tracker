# Job Search Tracking System: Design & Data Model

## Overview
A normalized, event-driven tracking system designed to capture the full lifecycle of a job search process — from application submission to interview stages, coding questions asked, and final offers. This model supports robust data analysis, historical reporting, and decoupled data management.

## Key Concepts
- **Applications**: Job applications sent out.
- **Rejections**: Updates indicating not selected for the role.
- **Closures**: Updates notifying job removed from market for any reason.
- **Considerations**: Next steps follow-ups after an application (e.g., application Considerations, recruiter reach outs).
- **Ghostings**: Communication cut off after consideration talks.
- **Interviews**: Each distinct interview event, with type, stage, and notes.
- **Questions**: Coding or behavioral questions asked during interviews.

## Data Model (Tables)

### Applications
| Field                | Type    | Description                           |
|:---------------------|:--------|:--------------------------------------|
| ID                   | String  | Primary Key                           |
| Applied Date         | Date    | Date application was submitted        |
| Job Source           | String  | Where the job was sourced from        |
| Role                 | String  | Standardized job title                |
| Listing Job Title    | String  | Job title as stated on listing        |
| Company              | String  | Name of company applied to            |
| Link                 | String  | Link to job listing                   |
| Yrs XP Min           | Number  | Minimum years experience required     |
| Salary Min           | Number  | Salary range minimum from listing     |
| Salary Max           | Number  | Salary range maximum from listing     |
| Matching Skills      | String  | Tools/languages/frameworks you already have experience with     |
| Matching Experience  | String  | Relevant domain/industry/role experience you already possess    |
| Missing Skills       | String  | Required tools/languages not in your skill set                |
| Missing Experience   | String  | Required domain/industry/role experience not in your background|
| Specialization       | String  | Optional specialization i.e. backend  |
| Desired Salary       | Number  | Requested salary expectations answer  |
| Resume Major Version | String  | Major version of resume applied with  |
| Resume Minor Version | String  | Minor version of resume applied with  |
| Notes                | String  | Miscellaneous notes to track          |
| Rejected             | String  | "Yes" if the application is found in the "Rejections" table. |
| Closed               | String  | "Yes" if the application is found in the "Closures" table. |
| Considered           | String  | "Yes" if the application is found in the "Considerations" table. |

### Rejections
| Field                | Type    | Description                           |
|:---------------------|:--------|:--------------------------------------|
| Application ID       | String  | Foreign Key                           |
| Rejection Source     | String  | Source of the rejection               |
| Status Date          | Date    | Date notified or system updated       |

### Closures
| Field                | Type    | Description                           |
|:---------------------|:--------|:--------------------------------------|
| Application ID       | String  | Foreign Key                           |
| Notified Date        | Date    | Date notified or system updated       |
| Reason               | String  | Reason job was closed                 |

### Considerations
| Field                | Type    | Description                                     |
|:---------------------|:--------|:------------------------------------------------|
| Application ID       | String  | Foreign Key                                     |
| Date Initiated       | Date    | Date application became under consideration     |
| Initiation Method    | String  | How the consideration process triggered         |
| Rejected             | String  | "Yes" if the consideration was later rejected   |
| Ghosted              | String  | "Yes" if communication stopped after this stage |
| Offer                | String  | "Yes" if the consideration resulted in an offer |

### Ghostings
| Field                | Type    | Description                           |
|:---------------------|:--------|:--------------------------------------|
| Application ID       | String  | Foreign Key                           |
| Last Contact         | String  | Last contact with the company         |

### Interviews
| Field             | Type    | Description                                     |
|:------------------|:--------|:------------------------------------------------|
| Interview ID      | String  | Primary Key                                     |
| Application ID    | String  | Foreign Key                                     |
| Stage             | String  | (e.g., "Loop", "Technical Screen")              |
| Type              | String  | (e.g., "Coding", "Behavioral", "System Design") |
| Interview Date    | Date    | Date of interview                               |

### Questions
| Field             | Type    | Description                           |
|:------------------|:--------|:--------------------------------------|
| Interview ID      | String  | Foreign Key                           |
| Type              | String  | ("Coding", "Behavioral")              |
| Description       | String  | Question description                  |
| Notes             | String  | Any notes about the question/answer   |

### Offers
| Field                | Type    | Description                           |
|:---------------------|:--------|:--------------------------------------|
| Application ID       | String  | Foreign Key                           |
| Offer Date           | Date    | Date offer was extended               |
| Cash Salary          | Number  | Base annual cash salary               |
| Signing Bonus        | Number  | One-time signing bonus amount         |
| Annual Bonus         | Number  | Annual performance bonus target       |
| Stock Compensation   | Number  | Estimated annualized stock value      |
| 401K Company Match   | String  | Description of 401K match program     |
| PTO Days             | Number  | Number of paid time off days          |
| Holidays             | Number  | Number of paid holidays               |
| Medical Covered      | String  | Description of medical coverage       |
| Dental Covered       | String  | Description of dental coverage        |
| Vision Covered       | String  | Description of vision coverage        |
| Other Benefit Notes  | String  | Any additional perks or benefits      |

### Resumes
| Field             | Type    | Description                           |
|:------------------|:--------|:--------------------------------------|
| Major Version     | String  | Major version of the resume           |
| Minor Version     | String  | Minor version of the resume           |
| Date              | Date    | Date the resume version was created   |
| Role              | String  | Role this resume version applies to   |
| Link              | String  | Link to the resume document           |
| Changes Doc       | String  | Link to document detailing changes in this version |

## Reverse Foreign Keys
In the **Applications** table, additional columns have been introduced to track reverse foreign keys for related events. These columns use the `IF(ISNUMBER(MATCH()))` formula to check whether an application has corresponding records in the **Rejections** and **Considerations** tables. The result is displayed as "Yes" for any matches, simplifying reporting without having to duplicate data across tables.

For example, the **Rejected** column in the **Applications** table uses the following formula:
```excel
=IF(ISNUMBER(MATCH(A2, Rejections_Application_ID, 0)), "Yes", "")
```

Where A2 refers to the Application ID and "Rejections_Application_ID" is named range referencing the `Application ID` column in `Rejections`. This approach allows easy summarization of related events and attributes, such as calculating rejection rates by job source or tracking application outcomes, without the need for heavy normalization.

## Relationships
- Applications → Rejections (1:1)
- Applications → Closures (1:1)
- Applications → Considerations (1:1)
- Applications → Ghostings (1:1)
- Applications → Offers (1:1)
- Applications → Interviews (1:N)
- Interviews → Questions (1:N)
- Considerations → Rejections (1:1)
- Considerations → Ghostings (1:1)
- Considerations → Offers (1:1)

## Benefits of Event-Driven, Normalized Structure
- No redundant updates — records are immutable once created.
- Decoupled processes (e.g., applications vs. interview events).
- Easier analysis and reporting using structured queries.
- Scalable schema for additional future tracking (e.g., rejection reasons, interview feedback).

## Future Improvements
- Build a simple UI for searching Applications, Considerations, and Interview records.
- Visual dashboards for job search progress.

---

This documentation will evolve alongside the system’s implementation. All changes will be versioned in the Job Search Tracker GitHub repo.
