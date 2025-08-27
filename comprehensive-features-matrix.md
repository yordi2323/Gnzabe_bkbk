# Gnezabe Security Training Platform - Comprehensive Features Matrix

## Overview

This comprehensive features matrix is based on actual codebase analysis including all routes, endpoints, middlewares, controllers, and implemented functionality. It provides a complete picture of what each actor type can and cannot do in the system.

## Actor Types

### 1. 🏢 **Company Account**

- **Role**: Company Administrator
- **Authentication**: Company-specific login credentials
- **Scope**: Company-wide management

### 2. 👤 **Employee**

- **Role**: Regular Employee
- **Authentication**: Personal login credentials
- **Scope**: Individual learning and progress

### 3. 🎯 **Department Admin**

- **Role**: Department Administrator
- **Authentication**: Personal login credentials (same as employee)
- **Scope**: Department-level management within assigned department

### 4. 👑 **Platform Owner**

- **Role**: System Administrator
- **Authentication**: Platform-level credentials
- **Scope**: Global platform management

---

## Comprehensive Features Matrix

| Feature Category                           | Feature | Company Account             | Employee                    | Department Admin | Platform Owner |
| ------------------------------------------ | ------- | --------------------------- | --------------------------- | ---------------- | -------------- |
| **🔐 Authentication & Profile Management** |
| User Signup                                | ❌      | ✅ (via company invitation) | ✅ (via company invitation) | ✅               |
| Company Signup                             | ✅      | ❌                          | ❌                          | ❌               |
| Platform Owner Signup                      | ❌      | ❌                          | ❌                          | ✅               |
| User Login                                 | ❌      | ✅                          | ✅                          | ❌               |
| Company Login                              | ✅      | ❌                          | ❌                          | ❌               |
| Platform Owner Login                       | ❌      | ❌                          | ❌                          | ✅               |
| User Logout                                | ❌      | ✅                          | ✅                          | ❌               |
| Company Logout                             | ✅      | ❌                          | ❌                          | ❌               |
| Platform Owner Logout                      | ❌      | ❌                          | ❌                          | ✅               |
| Password Reset (User)                      | ❌      | ✅                          | ✅                          | ❌               |
| Password Reset (Company)                   | ✅      | ❌                          | ❌                          | ❌               |
| Password Reset (Platform Owner)            | ❌      | ❌                          | ❌                          | ✅               |
| Email Verification (User)                  | ❌      | ✅                          | ✅                          | ❌               |
| Email Verification (Company)               | ✅      | ❌                          | ❌                          | ❌               |
| Email Verification (Platform Owner)        | ❌      | ❌                          | ❌                          | ✅               |
| OTP Verification (User)                    | ❌      | ✅                          | ✅                          | ❌               |
| OTP Verification (Company)                 | ✅      | ❌                          | ❌                          | ❌               |
| OTP Verification (Platform Owner)          | ❌      | ❌                          | ❌                          | ✅               |
| MFA Management                             | ✅      | ✅                          | ✅                          | ✅               |
| Profile Update (Own)                       | ✅      | ✅                          | ✅                          | ✅               |
| Profile Update (Others)                    | ❌      | ❌                          | ❌                          | ✅               |
| **👥 User Management**                     |
| View Own Profile                           | ✅      | ✅                          | ✅                          | ✅               |
| View Company Employees                     | ✅      | ❌                          | ❌                          | ✅               |
| View Department Employees                  | ❌      | ❌                          | ✅                          | ✅               |
| View All Users (Global)                    | ❌      | ❌                          | ❌                          | ✅               |
| Approve Employee Registration              | ❌      | ❌                          | ✅                          | ✅               |
| Disapprove Employee                        | ❌      | ❌                          | ✅                          | ✅               |
| Terminate Employee                         | ❌      | ❌                          | ❌                          | ✅               |
| Update User Information                    | ❌      | ❌                          | ❌                          | ✅               |
| Invite Employees (Individual)              | ✅      | ❌                          | ❌                          | ✅               |
| Invite Employees (CSV Bulk)                | ✅      | ❌                          | ❌                          | ✅               |
| **🏢 Company Management**                  |
| View Company Information                   | ✅      | ❌                          | ❌                          | ✅               |
| Update Company Information                 | ✅      | ❌                          | ❌                          | ✅               |
| Manage Company Logo                        | ✅      | ❌                          | ❌                          | ✅               |
| View Company Departments                   | ✅      | ❌                          | ❌                          | ✅               |
| **🏗️ Department Management**               |
| Create Departments                         | ✅      | ❌                          | ❌                          | ✅               |
| Update Departments                         | ✅      | ❌                          | ❌                          | ✅               |
| Delete Departments                         | ✅      | ❌                          | ❌                          | ✅               |
| Activate Departments                       | ✅      | ❌                          | ❌                          | ✅               |
| Deactivate Departments                     | ✅      | ❌                          | ❌                          | ✅               |
| View Department Details                    | ✅      | ❌                          | ✅                          | ✅               |
| Add Employee to Department                 | ✅      | ❌                          | ❌                          | ✅               |
| Remove Employee from Department            | ✅      | ❌                          | ✅                          | ✅               |
| Assign Department Admin                    | ✅      | ❌                          | ❌                          | ✅               |
| Revoke Department Admin                    | ✅      | ❌                          | ❌                          | ✅               |
| View Department Progress                   | ✅      | ❌                          | ✅                          | ✅               |
| **📚 Course Management**                   |
| View Available Courses                     | ✅      | ✅                          | ✅                          | ✅               |
| Create Courses                             | ❌      | ❌                          | ❌                          | ✅               |
| Update Courses                             | ❌      | ❌                          | ❌                          | ✅               |
| Delete Courses                             | ❌      | ❌                          | ❌                          | ✅               |
| Assign Courses to Departments              | ✅      | ❌                          | ❌                          | ✅               |
| Remove Courses from Departments            | ✅      | ❌                          | ❌                          | ✅               |
| View Course Details                        | ✅      | ✅                          | ✅                          | ✅               |
| **🎯 Course Access & Learning**            |
| Access Department-Assigned Courses         | ❌      | ✅                          | ✅                          | ✅               |
| Access All Courses                         | ❌      | ❌                          | ❌                          | ✅               |
| View Course Content                        | ❌      | ✅                          | ✅                          | ✅               |
| Take Tutorials                             | ❌      | ✅                          | ✅                          | ✅               |
| Take Quizzes                               | ❌      | ✅                          | ✅                          | ✅               |
| **📋 Tutorial Management**                 |
| View Tutorials                             | ✅      | ✅                          | ✅                          | ✅               |
| Create Tutorials                           | ❌      | ❌                          | ❌                          | ✅               |
| Update Tutorials                           | ❌      | ❌                          | ❌                          | ✅               |
| Delete Tutorials                           | ❌      | ❌                          | ❌                          | ✅               |
| Upload Tutorial Assets                     | ❌      | ❌                          | ❌                          | ✅               |
| Handle Video Uploads                       | ❌      | ❌                          | ❌                          | ✅               |
| **🧪 Quiz Management**                     |
| View Quizzes                               | ✅      | ✅                          | ✅                          | ✅               |
| Create Quizzes                             | ❌      | ❌                          | ❌                          | ✅               |
| Update Quizzes                             | ❌      | ❌                          | ❌                          | ✅               |
| Delete Quizzes                             | ❌      | ❌                          | ❌                          | ✅               |
| **📊 Quiz Results & Assessment**           |
| Submit Quiz Results                        | ❌      | ✅                          | ✅                          | ✅               |
| View Own Quiz Results                      | ❌      | ✅                          | ✅                          | ✅               |
| View Department Quiz Results               | ❌      | ❌                          | ✅                          | ✅               |
| View Company Quiz Results                  | ✅      | ❌                          | ❌                          | ✅               |
| View All Quiz Results                      | ❌      | ❌                          | ❌                          | ✅               |
| View Quiz Results by Quiz ID               | ✅      | ✅                          | ✅                          | ✅               |
| **📈 Progress Tracking & Analytics**       |
| View Own Learning Progress                 | ❌      | ✅                          | ✅                          | ✅               |
| View Department Progress                   | ❌      | ❌                          | ✅                          | ✅               |
| View Company Progress                      | ✅      | ❌                          | ❌                          | ✅               |
| View Global Progress                       | ❌      | ❌                          | ❌                          | ✅               |
| View Own Analytics                         | ❌      | ✅                          | ✅                          | ✅               |
| View Department Analytics                  | ❌      | ❌                          | ✅                          | ✅               |
| View Company Analytics                     | ✅      | ❌                          | ❌                          | ✅               |
| View Global Analytics                      | ❌      | ❌                          | ❌                          | ✅               |
| Export Reports                             | ❌      | ❌                          | ✅                          | ✅               |
| **📧 Communication & Notifications**       |
| Receive Notifications                      | ✅      | ✅                          | ✅                          | ✅               |
| View Notifications                         | ✅      | ✅                          | ✅                          | ✅               |
| Mark Notification as Read                  | ✅      | ✅                          | ✅                          | ✅               |
| Mark All Notifications as Read             | ✅      | ✅                          | ✅                          | ✅               |
| Send Company Notifications                 | ✅      | ❌                          | ❌                          | ✅               |
| Send Department Notifications              | ❌      | ❌                          | ✅                          | ✅               |
| Send Global Notifications                  | ❌      | ❌                          | ❌                          | ✅               |
| **📁 File Management**                     |
| Upload Company Files                       | ✅      | ❌                          | ❌                          | ✅               |
| Upload Department Files                    | ❌      | ❌                          | ✅                          | ✅               |
| Upload Personal Files                      | ❌      | ✅                          | ✅                          | ✅               |
| Upload Course Thumbnails                   | ❌      | ❌                          | ❌                          | ✅               |
| Upload Tutorial Assets                     | ❌      | ❌                          | ❌                          | ✅               |
| Upload Video Content                       | ❌      | ❌                          | ❌                          | ✅               |
| Upload CSV Files                           | ✅      | ❌                          | ❌                          | ✅               |
| Resize Images                              | ❌      | ❌                          | ❌                          | ✅               |
| Generate Thumbnails                        | ❌      | ❌                          | ❌                          | ✅               |
| **🔒 Security & Access Control**           |
| View Audit Logs                            | ❌      | ❌                          | ❌                          | ✅               |
| Manage User Permissions                    | ❌      | ❌                          | ❌                          | ✅               |
| System Configuration                       | ❌      | ❌                          | ❌                          | ✅               |
| Access Control Validation                  | ✅      | ✅                          | ✅                          | ✅               |
| Department Access Validation               | ✅      | ❌                          | ✅                          | ✅               |
| Company Access Validation                  | ✅      | ❌                          | ❌                          | ✅               |
| **⚙️ System & Platform Management**        |
| Platform Configuration                     | ❌      | ❌                          | ❌                          | ✅               |
| System Maintenance                         | ❌      | ❌                          | ❌                          | ✅               |
| Cache Management                           | ✅      | ❌                          | ❌                          | ✅               |
| Rate Limiting                              | ✅      | ✅                          | ✅                          | ✅               |
| Input Sanitization                         | ✅      | ✅                          | ✅                          | ✅               |
| Request Metadata Collection                | ✅      | ✅                          | ✅                          | ✅               |
| **🌐 Multi-Language Support**              |
| Language Preferences                       | ✅      | ✅                          | ✅                          | ✅               |
| Localized Content                          | ✅      | ✅                          | ✅                          | ✅               |
| Multi-Language UI                          | ✅      | ✅                          | ✅                          | ✅               |
| **📱 Platform Access**                     |
| Web Application Access                     | ✅      | ✅                          | ✅                          | ✅               |
| Mobile Application Access                  | ✅      | ✅                          | ✅                          | ✅               |
| API Access                                 | ✅      | ✅                          | ✅                          | ✅               |
| **🔍 Search & Filtering**                  |
| Search Courses                             | ✅      | ✅                          | ✅                          | ✅               |
| Search Tutorials                           | ✅      | ✅                          | ✅                          | ✅               |
| Search Users                               | ❌      | ❌                          | ✅                          | ✅               |
| Search Departments                         | ✅      | ❌                          | ❌                          | ✅               |
| Filter by Department                       | ✅      | ✅                          | ✅                          | ✅               |
| Filter by Course Type                      | ✅      | ✅                          | ✅                          | ✅               |
| **📊 Data Export & Import**                |
| Export User Data                           | ❌      | ❌                          | ✅                          | ✅               |
| Export Course Data                         | ❌      | ❌                          | ❌                          | ✅               |
| Export Progress Reports                    | ❌      | ❌                          | ✅                          | ✅               |
| Import Employee Data (CSV)                 | ✅      | ❌                          | ❌                          | ✅               |
| Import Course Data                         | ❌      | ❌                          | ❌                          | ✅               |
| **🔄 Workflow Management**                 |
| Employee Approval Workflow                 | ❌      | ❌                          | ✅                          | ✅               |
| Course Assignment Workflow                 | ✅      | ❌                          | ❌                          | ✅               |
| Department Management Workflow             | ✅      | ❌                          | ❌                          | ✅               |
| Quiz Completion Workflow                   | ❌      | ✅                          | ✅                          | ✅               |
| **📈 Performance & Monitoring**            |
| View System Performance                    | ❌      | ❌                          | ❌                          | ✅               |
| Monitor User Activity                      | ❌      | ❌                          | ❌                          | ✅               |
| Track System Usage                         | ❌      | ❌                          | ❌                          | ✅               |
| Performance Analytics                      | ❌      | ❌                          | ❌                          | ✅               |

