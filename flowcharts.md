# Gnezabe Security Training Platform - Flowcharts

## 1. User Registration & Onboarding Flow

```mermaid
flowchart TD
    Start([User Starts Registration]) --> FillForm[Fill Registration Form]
    FillForm --> ValidateInput{Validate Input Fields}

    ValidateInput -->|Invalid| ShowErrors[Display Validation Errors]
    ShowErrors --> FillForm

    ValidateInput -->|Valid| CheckEmail{Email Already Exists?}
    CheckEmail -->|Yes| ShowEmailError[Show Email Already Exists Error]
    ShowEmailError --> FillForm

    CheckEmail -->|No| CheckPhone{Phone Already Exists?}
    CheckPhone -->|Yes| ShowPhoneError[Show Phone Already Exists Error]
    CheckPhoneError --> FillForm

    CheckPhone -->|No| CreateUser[Create User Record]
    CreateUser --> GenerateToken[Generate Verification Token]
    GenerateToken --> SaveUser[Save User with Token]
    SaveUser --> QueueEmail[Queue Verification Email]
    QueueEmail --> SendNotification[Send Approval Request Notification]
    SendNotification --> Success[Registration Success]

    Success --> WaitApproval{Wait for Admin Approval}
    WaitApproval -->|Pending| ShowPending[Show Pending Status]
    WaitApproval -->|Approved| EmailVerification[Email Verification Required]

    EmailVerification --> ClickLink{User Clicks Email Link?}
    ClickLink -->|No| ResendEmail[Resend Verification Email]
    ResendEmail --> EmailVerification

    ClickLink -->|Yes| VerifyEmail[Verify Email Token]
    VerifyEmail --> TokenValid{Token Valid?}
    TokenValid -->|No| TokenExpired[Token Expired - Generate New]
    TokenExpired --> QueueEmail

    TokenValid -->|Yes| MarkVerified[Mark Email as Verified]
    MarkVerified --> Complete[Registration Complete]

    Complete --> Login[User Can Now Login]
```

## 2. User Authentication & Login Flow

```mermaid
flowchart TD
    Start([User Access Login]) --> EnterCredentials[Enter Email & Password]
    EnterCredentials --> ValidateFields{Fields Valid?}

    ValidateFields -->|No| ShowFieldErrors[Show Field Validation Errors]
    ShowFieldErrors --> EnterCredentials

    ValidateFields -->|Yes| SubmitLogin[Submit Login Request]
    SubmitLogin --> RateLimit{Rate Limit Exceeded?}

    RateLimit -->|Yes| ShowRateLimit[Show Rate Limit Error]
    ShowRateLimit --> Wait[Wait for Rate Limit Reset]
    Wait --> SubmitLogin

    RateLimit -->|No| FindUser[Find User by Email]
    FindUser --> UserExists{User Exists?}

    UserExists -->|No| ShowUserError[Show Invalid Credentials Error]
    ShowUserError --> EnterCredentials

    UserExists -->|Yes| CheckPassword[Verify Password Hash]
    CheckPassword --> PasswordValid{Password Valid?}

    PasswordValid -->|No| ShowPasswordError[Show Invalid Credentials Error]
    ShowPasswordError --> EnterCredentials

    PasswordValid -->|Yes| CheckVerified{Email Verified?}
    CheckVerified -->|No| ShowVerificationError[Show Email Verification Required]
    ShowVerificationError --> EmailVerification[Redirect to Email Verification]

    CheckVerified -->|Yes| CheckApproved{Admin Approved?}
    CheckApproved -->|No| ShowApprovalError[Show Pending Approval Message]
    ShowApprovalError --> WaitApproval[Wait for Approval]

    CheckApproved -->|Yes| GenerateJWT[Generate JWT Token]
    GenerateJWT --> StoreSession[Store Session in Redis]
    StoreSession --> UpdateLastLogin[Update Last Login Time]
    UpdateLastLogin --> LoginSuccess[Login Successful]

    LoginSuccess --> Redirect[Redirect to Dashboard]
    Redirect --> WebSocket[Establish WebSocket Connection]
    WebSocket --> Active[User Session Active]
```

