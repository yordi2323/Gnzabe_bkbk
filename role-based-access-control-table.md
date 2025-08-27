# Gnezabe Security Training Platform - Role-Based Access Control Table

## 👥 **User Roles Overview**

- **👑 Platform Owner**: System administrator with global access and full control
- **🏢 Company Account**: Company administrator with company-wide management capabilities
- **🎯 Department Admin**: Department administrator with department-level management within assigned department
- **👤 Employee**: Regular employee with individual learning access and personal profile management

---

## 📊 **Comprehensive Role-Based Access Control Matrix**

### 🔐 **Authentication & Profile Management**

| Action                              | Platform Owner | Company Account | Department Admin | Employee |
| ----------------------------------- | -------------- | --------------- | ---------------- | -------- |
| **User Registration & Login**       |
| User Signup                         | ✅             | ❌              | ✅               | ✅       |
| Company Signup                      | ✅             | ✅              | ❌               | ❌       |
| Platform Owner Signup               | ✅             | ❌              | ❌               | ❌       |
| User Login                          | ✅             | ❌              | ✅               | ✅       |
| Company Login                       | ✅             | ✅              | ❌               | ❌       |
| Platform Owner Login                | ✅             | ❌              | ❌               | ❌       |
| User Logout                         | ✅             | ❌              | ✅               | ✅       |
| Company Logout                      | ✅             | ✅              | ❌               | ❌       |
| Platform Owner Logout               | ✅             | ❌              | ❌               | ❌       |
| **Password & Security**             |
| Password Reset (User)               | ✅             | ❌              | ✅               | ✅       |
| Password Reset (Company)            | ✅             | ✅              | ❌               | ❌       |
| Password Reset (Platform Owner)     | ✅             | ❌              | ❌               | ❌       |
| Email Verification (User)           | ✅             | ❌              | ✅               | ✅       |
| Email Verification (Company)        | ✅             | ✅              | ❌               | ❌       |
| Email Verification (Platform Owner) | ✅             | ❌              | ❌               | ❌       |
| OTP Verification (User)             | ✅             | ❌              | ✅               | ✅       |
| OTP Verification (Company)          | ✅             | ✅              | ❌               | ❌       |
| OTP Verification (Platform Owner)   | ✅             | ❌              | ❌               | ❌       |
| MFA Management                      | ✅             | ✅              | ✅               | ✅       |
| **Profile Management**              |
| Update Own Profile                  | ✅             | ✅              | ✅               | ✅       |
| Update Other Profiles               | ✅             | ❌              | ❌               | ❌       |
| View Own Profile                    | ✅             | ✅              | ✅               | ✅       |
| View Other Profiles                 | ✅             | Limited         | Limited          | ❌       |

### 👥 **User & Employee Management**

| Action                          | Platform Owner | Company Account | Department Admin | Employee |
| ------------------------------- | -------------- | --------------- | ---------------- | -------- |
| **Employee Viewing**            |
| View Company Employees          | ✅             | ✅              | ❌               | ❌       |
| View Department Employees       | ✅             | ❌              | ✅               | ❌       |
| View All Users (Global)         | ✅             | ❌              | ❌               | ❌       |
| View Specific User              | ✅             | Limited         | Limited          | ❌       |
| **Employee Management**         |
| Approve Employee Registration   | ✅             | ❌              | ✅               | ❌       |
| Disapprove Employee             | ✅             | ❌              | ✅               | ❌       |
| Terminate Employee              | ✅             | ❌              | ❌               | ❌       |
| Update User Information         | ✅             | ❌              | ❌               | ❌       |
| **Employee Invitation**         |
| Invite Individual Employees     | ✅             | ✅              | ❌               | ❌       |
| Bulk CSV Import Employees       | ✅             | ✅              | ❌               | ❌       |
| **Employee Assignment**         |
| Add Employee to Department      | ✅             | ✅              | ❌               | ❌       |
| Remove Employee from Department | ✅             | ✅              | ✅               | ❌       |
| Assign Department Admin         | ✅             | ✅              | ❌               | ❌       |
| Revoke Department Admin         | ✅             | ✅              | ❌               | ❌       |

### 🏢 **Company Management**

