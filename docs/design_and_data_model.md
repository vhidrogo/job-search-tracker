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
| Yrs XP Min           | Number  | Minimum years experience require      |
| Salary Min           | Number  | Salary range minimum from listing     |
| Salary Max           | Number  | Salary range maximum from listing     |
| Matching Skills      | String  | Tools/languages/frameworks you already have experience with     |
| Matching Experience  | String  | Relevant domain/industry/role experience you already possess    |
| Skill Gaps           | String  | Required tools/languages not in your skill set                |
| Experience Gaps      | String  | Required domain/industry/role experience not in your background|
| Specialization       | String  | Optional specialization i.e. backend  |
| Desired Salary       | Number  | Requested salary expectations answer  |
| Resume Version       | String  | Resume version applied with           |
| Notes                | String  | Miscellaneous notes to track          |

### Rejections
| Field             | Type    | Description                           |
|:------------------|:--------|:--------------------------------------|
| Application ID    | String  | Foreign Key                           |
| Rejection Source  | String  | Source of the rejection               |
| Status Date       | Date    | Date notified or system updated       |

### Closures
| Field             | Type    | Description                           |
|:------------------|:--------|:--------------------------------------|
| Application ID    | String  | Foreign Key                           |
| Notified Date     | Date    | Date notified or system updated       |
| Reason            | String  | Reason job was closed                 |

### Considerations
| Field             | Type    | Description                                     |
|:------------------|:--------|:------------------------------------------------|
| Application ID    | String  | Foreign Key                                     |
| Date Initiated    | Date    | Date application became under consideration     |
| Initiation Method | String  | How the consideration process triggered         |
| Resume Link       | String  | Link to specific resume version doc             |
| JD Link           | String  | Link to saved job description                   |
| Interview Doc Link| String  | Link to interview notes doc                     |

### Ghostings
| Field             | Type    | Description                           |
|:------------------|:--------|:--------------------------------------|
| Application ID    | String  | Foreign Key                           |
| Last Contact      | String  | Last contact with the compa           |

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

## Relationships
- Applications → Rejections (1:1)
- Applications → Closures (1:1)
- Applications → Considerations (1:1)
- Applications → Ghostings (1:1)
- Application → Interviews (1:N)
- Interviews → Questions (1:N)

## Benefits of Event-Driven, Normalized Structure
- No redundant updates — records are immutable once created.
- Decoupled processes (e.g., applications vs. interview events).
- Easier analysis and reporting using structured queries.
- Scalable schema for additional future tracking (e.g., rejection reasons, interview feedback).

## Future Improvements
- Build a simple UI for searching Applications, Considerations, and Interview records.
- Visual dashboards for job search progress.

---

This documentation will evolve alongside the system’s implementation. All changes will be versioned in the `Job Search Tracker` GitHub repo.