## 3. Course Access & Learning Flow (Department-Based Access)

```mermaid
flowchart TD
    Start([User Access Course System]) --> CheckAuth{User Authenticated?}

    CheckAuth -->|No| RedirectLogin[Redirect to Login]
    RedirectLogin --> Login[User Login Process]
    Login --> CheckAuth

    CheckAuth -->|Yes| CheckDepartment{User Has Department?}
    CheckDepartment -->|No| ShowNoDepartment[Show No Department Assigned Error]
    ShowNoDepartment --> End([End])

    CheckDepartment -->|Yes| GetDepartmentCourses[Get Department's Assigned Courses]
    GetDepartmentCourses --> LoadDepartment[Load Department with coursesAssignedToDepartment]
    LoadDepartment --> DisplayCourses[Display Department's Assigned Courses]

    DisplayCourses --> SelectCourse{User Selects Course?}
    SelectCourse -->|No| DisplayCourses

    SelectCourse -->|Yes| CheckCourseAccess{Is Course in Department's Assigned Courses?}
    CheckCourseAccess -->|No| ShowAccessDenied[Show Access Denied - Course Not Assigned to Department]
    ShowAccessDenied --> DisplayCourses

    CheckCourseAccess -->|Yes| LoadCourse[Load Course Content]
    LoadCourse --> CheckProgress{Check User Progress in learningProgress}
    CheckProgress --> ResumePoint[Resume from Last Point or Start New]

    ResumePoint --> DisplayContent[Display Course Content]
    DisplayContent --> UserAction{User Action}

    UserAction -->|Mark Complete| UpdateProgress[Update Progress in learningProgress]
    UpdateProgress --> SaveProgress[Save to Database]
    SaveProgress --> CheckCompletion{Course Complete?}

    CheckCompletion -->|Yes| MarkCourseComplete[Mark Course as Completed]
    CheckCompletion -->|No| ContinueLearning[Continue Learning]

    UserAction -->|Next Lesson| NextLesson[Load Next Lesson]
    NextLesson --> DisplayContent

    UserAction -->|Take Quiz| QuizFlow[Start Quiz Process]
    QuizFlow --> QuizComplete{Quiz Complete?}
    QuizComplete -->|Yes| UpdateProgress
    QuizComplete -->|No| ContinueQuiz[Continue Quiz]
```

## 4. Quiz Taking & Assessment Flow