---

## Detailed Capabilities by Actor

### 🏢 **Company Account Capabilities**

#### ✅ **Can Do:**

- **Authentication**: Company signup, login, logout, password reset, email verification, OTP verification
- **User Management**: Invite employees individually or via CSV, view company employees
- **Department Management**: Create, update, delete, activate, deactivate departments, assign department admins
- **Course Management**: Assign/remove courses to/from departments, view available courses
- **Progress Tracking**: View department progress, view company progress
- **File Management**: Upload company files, upload CSV files
- **Communication**: Send company notifications, receive notifications
- **Access Control**: Validate department and company access
- **Cache Management**: Access cached department data

#### ❌ **Cannot Do:**

- Access individual course content or take quizzes
- Create, update, or delete courses
- Create, update, or delete tutorials
- Manage platform-level settings
- Access other companies' data
- View individual employee profiles in detail
- Access audit logs or system configuration

### 👤 **Employee Capabilities**

#### ✅ **Can Do:**

- **Authentication**: User login, logout, password reset, email verification, OTP verification
- **Profile Management**: Update own profile, manage preferences
- **Learning**: Access department-assigned courses, take tutorials, take quizzes
- **Progress Tracking**: View own learning progress, view own analytics
- **File Management**: Upload personal files
- **Communication**: Receive notifications, view notifications, mark notifications as read
- **Course Access**: View available courses, view course details