| Action                     | Platform Owner | Company Account | Department Admin | Employee |
| -------------------------- | -------------- | --------------- | ---------------- | -------- |
| **Company Information**    |
| View Company Information   | ✅             | ✅              | ❌               | ❌       |
| Update Company Information | ✅             | ✅              | ❌               | ❌       |
| Manage Company Logo        | ✅             | ✅              | ❌               | ❌       |
| **Company Operations**     |
| View Company Departments   | ✅             | ✅              | ❌               | ❌       |
| Company Configuration      | ✅             | ✅              | ❌               | ❌       |
| Company Analytics          | ✅             | ✅              | ❌               | ❌       |

### 🏗️ **Department Management**

| Action                       | Platform Owner | Company Account | Department Admin | Employee |
| ---------------------------- | -------------- | --------------- | ---------------- | -------- |
| **Department CRUD**          |
| Create Department            | ✅             | ✅              | ❌               | ❌       |
| Update Department            | ✅             | ✅              | ❌               | ❌       |
| Delete Department            | ✅             | ✅              | ❌               | ❌       |
| Activate Department          | ✅             | ✅              | ❌               | ❌       |
| Deactivate Department        | ✅             | ✅              | ❌               | ❌       |
| **Department Operations**    |
| View Department Details      | ✅             | ✅              | ✅               | ❌       |
| View Department Progress     | ✅             | ✅              | ✅               | ❌       |
| View Department Analytics    | ✅             | ✅              | ✅               | ❌       |
| **Department Access**        |
| Department Access Validation | ✅             | ✅              | ✅               | ❌       |
| Company Access Validation    | ✅             | ✅              | ❌               | ❌       |

### 📚 **Course Management**

| Action                             | Platform Owner | Company Account | Department Admin | Employee |
| ---------------------------------- | -------------- | --------------- | ---------------- | -------- |
| **Course CRUD**                    |
| Create Courses                     | ✅             | ❌              | ❌               | ❌       |
| Update Courses                     | ✅             | ❌              | ❌               | ❌       |
| Delete Courses                     | ✅             | ❌              | ❌               | ❌       |
| **Course Assignment**              |
| Assign Courses to Departments      | ✅             | ✅              | ❌               | ❌       |
| Remove Courses from Departments    | ✅             | ✅              | ❌               | ❌       |
| **Course Access**                  |
| View Available Courses             | ✅             | ✅              | ✅               | ✅       |
| View Course Details                | ✅             | ✅              | ✅               | ✅       |
| Access Course Content              | ✅             | ❌              | ✅               | ✅       |
| Access All Courses                 | ✅             | ❌              | ❌               | ❌       |
| Access Department-Assigned Courses | ✅             | ❌              | ✅               | ✅       |

### 📋 **Tutorial Management**

| Action                  | Platform Owner | Company Account | Department Admin | Employee |
| ----------------------- | -------------- | --------------- | ---------------- | -------- |
| **Tutorial CRUD**       |
| Create Tutorials        | ✅             | ❌              | ❌               | ❌       |
| Update Tutorials        | ✅             | ❌              | ❌               | ❌       |
| Delete Tutorials        | ✅             | ❌              | ❌               | ❌       |
| **Tutorial Operations** |
| View Tutorials          | ✅             | ❌              | ✅               | ✅       |
| Assign Tutorials        | ✅             | ❌              | ❌               | ❌       |
| Upload Tutorial Assets  | ✅             | ❌              | ❌               | ❌       |
| Handle Video Uploads    | ✅             | ❌              | ❌               | ❌       |
| **Tutorial Access**     |
| Take Tutorials          | ✅             | ❌              | ✅               | ✅       |
| Access Tutorial Content | ✅             | ❌              | ✅               | ✅       |

### 🧪 **Quiz Management**

| Action              | Platform Owner | Company Account | Department Admin | Employee |
| ------------------- | -------------- | --------------- | ---------------- | -------- |
| **Quiz CRUD**       |
| Create Quizzes      | ✅             | ❌              | ❌               | ❌       |
| Update Quizzes      | ✅             | ❌              | ❌               | ❌       |
| Delete Quizzes      | ✅             | ❌              | ❌               | ❌       |
| **Quiz Operations** |
| View Quizzes        | ✅             | ❌              | ✅               | ✅       |
| Assign Quizzes      | ✅             | ❌              | ❌               | ❌       |
| **Quiz Taking**     |
| Take Quizzes        | ✅             | ❌              | ✅               | ✅       |
| Submit Quiz Results | ✅             | ❌              | ✅               | ✅       |