```mermaid
flowchart TD
    Start([User Starts Quiz]) --> CheckPrerequisites{Prerequisites Met?}

    CheckPrerequisites -->|No| ShowPrerequisites[Show Prerequisites Required]
    ShowPrerequisites --> End([End])

    CheckPrerequisites -->|Yes| LoadQuiz[Load Quiz Questions]
    LoadQuiz --> DisplayQuiz[Display Quiz Interface]
    DisplayQuiz --> Timer{Time Limit Set?}

    Timer -->|Yes| StartTimer[Start Countdown Timer]
    Timer -->|No| ContinueQuiz

    StartTimer --> ContinueQuiz[User Answers Questions]
    ContinueQuiz --> AllAnswered{All Questions Answered?}

    AllAnswered -->|No| ContinueQuiz
    AllAnswered -->|Yes| SubmitQuiz[Submit Quiz]

    Timer -->|Time Expired| AutoSubmit[Auto-Submit Quiz]
    AutoSubmit --> SubmitQuiz

    SubmitQuiz --> ValidateSubmission{Validate Submission}
    ValidateSubmission -->|Invalid| ShowValidationError[Show Validation Errors]
    ShowValidationError --> ContinueQuiz

    ValidateSubmission -->|Valid| ProcessResults[Process Quiz Results]
    ProcessResults --> CalculateScore[Calculate Score & Percentage]
    CalculateScore --> DeterminePassFail{Score >= 70%?}

    DeterminePassFail -->|Yes| MarkPassed[Mark as Passed]
    DeterminePassFail -->|No| MarkFailed[Mark as Failed]

    MarkPassed --> UpdateLearningProgress[Update User Learning Progress]
    MarkFailed --> UpdateLearningProgress

    UpdateLearningProgress --> SaveQuizResult[Save Quiz Result to Database]
    SaveQuizResult --> UpdateTutorialProgress[Update Tutorial Progress]
    UpdateTutorialProgress --> UpdateCourseProgress[Update Course Progress]

    UpdateCourseProgress --> SaveUserProgress[Save Updated Progress to User Model]
    SaveUserProgress --> SendNotification[Send Completion Notification]
    SendNotification --> DisplayResults[Display Results with Pass/Fail Status]

    DisplayResults --> ShowDetailedResults[Show Detailed Results]
    ShowDetailedResults --> End

    %% Learning Progress Update Details
    UpdateLearningProgress --> UpdateQuizProgress[Update Quiz Progress in learningProgress]
    UpdateQuizProgress --> CalculateTutorialProgress[Calculate Tutorial Progress Based on Passed Quizzes]
    CalculateTutorialProgress --> CalculateCourseProgress[Calculate Course Progress Based on Completed Tutorials]
    CalculateCourseProgress --> MarkCourseComplete{Course Progress >= 100%?}

    MarkCourseComplete -->|Yes| MarkCourseCompleted[Mark Course as Completed]
    MarkCourseComplete -->|No| ContinueTracking[Continue Progress Tracking]

    MarkCourseCompleted --> End
    ContinueTracking --> End
```

## 5. File Upload & Processing Flow

```mermaid
flowchart TD
    Start([User Initiates File Upload]) --> SelectFile[Select File]
    SelectFile --> ValidateFile{File Selected?}

    ValidateFile -->|No| ShowFileError[Show File Selection Error]
    ShowFileError --> SelectFile

    ValidateFile -->|Yes| CheckFileType{File Type Supported?}
    CheckFileType -->|No| ShowTypeError[Show Unsupported File Type Error]
    ShowTypeError --> SelectFile

    CheckFileType -->|Yes| CheckFileSize{File Size Within Limit?}
    CheckFileSize -->|No| ShowSizeError[Show File Size Limit Error]
    ShowSizeError --> SelectFile

    CheckFileSize -->|Yes| UploadFile[Upload File to Server]
    UploadFile --> UploadSuccess{Upload Successful?}

    UploadSuccess -->|No| ShowUploadError[Show Upload Error]
    ShowUploadError --> SelectFile

    UploadSuccess -->|Yes| ProcessFile[Process File]
    ProcessFile --> FileType{File Type?}

    FileType -->|Image| ProcessImage[Process Image]
    FileType -->|Video| ProcessVideo[Process Video]
    FileType -->|Document| ProcessDocument[Process Document]

    ProcessImage --> ResizeImage[Resize Image if Needed]
    ResizeImage --> GenerateThumbnail[Generate Thumbnail]

    ProcessVideo --> ExtractMetadata[Extract Video Metadata]
    ExtractMetadata --> GenerateThumbnails[Generate Video Thumbnails]

    ProcessDocument --> ExtractText[Extract Text Content]
    ExtractText --> GeneratePreview[Generate Preview]

    GenerateThumbnail --> StoreFile[Store File in Storage]
    GenerateThumbnails --> StoreFile
    GeneratePreview --> StoreFile

    StoreFile --> SaveMetadata[Save File Metadata to Database]
    SaveMetadata --> UpdateUserQuota[Update User Storage Quota]
    UpdateUserQuota --> CheckQuota{Quota Exceeded?}

    CheckQuota -->|Yes| ShowQuotaError[Show Storage Quota Exceeded Error]
    ShowQuotaError --> DeleteFile[Delete Uploaded File]
    DeleteFile --> End([End])

    CheckQuota -->|No| UploadComplete[Upload Complete]
    UploadComplete --> ReturnURLs[Return File URLs]
    ReturnURLs --> Success[Upload Success]
    Success --> End
```

