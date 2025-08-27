# Entity Relationship Diagram (ERD) for Gnzabe-bkbk Project

This document provides a comprehensive Entity Relationship Diagram showing all the database models and their relationships in the project.

## Database Models Overview

The project contains **12 main models** organized into different domains:

- **User Management**: PlatformOwner, Company, User, Department
- **Learning Content**: Course, Tutorial, Quiz
- **Learning Progress**: QuizResult, CoursePurchase
- **System**: Notification, AuditLog, Session

## Complete ERD Diagram

```mermaid
erDiagram
    %% User Management Domain
    PlatformOwner {
        ObjectId _id PK
        String name
        String email UK
        String phoneNumber UK
        String password
        String role "admin|SuperAdmin"
        Boolean isVerified
        Boolean isActive
        Date createdAt
        Date updatedAt
    }

    Company {
        ObjectId _id PK
        String name UK
        String primaryEmail UK
        String secondaryEmail
        String phoneNumber UK
        String logo
        String password
        Boolean isVerified
        Boolean isActive
        Boolean isApproved
        Array departments "embedded"
        Date createdAt
        Date updatedAt
    }

    User {
        ObjectId _id PK
        String fullName
        String email UK
        String phoneNumber UK
        String password
        String role "employee|departmentAdmin"
        ObjectId companyId FK
        ObjectId departmentId FK
        Boolean isVerified
        Boolean isApproved
        Boolean isActive
        Array assignedCourses
        Array learningProgress "embedded"
        Array certifications "embedded"
        Array badges "embedded"
        Array examResults "embedded"
        Array managedEmployees
        Date createdAt
        Date updatedAt
    }

    Department {
        ObjectId _id PK
        String name
        ObjectId companyId FK
        Object departmentAdmin "embedded"
        Array employees "embedded"
        Array coursesAssignedToDepartment
        Boolean isActive
        Date createdAt
    }

    %% Learning Content Domain
    Course {
        ObjectId _id PK
        Object title "en|am"
        String courseCode UK
        Object courseDescription "en|am"
        String courseLevel "Beginner|Intermediate|Advanced"
        String thumbnail
        Number price
        String slug UK
        Boolean isActive
        Date createdAt
    }

    Tutorial {
        ObjectId _id PK
        Object title "en|am"
        ObjectId courseId FK
        Number duration
        String thumbnail
        Object description "en|am"
        Object videoUrl "en|am"
        Array slides "embedded"
        Array prerequisites "en|am"
        Number rating
        Number views
        String level "Beginner|Intermediate|Advanced"
        Array tags "en|am"
        String slug UK
        Boolean isActive
        Date createdAt
    }

    Quiz {
        ObjectId _id PK
        Object title "en|am"
        Object description "en|am"
        Array questions "embedded"
        ObjectId courseId FK
        ObjectId tutorialId FK
        ObjectId createdBy
        Boolean isActive
        Date createdAt
    }

    %% Learning Progress Domain
    QuizResult {
        ObjectId _id PK
        ObjectId quizId FK
        ObjectId companyId FK
        ObjectId employeeId FK
        ObjectId courseId FK
        ObjectId tutorialId FK
        Array answers "embedded"
        Number score
        Number percentage
        Date submittedAt
        Number durationInSeconds
        String feedback
    }

    CoursePurchase {
        ObjectId _id PK
        ObjectId companyId FK
        ObjectId courseId FK
        Number pricePaid
        String currency "ETB|USD"
        Number seats
        Number seatsUsed
        ObjectId transactionId
        String paymentStatus "pending|completed|failed"
        Date purchasedAt
        Date expiresAt
        Boolean isActive
    }

    %% System Domain
    Notification {
        ObjectId _id PK
        ObjectId recipient FK
        String type
        String title
        String message
        Boolean isRead
        Date createdAt
    }

    AuditLog {
        ObjectId _id PK
        Object performedBy "embedded"
        String action
        ObjectId departmentId FK
        ObjectId employeeId FK
        ObjectId companyId FK
        Date timestamp
        Mixed details
        Object requestMetadData "embedded"
        Date createdAt
        Date updatedAt
    }

    Session {
        ObjectId _id PK
        ObjectId userId FK
        Date lastActivityTimestamp
    }

    %% Relationships
    PlatformOwner ||--o{ Company : "manages"
    Company ||--o{ Department : "has"
    Company ||--o{ User : "employs"
    Company ||--o{ CoursePurchase : "purchases"
    Company ||--o{ QuizResult : "has_results"
    Company ||--o{ Notification : "receives"
    Company ||--o{ AuditLog : "audited_in"

    Department ||--o{ User : "contains"
    Department ||--o{ Course : "assigned_courses"

    User ||--o{ QuizResult : "takes_quizzes"
    User ||--o{ Notification : "receives"
    User ||--o{ Session : "has"
    User ||--o{ User : "manages_employees"

    Course ||--o{ Tutorial : "contains"
    Course ||--o{ Quiz : "has_quizzes"
    Course ||--o{ CoursePurchase : "purchased_as"
    Course ||--o{ QuizResult : "quiz_results"

    Tutorial ||--o{ Quiz : "has_quiz"
    Tutorial ||--o{ QuizResult : "quiz_results"

    Quiz ||--o{ QuizResult : "results_in"
```