### 📊 **Quiz Results & Assessment**

| Action                       | Platform Owner | Company Account | Department Admin | Employee |
| ---------------------------- | -------------- | --------------- | ---------------- | -------- |
| **Results Viewing**          |
| View Own Results             | ✅             | ❌              | ✅               | ✅       |
| View Department Results      | ✅             | ❌              | ✅               | ❌       |
| View Company Results         | ✅             | ✅              | ❌               | ❌       |
| View Global Results          | ✅             | ❌              | ❌               | ❌       |
| View Quiz Results by Quiz ID | ✅             | ✅              | ✅               | ✅       |
| **Results Management**       |
| Export Results               | ✅             | ❌              | ✅               | ❌       |
| Analyze Results              | ✅             | ✅              | ✅               | ❌       |

### 📈 **Progress Tracking & Analytics**

| Action                    | Platform Owner | Company Account | Department Admin | Employee |
| ------------------------- | -------------- | --------------- | ---------------- | -------- |
| **Progress Viewing**      |
| View Own Progress         | ✅             | ❌              | ✅               | ✅       |
| View Department Progress  | ✅             | ❌              | ✅               | ❌       |
| View Company Progress     | ✅             | ✅              | ❌               | ❌       |
| View Global Progress      | ✅             | ❌              | ❌               | ❌       |
| **Analytics Access**      |
| View Own Analytics        | ✅             | ❌              | ✅               | ✅       |
| View Department Analytics | ✅             | ❌              | ✅               | ❌       |
| View Company Analytics    | ✅             | ✅              | ❌               | ❌       |
| View Global Analytics     | ✅             | ❌              | ❌               | ❌       |
| **Reporting**             |
| Export Reports            | ✅             | ❌              | ✅               | ❌       |
| Generate Progress Reports | ✅             | ✅              | ✅               | ❌       |

### 📧 **Communication & Notifications**

| Action                         | Platform Owner | Company Account | Department Admin | Employee |
| ------------------------------ | -------------- | --------------- | ---------------- | -------- |
| **Notification Management**    |
| Send Company Notifications     | ✅             | ✅              | ❌               | ❌       |
| Send Department Notifications  | ✅             | ❌              | ✅               | ❌       |
| Send Global Notifications      | ✅             | ❌              | ❌               | ❌       |
| **Notification Access**        |
| Receive Notifications          | ✅             | ✅              | ✅               | ✅       |
| View Notifications             | ✅             | ✅              | ✅               | ✅       |
| Mark Notification as Read      | ✅             | ✅              | ✅               | ✅       |
| Mark All Notifications as Read | ✅             | ✅              | ✅               | ✅       |
| **Communication Settings**     |
| Manage Notification Settings   | ✅             | ✅              | ✅               | ✅       |
| Email Notifications            | ✅             | ✅              | ✅               | ✅       |
| Push Notifications             | ✅             | ✅              | ✅               | ✅       |

### 📁 **File Management**

| Action                   | Platform Owner | Company Account | Department Admin | Employee |
| ------------------------ | -------------- | --------------- | ---------------- | -------- |
| **File Uploads**         |
| Upload Company Files     | ✅             | ✅              | ❌               | ❌       |
| Upload Department Files  | ✅             | ❌              | ✅               | ❌       |
| Upload Personal Files    | ✅             | ❌              | ✅               | ✅       |
| **Content Uploads**      |
| Upload Course Thumbnails | ✅             | ❌              | ❌               | ❌       |
| Upload Tutorial Assets   | ✅             | ❌              | ❌               | ❌       |
| Upload Video Content     | ✅             | ❌              | ❌               | ❌       |
| **Data Uploads**         |
| Upload CSV Files         | ✅             | ✅              | ❌               | ❌       |
| **File Processing**      |
| Resize Images            | ✅             | ❌              | ❌               | ❌       |
| Generate Thumbnails      | ✅             | ❌              | ❌               | ❌       |

### 🔒 **Security & Access Control**