## 6. Email Notification & Queue Processing Flow

```mermaid
flowchart TD
    Start([System Event Occurs]) --> DetermineType{Event Type?}

    DetermineType -->|User Registration| RegistrationEmail[Registration Email]
    DetermineType -->|Password Reset| PasswordResetEmail[Password Reset Email]
    DetermineType -->|Course Invitation| InvitationEmail[Course Invitation Email]
    DetermineType -->|Quiz Completion| QuizCompletionEmail[Quiz Completion Email]
    DetermineType -->|System Notification| SystemEmail[System Notification Email]

    RegistrationEmail --> PrepareEmail[Prepare Email Content]
    PasswordResetEmail --> PrepareEmail
    InvitationEmail --> PrepareEmail
    QuizCompletionEmail --> PrepareEmail
    SystemEmail --> PrepareEmail

    PrepareEmail --> ValidateEmail{Email Valid?}
    ValidateEmail -->|No| LogError[Log Email Validation Error]
    LogError --> End([End])

    ValidateEmail -->|Yes| AddToQueue[Add to Email Queue]
    AddToQueue --> QueueStatus{Queue Status}

    QueueStatus -->|Queue Full| RetryLater[Retry Later]
    RetryLater --> Wait[Wait for Queue Space]
    Wait --> AddToQueue

    QueueStatus -->|Queue Available| JobQueued[Job Successfully Queued]
    JobQueued --> WorkerProcess[Email Worker Processes Job]

    WorkerProcess --> CheckRateLimit{Rate Limit Exceeded?}
    CheckRateLimit -->|Yes| DelayJob[Delay Job Processing]
    DelayJob --> WorkerProcess

    CheckRateLimit -->|No| SendEmail[Send Email via Brevo API]
    SendEmail --> EmailSent{Email Sent Successfully?}

    EmailSent -->|No| HandleError[Handle Email Error]
    HandleError --> RetryCount{Retry Count < Max?}

    RetryCount -->|Yes| IncrementRetry[Increment Retry Count]
    IncrementRetry --> DelayRetry[Delay Before Retry]
    DelayRetry --> SendEmail

    RetryCount -->|No| MarkFailed[Mark Job as Failed]
    MarkFailed --> LogFailure[Log Failure for Manual Review]

    EmailSent -->|Yes| MarkSuccess[Mark Job as Successful]
    MarkSuccess --> UpdateStats[Update Email Statistics]
    UpdateStats --> JobComplete[Job Complete]

    JobComplete --> Cleanup[Cleanup Job Resources]
    Cleanup --> End
```

## 7. Error Handling & Recovery Flow