## Key Relationships Explained

### 1. **PlatformOwner → Company** (1:Many)

- Platform owners manage multiple companies
- Companies are created and approved by platform owners

### 2. **Company → Department** (1:Many)

- Each company can have multiple departments
- Departments are embedded within company documents

### 3. **Company → User** (1:Many)

- Companies employ multiple users
- Users belong to a specific company

### 4. **Department → User** (1:Many)

- Departments contain multiple employees
- Users are assigned to specific departments

### 5. **Course → Tutorial** (1:Many)

- Each course contains multiple tutorials
- Tutorials are organized within courses

### 6. **Course → Quiz** (1:Many)

- Courses can have multiple quizzes
- Quizzes are associated with specific courses and tutorials

### 7. **User → QuizResult** (1:Many)

- Users can take multiple quizzes
- Quiz results track user performance

### 8. **Company → CoursePurchase** (1:Many)

- Companies can purchase multiple courses
- Tracks licensing and seat allocation

## Database Connection Strategy

The project uses **dual database connections**:

- **Local Connection**: User, Company, PlatformOwner, AuditLog
- **Cloud Connection**: Department, Course, Tutorial, Quiz, QuizResult, CoursePurchase, Notification

## Embedded vs Referenced Documents

### Embedded Documents

- **Company.departments**: Department information embedded in company
- **User.learningProgress**: Learning progress embedded in user profile
- **User.certifications**: Certification data embedded in user
- **Quiz.questions**: Quiz questions embedded in quiz document

### Referenced Documents

- **User.companyId**: References Company.\_id
- **User.departmentId**: References Department.\_id
- **Tutorial.courseId**: References Course.\_id
- **QuizResult.quizId**: References Quiz.\_id

## Indexes and Constraints

### Unique Indexes

- Company: `name`, `primaryEmail`, `phoneNumber`
- User: `email`, `phoneNumber`
- Course: `courseCode`, `slug`
- Tutorial: `title.en`, `title.am`, `slug`
- Quiz: `title.en`, `title.am`
- PlatformOwner: `email`, `phoneNumber`

### Composite Indexes

- Department: `{companyId: 1, name: 1}` (unique within company)
- Department: `{departmentAdmin.id: 1}` (unique admin per department)

## Data Flow Patterns

1. **Company Registration**: PlatformOwner → Company → Department → User
2. **Course Management**: Course → Tutorial → Quiz
3. **Learning Progress**: User → Course → Tutorial → Quiz → QuizResult
4. **Audit Trail**: User → Action → AuditLog
5. **Notifications**: System → User/Company → Notification

This ERD represents a comprehensive Learning Management System (LMS) with multi-tenant architecture, role-based access control, and detailed tracking of user learning progress and system activities.