#### ❌ **Cannot Do:**

- Access courses not assigned to their department
- View other employees' progress or analytics
- Manage department or company settings
- Approve or disapprove other employees
- Access company-level data or analytics
- Send company or department notifications
- Upload company or department files
- Access administrative functions

### 🎯 **Department Admin Capabilities**

#### ✅ **Can Do:**

- **All Employee Capabilities**: Everything an employee can do
- **Employee Management**: Approve/disapprove department employees, view department employees
- **Progress Tracking**: View department progress, view department analytics
- **File Management**: Upload department files
- **Communication**: Send department notifications
- **Reporting**: Export department reports
- **Access Control**: Validate department access for their assigned department

#### ❌ **Cannot Do:**

- Access other departments' data
- Manage company-level settings
- Create, update, or delete departments
- Assign courses to departments
- View company-wide analytics
- Access platform-level settings
- Manage other departments' employees
- Access audit logs or system configuration

### 👑 **Platform Owner Capabilities**

#### ✅ **Can Do:**

- **All Capabilities**: Everything other actors can do
- **Platform Management**: Create, update, delete courses, tutorials, and quizzes
- **Global Access**: Access all companies, departments, and users
- **System Configuration**: Platform configuration, system maintenance
- **Audit & Security**: View audit logs, manage user permissions
- **Global Analytics**: View global progress and analytics
- **Content Management**: Upload all types of content, manage platform assets
- **User Management**: Manage all users across all companies
- **System Monitoring**: Performance monitoring, usage tracking