```mermaid
flowchart TD
    Start([Error Occurs]) --> LogError[Log Error Details]
    LogError --> DetermineSeverity{Error Severity?}

    DetermineSeverity -->|Critical| CriticalError[Critical Error Handler]
    DetermineSeverity -->|Warning| WarningError[Warning Error Handler]
    DetermineSeverity -->|Info| InfoError[Info Error Handler]

    CriticalError --> SystemImpact{System Impact?}
    SystemImpact -->|High| EmergencyMode[Enter Emergency Mode]
    SystemImpact -->|Medium| DegradedMode[Degraded Service Mode]
    SystemImpact -->|Low| NormalMode[Continue Normal Operation]

    EmergencyMode --> NotifyAdmin[Notify System Administrators]
    NotifyAdmin --> Rollback[Rollback to Last Stable State]
    Rollback --> SystemRecovery[System Recovery Process]

    DegradedMode --> DisableFeatures[Disable Non-Essential Features]
    DisableFeatures --> MonitorSystem[Monitor System Health]
    MonitorSystem --> CheckRecovery{System Recovered?}

    CheckRecovery -->|Yes| RestoreFeatures[Restore Disabled Features]
    CheckRecovery -->|No| ContinueMonitoring[Continue Monitoring]

    WarningError --> CheckRetry{Retry Possible?}
    CheckRetry -->|Yes| RetryOperation[Retry Operation]
    CheckRetry -->|No| AlternativePath[Find Alternative Path]

    RetryOperation --> RetrySuccess{Retry Successful?}
    RetrySuccess -->|Yes| ContinueOperation[Continue Normal Operation]
    RetrySuccess -->|No| MaxRetries{Max Retries Reached?}

    MaxRetries -->|Yes| FallbackMethod[Use Fallback Method]
    MaxRetries -->|No| RetryOperation

    InfoError --> LogInfo[Log Information Only]
    LogInfo --> ContinueOperation

    AlternativePath --> PathAvailable{Alternative Available?}
    PathAvailable -->|Yes| UseAlternative[Use Alternative Method]
    PathAvailable -->|No| GracefulDegradation[Graceful Degradation]

    FallbackMethod --> FallbackSuccess{Fallback Successful?}
    FallbackSuccess -->|Yes| ContinueOperation
    FallbackSuccess -->|No| ManualIntervention[Require Manual Intervention]

    ContinueOperation --> MonitorHealth[Monitor System Health]
    MonitorHealth --> End([End])

    ManualIntervention --> AdminAction[Admin Takes Action]
    AdminAction --> SystemRestored{System Restored?}
    SystemRestored -->|Yes| ContinueOperation
    SystemRestored -->|No| Escalate[Escalate to Higher Level]
```

## 8. User Session Management Flow

```mermaid
flowchart TD
    Start([User Session Request]) --> CheckToken{JWT Token Present?}

    CheckToken -->|No| RedirectLogin[Redirect to Login]
    RedirectLogin --> End([End])

    CheckToken -->|Yes| ValidateToken{Token Valid?}
    ValidateToken -->|No| TokenExpired[Token Expired]

    TokenExpired --> CheckSession{Session Still Active?}
    CheckSession -->|Yes| RefreshToken[Refresh JWT Token]
    CheckSession -->|No| ClearSession[Clear Session Data]

    ClearSession --> RedirectLogin

    RefreshToken --> NewTokenValid{New Token Valid?}
    NewTokenValid -->|Yes| ContinueRequest[Continue with New Token]
    NewTokenValid -->|No| ClearSession

    ValidateToken -->|Yes| CheckPermissions{User Permissions Valid?}
    CheckPermissions -->|No| AccessDenied[Access Denied]
    AccessDenied --> LogAccessViolation[Log Access Violation]
    LogAccessViolation --> End

    CheckPermissions -->|Yes| CheckRateLimit{User Rate Limit Exceeded?}
    CheckRateLimit -->|Yes| RateLimitExceeded[Rate Limit Exceeded]
    RateLimitExceeded --> WaitCooldown[Wait for Cooldown Period]
    WaitCooldown --> CheckRateLimit

    CheckRateLimit -->|No| UpdateActivity[Update User Activity]
    UpdateActivity --> CheckSessionTimeout{Session Timeout?}

    CheckSessionTimeout -->|Yes| ExtendSession[Extend Session]
    CheckSessionTimeout -->|No| ContinueSession[Continue Session]

    ExtendSession --> ExtendSuccess{Extension Successful?}
    ExtendSuccess -->|Yes| ContinueSession
    ExtendSuccess -->|No| SessionError[Session Extension Error]

    ContinueSession --> ProcessRequest[Process User Request]
    ProcessRequest --> RequestSuccess{Request Successful?}

    RequestSuccess -->|Yes| UpdateLastActivity[Update Last Activity Time]
    RequestSuccess -->|No| HandleRequestError[Handle Request Error]

    UpdateLastActivity --> SaveSession[Save Session Data]
    SaveSession --> ReturnResponse[Return Response to User]

    HandleRequestError --> LogError[Log Request Error]
    LogError --> ReturnError[Return Error Response]

    ReturnResponse --> End
    ReturnError --> End
```

