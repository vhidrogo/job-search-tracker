# Job Search Phases and Metrics Strategy

## Overview

This document formalizes the separation of the job search process into two distinct phases:
- **Landing the Interview**
- **Passing the Interview**

Each phase involves different tables, relationships, metrics, and strategic decisions. This separation replaces prior workflows that relied on visual inspection of data via conditional formatting, moving towards targeted, insight-driven decision-making powered by structured event-driven logging.

---

## Phases of the Job Search

### 📌 Landing the Interview

**Definition:**  
Covers the process from submitting an application to either being considered for an interview, rejected, or being notified of the job being removed from the market.

**Involved Tables and Relationships:**

- `Applications` → `Considerations` (1:1)
- `Applications` → `Rejections` (1:1)
- `Applications` → `Closures` (1:1)

**Metrics Tracked:**

- **Adjusted Application Count**
  - `# of applications minus those that were closed`
- **Consideration Hit Rate**
  - `% of adjusted application count that lead to a consideration`
- **Rejection Rate**
  - `% of adjusted application count that result in rejection without consideration`
- **Hit Rates by Attribute**
  - Breakdown of consideration rates by:
    - Resume version
    - Job source (LinkedIn, Indeed, etc.)
    - Location
    - Role
    - Salary target
    - Skills

**Strategic Decisions Supported:**

- Is a resume revision necessary?
- Are certain job boards more effective?
- Which locations/roles yield better hit rates?
- Should salary expectations be adjusted?
- Are applications with specific skills performing better?

---

### 📌 Passing the Interview

**Definition:**  
Covers the progression from being considered to final outcomes like offer, rejection, or ghosting.

**Involved Tables and Relationships:**

- `Considerations` → `Offers` (1:1)
- `Considerations` → `Rejections` (1:1)
- `Considerations` → `Ghostings` (1:1)
- `Considerations` → `Interviews` (1:N)
- `Interviews` → `Questions` (1:N)

**Metrics Tracked:**

- **Offer Rate**
  - `% of considerations resulting in an offer`
- **Interview-to-Offer Rate**
  - `% of interviews resulting in an offer`
- **Rejection and Ghosting Rates post-Consideration**
- **Interview Type Performance**
  - Coding vs System Design vs Behavioral pass rates
- **Interviewer/Company-specific metrics**

**Strategic Decisions Supported:**

- Identify weak interview types to focus prep time
- Recognize companies or interviewers to avoid
- Detect patterns in ghosting vs rejection rates
- Assess whether interview performance improves over time or by company type

---

## Transition from Visual Inspection to Metrics-Driven Decisions

Previously, conditional formatting in the `Applications` table was used for quick visual inspection of application status. With event-driven logging and the separation of job search phases, those workflows are no longer necessary.

**Key reasons:**

- All applications will eventually reach a terminal state (Rejected, Closed, or Considered).
- Considered applications will further result in Offer, Rejection, or Ghosted.
- Central dashboards and metrics can now surface actionable trends far more effectively than color coding.

---

## Future Improvements

- Centralized dashboard sheet for both phases' metrics.
- Dedicated resume performance reports.
- Interview type performance reports.
- Visualized trends for hit rates, offer rates, and prep focus areas.

---

**This document will evolve alongside the Job Search Tracker system implementation.**