#### ❌ **Cannot Do:**

- No restrictions (full platform access)

---

## Access Control Matrix

| Resource Type        | Company Account | Employee    | Department Admin | Platform Owner |
| -------------------- | --------------- | ----------- | ---------------- | -------------- |
| **Own Profile**      | ✅ Full         | ✅ Full     | ✅ Full          | ✅ Full        |
| **Company Data**     | ✅ Full         | ❌ None     | ❌ None          | ✅ Full        |
| **Department Data**  | ✅ Full         | ❌ None     | ✅ Own Dept      | ✅ Full        |
| **Employee Data**    | ✅ Company Only | ❌ None     | ✅ Own Dept      | ✅ Full        |
| **Course Content**   | ❌ None         | ✅ Assigned | ✅ Assigned      | ✅ Full        |
| **Tutorial Content** | ❌ None         | ✅ Assigned | ✅ Assigned      | ✅ Full        |
| **Quiz Content**     | ❌ None         | ✅ Assigned | ✅ Assigned      | ✅ Full        |
| **Progress Data**    | ✅ Company Only | ✅ Own Only | ✅ Own + Dept    | ✅ Full        |
| **Analytics**        | ✅ Company Only | ✅ Own Only | ✅ Own + Dept    | ✅ Full        |
| **System Settings**  | ❌ None         | ❌ None     | ❌ None          | ✅ Full        |
| **Platform Data**    | ❌ None         | ❌ None     | ❌ None          | ✅ Full        |