## 9. Data Synchronization & Cache Management Flow

```mermaid
flowchart TD
    Start([Data Change Request]) --> ValidateRequest{Request Valid?}

    ValidateRequest -->|No| ReturnError[Return Validation Error]
    ReturnError --> End([End])

    ValidateRequest -->|Yes| CheckCache{Data in Cache?}
    CheckCache -->|Yes| CacheHit[Cache Hit]
    CacheHit --> CheckStale{Cache Stale?}

    CheckStale -->|No| ReturnCachedData[Return Cached Data]
    CheckStale -->|Yes| InvalidateCache[Invalidate Cache]

    CheckCache -->|No| CacheMiss[Cache Miss]
    CacheMiss --> FetchFromDB[Fetch from Database]

    InvalidateCache --> FetchFromDB

    FetchFromDB --> DataRetrieved{Data Retrieved Successfully?}
    DataRetrieved -->|No| HandleDBError[Handle Database Error]
    HandleDBError --> ReturnError

    DataRetrieved -->|Yes| UpdateCache[Update Cache]
    UpdateCache --> CacheUpdated{Cache Updated Successfully?}

    CacheUpdated -->|No| LogCacheError[Log Cache Update Error]
    LogCacheError --> ContinueWithoutCache[Continue Without Cache]

    CacheUpdated -->|Yes| DataConsistent[Data Now Consistent]
    ContinueWithoutCache --> DataConsistent

    DataConsistent --> ProcessRequest[Process Data Change Request]
    ProcessRequest --> ChangeSuccess{Change Successful?}

    ChangeSuccess -->|No| RollbackChanges[Rollback Changes]
    RollbackChanges --> ReturnError

    ChangeSuccess -->|Yes| UpdateDatabase[Update Database]
    UpdateDatabase --> DBUpdated{Database Updated Successfully?}

    DBUpdated -->|No| RollbackChanges

    DBUpdated -->|Yes| InvalidateRelatedCache[Invalidate Related Cache Entries]
    InvalidateRelatedCache --> NotifySubscribers[Notify Subscribers]
    NotifySubscribers --> SyncComplete[Data Synchronization Complete]

    SyncComplete --> ReturnSuccess[Return Success Response]
    ReturnSuccess --> End
```

## 10. System Health Monitoring & Maintenance Flow