| Action                       | Platform Owner | Company Account | Department Admin | Employee |
| ---------------------------- | -------------- | --------------- | ---------------- | -------- |
| **System Security**          |
| View Audit Logs              | ✅             | ❌              | ❌               | ❌       |
| Manage User Permissions      | ✅             | ❌              | ❌               | ❌       |
| System Configuration         | ✅             | ❌              | ❌               | ❌       |
| **Access Validation**        |
| Access Control Validation    | ✅             | ✅              | ✅               | ✅       |
| Department Access Validation | ✅             | ✅              | ✅               | ❌       |
| Company Access Validation    | ✅             | ✅              | ❌               | ❌       |
| **Security Features**        |
| Input Sanitization           | ✅             | ✅              | ✅               | ✅       |
| Request Metadata Collection  | ✅             | ✅              | ✅               | ✅       |
| Cache Management             | ✅             | ✅              | ❌               | ❌       |
| Rate Limiting                | ✅             | ✅              | ✅               | ✅       |

### ⚙️ **System & Platform Management**

| Action                   | Platform Owner | Company Account | Department Admin | Employee |
| ------------------------ | -------------- | --------------- | ---------------- | -------- |
| **Platform Management**  |
| Platform Configuration   | ✅             | ❌              | ❌               | ❌       |
| System Maintenance       | ✅             | ❌              | ❌               | ❌       |
| Database Management      | ✅             | ❌              | ❌               | ❌       |
| Backup & Recovery        | ✅             | ❌              | ❌               | ❌       |
| **System Operations**    |
| System Updates           | ✅             | ❌              | ❌               | ❌       |
| Performance Optimization | ✅             | ❌              | ❌               | ❌       |
| System Monitoring        | ✅             | ❌              | ❌               | ❌       |
| **Admin Access**         |
| Admin Dashboard Access   | ✅             | ❌              | ❌               | ❌       |
| Platform Portal Access   | ✅             | ❌              | ❌               | ❌       |

### 🌐 **Platform Access & Features**

| Action                 | Platform Owner | Company Account | Department Admin | Employee |
| ---------------------- | -------------- | --------------- | ---------------- | -------- |
| **Application Access** |
| Web Application        | ✅             | ✅              | ✅               | ✅       |
| Mobile Application     | ✅             | ✅              | ✅               | ✅       |
| API Access             | ✅             | ✅              | ✅               | ✅       |
| **Portal Access**      |
| Admin Dashboard        | ✅             | ❌              | ❌               | ❌       |
| Company Portal         | ✅             | ✅              | ❌               | ❌       |
| Department Portal      | ✅             | ✅              | ✅               | ❌       |
| User Portal            | ✅             | ✅              | ✅               | ✅       |
| **Multi-Language**     |
| Language Preferences   | ✅             | ✅              | ✅               | ✅       |
| Localized Content      | ✅             | ✅              | ✅               | ✅       |
| Multi-Language UI      | ✅             | ✅              | ✅               | ✅       |

### 🔍 **Search & Filtering**

| Action                  | Platform Owner | Company Account | Department Admin | Employee |
| ----------------------- | -------------- | --------------- | ---------------- | -------- |
| **Search Capabilities** |
| Search Courses          | ✅             | ✅              | ✅               | ✅       |
| Search Tutorials        | ✅             | ✅              | ✅               | ✅       |
| Search Users            | ✅             | ❌              | ✅               | ❌       |
| Search Departments      | ✅             | ✅              | ❌               | ❌       |
| **Filtering Options**   |
| Filter by Department    | ✅             | ✅              | ✅               | ✅       |
| Filter by Course Type   | ✅             | ✅              | ✅               | ✅       |
| Filter by Progress      | ✅             | ✅              | ✅               | ❌       |

### 📊 **Data Export & Import**

| Action                     | Platform Owner | Company Account | Department Admin | Employee |
| -------------------------- | -------------- | --------------- | ---------------- | -------- |
| **Data Export**            |
| Export User Data           | ✅             | ❌              | ✅               | ❌       |
| Export Course Data         | ✅             | ❌              | ❌               | ❌       |
| Export Progress Reports    | ✅             | ❌              | ✅               | ❌       |
| Export Quiz Results        | ✅             | ❌              | ✅               | ❌       |
| **Data Import**            |
| Import Employee Data (CSV) | ✅             | ✅              | ❌               | ❌       |
| Import Course Data         | ✅             | ❌              | ❌               | ❌       |
| Import Tutorial Data       | ✅             | ❌              | ❌               | ❌       |

