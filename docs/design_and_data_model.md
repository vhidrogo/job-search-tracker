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
- **Resumes**: Tracks major and minor resume versions used in applications, and changes over time for version traceability.

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

### Rejections
| Field                | Type    | Description                           |
|:---------------------|:--------|:--------------------------------------|
| Application ID       | String  | Foreign Key                           |
| Rejection Source     | String  | Source of the rejection               |
| Status Date          | Date    | Date notified or system updated       |
| Resume Major Version | String  | Major version of resume applied with  |
| Resume Minor Version | String  | Minor version of resume applied with  |

### Closures
| Field                | Type    | Description                           |
|:---------------------|:--------|:--------------------------------------|
| Application ID       | String  | Foreign Key                           |
| Notified Date        | Date    | Date notified or system updated       |
| Reason               | String  | Reason job was closed                 |
| Resume Major Version | String  | Major version of resume applied with  |
| Resume Minor Version | String  | Minor version of resume applied with  |

### Considerations
| Field                | Type    | Description                                     |
|:---------------------|:--------|:------------------------------------------------|
| Application ID       | String  | Foreign Key                                     |
| Date Initiated       | Date    | Date application became under consideration     |
| Initiation Method    | String  | How the consideration process triggered         |
| Resume Link          | String  | Link to specific resume version doc             |
| JD Link              | String  | Link to saved job description                   |
| Interview Doc Link   | String  | Link to interview notes doc                     |
| Resume Major Version | String  | Major version of resume applied with            |
| Resume Minor Version | String  | Minor version of resume applied with            |

### Ghostings
| Field                | Type    | Description                           |
|:---------------------|:--------|:--------------------------------------|
| Application ID       | String  | Foreign Key                           |
| Last Contact         | String  | Last contact with the company         |
| Resume Major Version | String  | Major version of resume applied with  |
| Resume Minor Version | String  | Minor version of resume applied with  |

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

### Resumes
| Field             | Type    | Description                                      |
|:------------------|:--------|:-------------------------------------------------|
| Major Version     | String  | Major version number (e.g. `v3`)                  |
| Minor Version     | String  | Minor version number (e.g. `v3.2`)                |
| Date              | Date    | Date this resume version was created/edited      |
| Role              | String  | Target job role this resume was tailored for      |
| Link              | String  | Link to the saved resume document                 |
| Changes Doc       | String  | Link to a doc or notes summarizing changes made   |

## Relationships
- Applications → Rejections (1:1)
- Applications → Closures (1:1)
- Applications → Considerations (1:1)
- Applications → Ghostings (1:1)
- Application → Interviews (1:N)
- Interviews → Questions (1:N)
- Applications → Resumes (via embedded Resume Major/Minor Versions — denormalized for immutable historical traceability)

## Benefits of Event-Driven, Normalized Structure
- No redundant updates — records are immutable once created.
- Decoupled processes (e.g., applications vs. interview events).
- Easier analysis and reporting using structured queries.
- Scalable schema for additional future tracking (e.g., rejection reasons, interview feedback).

## Denormalization Note: Resume Versions in Related Tables

Although this system is designed around a normalized, event-driven model, the **Resume Major Version** and **Resume Minor Version** fields are intentionally duplicated in dependent event tables (like Rejections, Considerations, and Ghostings).

**Reason:**  
This simplifies reporting and analysis, particularly within a spreadsheet-based implementation where lookups across multiple tables are more cumbersome and performance-sensitive than in a relational database environment. Embedding resume version identifiers directly into event records allows for straightforward reporting and filtering by resume version without relying on cross-table formulas or complex joins.

**Trade-off:**  
This sacrifices strict normalization in favor of pragmatic, performant reporting within the limitations of spreadsheet formulas. In a SQL-based implementation, this duplication would be unnecessary — resume version metadata would remain centralized in the Applications table, and reporting would rely on query joins.

## Future Improvements
- Build a simple UI for searching Applications, Considerations, and Interview records.
- Visual dashboards for job search progress.

---

This documentation will evolve alongside the system’s implementation. All changes will be versioned in the `Job Search Tracker` GitHub repo.