```mermaid
flowchart TD
    Start([System Health Check]) --> CheckSystemHealth{System Health Status}

    CheckSystemHealth -->|Healthy| ContinueMonitoring[Continue Monitoring]
    CheckSystemHealth -->|Warning| InvestigateWarning[Investigate Warning]
    CheckSystemHealth -->|Critical| EmergencyResponse[Emergency Response]

    ContinueMonitoring --> ScheduleNextCheck[Schedule Next Health Check]
    ScheduleNextCheck --> End([End])

    InvestigateWarning --> CheckMetrics{Check System Metrics}
    CheckMetrics --> CPUUsage{CPU Usage High?}
    CPUUsage -->|Yes| OptimizeCPU[Optimize CPU Usage]
    CPUUsage -->|No| CheckMemory{Memory Usage High?}

    CheckMemory -->|Yes| OptimizeMemory[Optimize Memory Usage]
    CheckMemory -->|No| CheckDisk{Disk Space Low?}

    CheckDisk -->|Yes| CleanupDisk[Disk Cleanup Process]
    CheckDisk -->|No| CheckNetwork{Network Issues?}

    CheckNetwork -->|Yes| DiagnoseNetwork[Network Diagnosis]
    CheckNetwork -->|No| CheckDatabase{Database Issues?}

    CheckDatabase -->|Yes| OptimizeDatabase[Database Optimization]
    CheckDatabase -->|No| CheckExternalServices{External Services Issues?}

    CheckExternalServices -->|Yes| CheckAPIs[Check External APIs]
    CheckExternalServices -->|No| WarningResolved{Warning Resolved?}

    WarningResolved -->|Yes| ResumeNormal[Resume Normal Operation]
    WarningResolved -->|No| EscalateWarning[Escalate to Critical]

    EmergencyResponse --> ImmediateAction[Take Immediate Action]
    ImmediateAction --> NotifyTeam[Notify Response Team]
    NotifyTeam --> AssessDamage{Assess System Damage}

    AssessDamage --> DamageLevel{Damage Level?}
    DamageLevel -->|Severe| FullShutdown[Full System Shutdown]
    DamageLevel -->|Moderate| PartialShutdown[Partial System Shutdown]
    DamageLevel -->|Minor| DegradedMode[Degraded Mode Operation]

    FullShutdown --> EmergencyRecovery[Emergency Recovery Process]
    PartialShutdown --> EmergencyRecovery
    DegradedMode --> EmergencyRecovery

    EmergencyRecovery --> SystemRestored{System Restored?}
    SystemRestored -->|Yes| PostRecovery[Post-Recovery Analysis]
    SystemRestored -->|No| EscalateEmergency[Escalate Emergency]

    PostRecovery --> RootCauseAnalysis[Root Cause Analysis]
    RootCauseAnalysis --> ImplementFix[Implement Permanent Fix]
    ImplementFix --> TestFix{Test Fix Successful?}

    TestFix -->|Yes| DeployFix[Deploy Fix to Production]
    TestFix -->|No| ReviseFix[Revise Fix]

    DeployFix --> MonitorDeployment[Monitor Deployment]
    MonitorDeployment --> DeploymentSuccess{Deployment Successful?}

    DeploymentSuccess -->|Yes| ResumeNormal
    DeploymentSuccess -->|No| RollbackDeployment[Rollback Deployment]

    ResumeNormal --> End
    RollbackDeployment --> EmergencyRecovery
```

## Key Features of These Flowcharts:

1. **Decision Points**: Clear branching logic for different scenarios
2. **Error Handling**: Comprehensive error handling and recovery paths
3. **Process Flow**: Step-by-step visualization of complex workflows
4. **User Experience**: Shows user interaction points and feedback
5. **System States**: Different system modes and transitions
6. **Data Flow**: How data moves through the system
7. **Security Checks**: Authentication and authorization flows
8. **Maintenance**: System health monitoring and recovery processes

## Important Notes on Course Access Implementation:

1. **No Individual Enrollment**: Users don't enroll in courses individually
2. **Department-Based Access**: Course access is controlled by `coursesAssignedToDepartment` in the Department model
3. **Automatic Access**: Users automatically get access to all courses assigned to their department
4. **Progress Tracking**: Individual progress is tracked in `learningProgress` array in User model
5. **Access Control**: The `getCourseForDepartmen` controller filters courses based on department assignment

## Important Notes on Quiz & Progress Implementation:

1. **70% Passing Threshold**: Users need to score at least 70% to pass a quiz
2. **No Certification Process**: Currently no certificate generation system exists
3. **Learning Progress Updates**: Quiz results automatically update user's learning progress
4. **Progress Calculation**:
   - Tutorial progress = (Passed quizzes / Total quizzes) × 100
   - Course progress = (Completed tutorials / Total tutorials) × 100
5. **Quiz Result Storage**: Results stored in QuizResult model with score, percentage, and pass/fail status
6. **Automatic Progress Tracking**: System automatically tracks and updates progress at quiz, tutorial, and course levels

These flowcharts now accurately reflect your actual system architecture where course access is department-based rather than enrollment-based, and quiz processing follows the 70% passing threshold with automatic learning progress updates.