---

## Security & Middleware Implementation

### 🔐 **Authentication Middlewares**

- `protectUser`: User authentication and validation
- `protectCompany`: Company authentication and validation
- `protectOwner`: Platform owner authentication and validation
- `protectUserCompanyOwner`: Multi-actor authentication (user, company, or platform owner)
- `protectUserOrCompany`: User or company authentication
- `protecAdminOrCompanay`: Department admin or company authentication

### 🛡️ **Authorization Middlewares**

- `allowedToCompanyOrDepartmentAdmin`: Company or department admin access
- `allowedToAdminOrEmployee`: Department admin or employee access
- `doesDepartmentBelongToCompany`: Department ownership validation
- `doesEmployeeBelongToCompany`: Employee ownership validation
- `isTheQuizTakenByEmployee`: Quiz attempt validation

### 🔒 **Security Middlewares**

- `sanitizeInputs`: XSS protection and input sanitization
- `attachRequestMeta`: Request metadata collection (IP, device, location)
- `cachedMiddleware`: Cache management and optimization

### 📁 **File Upload Middlewares**

- `uploadPhoto`: Photo upload handling
- `resizePhoto`: Photo resizing and optimization
- `uploadThumbnail`: Thumbnail upload for courses
- `resizeThumbnail`: Thumbnail resizing
- `uploadTutorialAssets`: Tutorial asset upload
- `handleVideoUpload`: Video upload and processing
- `uploadCSV`: CSV file upload for bulk operations