### 🔄 **Workflow Management**

| Action                         | Platform Owner | Company Account | Department Admin | Employee |
| ------------------------------ | -------------- | --------------- | ---------------- | -------- |
| **Business Workflows**         |
| Employee Registration Workflow | ✅             | ✅              | ✅               | ❌       |
| Course Assignment Workflow     | ✅             | ✅              | ❌               | ❌       |
| Department Management Workflow | ✅             | ✅              | ❌               | ❌       |
| Quiz Completion Workflow       | ✅             | ❌              | ✅               | ✅       |
| **Approval Processes**         |
| Employee Approval Process      | ✅             | ❌              | ✅               | ❌       |
| Course Assignment Approval     | ✅             | ✅              | ❌               | ❌       |
| Department Admin Assignment    | ✅             | ✅              | ❌               | ❌       |

### 📈 **Performance & Monitoring**

| Action                    | Platform Owner | Company Account | Department Admin | Employee |
| ------------------------- | -------------- | --------------- | ---------------- | -------- |
| **System Monitoring**     |
| View System Performance   | ✅             | ❌              | ❌               | ❌       |
| Monitor User Activity     | ✅             | ❌              | ❌               | ❌       |
| Track System Usage        | ✅             | ❌              | ❌               | ❌       |
| **Performance Analytics** |
| Performance Analytics     | ✅             | ❌              | ❌               | ❌       |
| System Health Monitoring  | ✅             | ❌              | ❌               | ❌       |
| Resource Usage Tracking   | ✅             | ❌              | ❌               | ❌       |

---

## 📊 **Access Summary by Role**

| Role                    | Total Actions | Access Level     | Description                                                              |
| ----------------------- | ------------- | ---------------- | ------------------------------------------------------------------------ |
| **👑 Platform Owner**   | 100%          | Full Access      | Complete control over entire platform, all features, and global data     |
| **🏢 Company Account**  | ~65%          | Company Level    | Company-wide management, department operations, and employee oversight   |
| **🎯 Department Admin** | ~45%          | Department Level | Department-specific management, employee approval, and progress tracking |
| **👤 Employee**         | ~30%          | Individual Level | Personal learning, profile management, and assigned content access       |

---

## 🔑 **Key Permission Patterns**

### **Platform Owner (👑)**

- **Full Access**: Can perform any action on any resource
- **Global Management**: Manages all companies, departments, users, and content
- **System Administration**: Platform configuration, maintenance, and monitoring
- **Content Creation**: Creates and manages all courses, tutorials, and quizzes

### **Company Account (🏢)**

- **Company Scope**: Manages only their own company's data and operations
- **Department Management**: Creates, updates, and manages company departments
- **Employee Oversight**: Invites and manages company employees
- **Course Assignment**: Assigns courses to departments (cannot create content)
- **Company Analytics**: Views company-wide progress and performance

### **Department Admin (🎯)**

- **Department Scope**: Manages only their assigned department
- **Employee Management**: Approves/disapproves department employees
- **Progress Tracking**: Views department progress and analytics
- **Learning Access**: Can access all learning content like regular employees
- **Limited Company Access**: Cannot manage company-level settings

### **Employee (👤)**

- **Individual Scope**: Manages only their own profile and learning
- **Learning Access**: Accesses courses assigned to their department
- **Progress Tracking**: Views personal learning progress and analytics
- **No Administrative Access**: Cannot manage other users or system settings
- **Content Consumption**: Takes tutorials and quizzes, views assigned content

---

## 📝 **Legend**

- ✅ = **Full Access** - Can perform this action
- ❌ = **No Access** - Cannot perform this action
- Limited = **Restricted Access** - Can perform with limitations (e.g., only own company/department data)

---

## 🔒 **Security Notes**

1. **Role Inheritance**: Department Admins inherit all Employee permissions plus additional admin capabilities
2. **Data Isolation**: Company accounts can only access their own company's data
3. **Department Scoping**: Department admins are restricted to their assigned department
4. **Content Access**: Employees can only access content assigned to their department
5. **Audit Trail**: All actions are logged and tracked for security purposes
6. **Middleware Protection**: Each endpoint is protected by appropriate authentication and authorization middleware