### ✅ **Validation Middlewares**

- `requireBodyFields`: Required field validation
- `verifyEmails`: Email verification
- `convertPriceToNumber`: Price format conversion
- `parseSlidesTags`: JSON parsing for slides and tags

---

## API Endpoints by Actor

### 🏢 **Company Account Endpoints**

- `POST /auth/company/signup` - Company registration
- `POST /auth/company/login` - Company login
- `POST /auth/company/invite-employees` - Invite individual employees
- `POST /auth/company/invite-employees-from-csv` - Bulk employee invitation
- `GET /departments` - View company departments
- `POST /departments` - Create department
- `POST /departments/assign-course` - Assign course to department
- `POST /departments/add-employee` - Add employee to department
- `POST /departments/assign-admin` - Assign department admin
- `POST /departments/activate/:id` - Activate department
- `POST /departments/deactivate/:id` - Deactivate department

### 👤 **Employee Endpoints**

- `POST /auth/user/signup` - User registration
- `POST /auth/user/login` - User login
- `GET /auth/user/verify` - Email verification
- `POST /auth/user/verify-otp` - OTP verification
- `POST /auth/user/get-reset-link` - Password reset request
- `POST /auth/user/reset-password` - Password reset
- `GET /courses` - View available courses
- `GET /courses/:id` - View course details
- `GET /tutorials` - View tutorials
- `GET /tutorials/:id` - View tutorial details
- `POST /quiz-results` - Submit quiz results
- `GET /quiz-results/get-by-quiz-id/:quizId` - View quiz results

### 🎯 **Department Admin Endpoints**

- **All Employee Endpoints** plus:
- `POST /users/approve` - Approve employee
- `POST /users/disapprove` - Disapprove employee
- `GET /departments/:id` - View department details
- `POST /departments/remove-employee` - Remove employee from department
- `GET /departments/progress/:id` - View department progress

### 👑 **Platform Owner Endpoints**

- **All Other Actor Endpoints** plus:
- `POST /auth/platform-owner/signup` - Platform owner registration
- `POST /auth/platform-owner/login` - Platform owner login
- `GET /users` - View all users
- `GET /users/:id` - View specific user
- `PATCH /users/:id` - Update user
- `POST /courses` - Create course
- `PATCH /courses/:id` - Update course
- `POST /tutorials` - Create tutorial
- `PATCH /tutorials/:id` - Update tutorial
- `GET /quizzes` - View all quizzes
- `POST /quizzes` - Create quiz
- `GET /quiz-results` - View all quiz results

---

## Business Logic Implementation

### 🔄 **Workflow Patterns**

1. **Employee Registration**: Company invites → Employee registers → Department admin approves → Employee gains access
2. **Course Assignment**: Platform owner creates course → Company assigns to department → Employees access automatically
3. **Progress Tracking**: Employee takes quiz → System calculates score → Updates learning progress → Triggers notifications
4. **Department Management**: Company creates department → Assigns admin → Admin manages employees → Company monitors progress

### 📊 **Data Flow Patterns**

1. **Authentication Flow**: Token validation → Role determination → Permission checking → Resource access
2. **Course Access Flow**: Department assignment → Course filtering → Content delivery → Progress tracking
3. **Progress Calculation**: Quiz submission → Score calculation → Progress update → Analytics generation
4. **Notification Flow**: Event trigger → Notification creation → Queue processing → Delivery

This comprehensive features matrix provides a complete understanding of the actual implemented functionality in your Gnezabe Security Training Platform, based on real codebase analysis rather than assumptions.
