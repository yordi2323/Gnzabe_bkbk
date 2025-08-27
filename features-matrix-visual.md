# Gnezabe Security Training Platform - Features Matrix

## 👥 **User Types**

- **👑 Platform Owner**: System administrator with global access
- **🏢 Company Account**: Company administrator with company-wide management
- **🎯 Department Admin**: Department administrator with department-level management
- **👤 Employee**: Regular employee with individual learning access

---

## 📊 **Features Matrix Table**

| Feature Category                     | Specific Feature                | Platform Owner | Company Account | Department Admin | Employee |
| ------------------------------------ | ------------------------------- | -------------- | --------------- | ---------------- | -------- |
| **🔐 Authentication & Profile**      |
|                                      | User Signup                     | ✅             | ❌              | ✅               | ✅       |
|                                      | Company Signup                  | ✅             | ✅              | ❌               | ❌       |
|                                      | Platform Owner Signup           | ✅             | ❌              | ❌               | ❌       |
|                                      | User Login                      | ✅             | ✅              | ✅               | ✅       |
|                                      | Company Login                   | ✅             | ✅              | ❌               | ❌       |
|                                      | Platform Owner Login            | ✅             | ❌              | ❌               | ❌       |
|                                      | Password Reset                  | ✅             | ✅              | ✅               | ✅       |
|                                      | Email Verification              | ✅             | ✅              | ✅               | ✅       |
|                                      | OTP Verification                | ✅             | ✅              | ✅               | ✅       |
|                                      | MFA Management                  | ✅             | ✅              | ✅               | ✅       |
|                                      | Profile Update                  | ✅             | ✅              | ✅               | ✅       |
| **👥 User Management**               |
|                                      | View Own Profile                | ✅             | ✅              | ✅               | ✅       |
|                                      | View Company Employees          | ✅             | ✅              | ❌               | ❌       |
|                                      | View Department Employees       | ✅             | ❌              | ✅               | ❌       |
|                                      | View All Users                  | ✅             | ❌              | ❌               | ❌       |
|                                      | Approve Employee                | ✅             | ❌              | ✅               | ❌       |
|                                      | Disapprove Employee             | ✅             | ❌              | ✅               | ❌       |
|                                      | Terminate Employee              | ✅             | ❌              | ❌               | ❌       |
|                                      | Update User Info                | ✅             | ❌              | ❌               | ❌       |
|                                      | Invite Employees                | ✅             | ✅              | ❌               | ❌       |
|                                      | Bulk CSV Import                 | ✅             | ✅              | ❌               | ❌       |
| **🏗️ Department Management**         |
|                                      | Create Department               | ✅             | ✅              | ❌               | ❌       |
|                                      | Update Department               | ✅             | ✅              | ❌               | ❌       |
|                                      | Delete Department               | ✅             | ✅              | ❌               | ❌       |
|                                      | Activate Department             | ✅             | ✅              | ❌               | ❌       |
|                                      | Deactivate Department           | ✅             | ✅              | ❌               | ❌       |
|                                      | View Department Details         | ✅             | ✅              | ✅               | ❌       |
|                                      | Add Employee to Department      | ✅             | ✅              | ❌               | ❌       |
|                                      | Remove Employee from Department | ✅             | ✅              | ✅               | ❌       |
|                                      | Assign Department Admin         | ✅             | ✅              | ❌               | ❌       |
|                                      | Revoke Department Admin         | ✅             | ✅              | ❌               | ❌       |
|                                      | View Department Progress        | ✅             | ✅              | ✅               | ❌       |
| **📚 Course Management**             |
|                                      | View Available Courses          | ✅             | ✅              | ✅               | ✅       |
|                                      | Create Courses                  | ✅             | ❌              | ❌               | ❌       |
|                                      | Update Courses                  | ✅             | ❌              | ❌               | ❌       |
|                                      | Delete Courses                  | ✅             | ❌              | ❌               | ❌       |
|                                      | Assign Courses to Departments   | ✅             | ✅              | ❌               | ❌       |
|                                      | Remove Courses from Departments | ✅             | ✅              | ❌               | ❌       |
|                                      | View Course Details             | ✅             | ✅              | ✅               | ✅       |
|                                      | Access Course Content           | ✅             | ❌              | ✅               | ✅       |
|                                      | Take Tutorials                  | ✅             | ❌              | ✅               | ✅       |
|                                      | Take Quizzes                    | ✅             | ❌              | ✅               | ✅       |
| **📋 Tutorial Management**           |
|                                      | View Tutorials                  | ✅             | ❌              | ✅               | ✅       |
|                                      | Create Tutorials                | ✅             | ❌              | ❌               | ❌       |
|                                      | Update Tutorials                | ✅             | ❌              | ❌               | ❌       |
|                                      | Delete Tutorials                | ✅             | ❌              | ❌               | ❌       |
|                                      | Assign Tutorials                | ✅             | ❌              | ❌               | ❌       |
| **🧪 Quiz Management**               |
|                                      | View Quizzes                    | ✅             | ❌              | ✅               | ✅       |
|                                      | Create Quizzes                  | ✅             | ❌              | ❌               | ❌       |
|                                      | Update Quizzes                  | ✅             | ❌              | ❌               | ❌       |
|                                      | Delete Quizzes                  | ✅             | ❌              | ❌               | ❌       |
|                                      | Assign Quizzes                  | ✅             | ❌              | ❌               | ❌       |
|                                      | Take Quizzes                    | ✅             | ❌              | ✅               | ✅       |
| **📊 Quiz Results & Assessment**     |
|                                      | View Own Results                | ✅             | ❌              | ✅               | ✅       |
|                                      | View Department Results         | ✅             | ❌              | ✅               | ❌       |
|                                      | View Company Results            | ✅             | ✅              | ❌               | ❌       |
|                                      | View Global Results             | ✅             | ❌              | ❌               | ❌       |
|                                      | Export Results                  | ✅             | ❌              | ✅               | ❌       |
| **📈 Progress Tracking & Analytics** |
|                                      | View Own Progress               | ✅             | ❌              | ✅               | ✅       |
|                                      | View Department Progress        | ✅             | ❌              | ✅               | ❌       |
|                                      | View Company Progress           | ✅             | ✅              | ❌               | ❌       |
|                                      | View Global Progress            | ✅             | ❌              | ❌               | ❌       |
|                                      | View Own Analytics              | ✅             | ❌              | ✅               | ✅       |
|                                      | View Department Analytics       | ✅             | ❌              | ✅               | ❌       |
|                                      | View Company Analytics          | ✅             | ✅              | ❌               | ❌       |
|                                      | View Global Analytics           | ✅             | ❌              | ❌               | ❌       |
|                                      | Export Reports                  | ✅             | ❌              | ✅               | ❌       |
| **📧 Communication & Notifications** |
|                                      | Send Notifications              | ✅             | ✅              | ✅               | ❌       |
|                                      | Receive Notifications           | ✅             | ✅              | ✅               | ✅       |
|                                      | Manage Notification Settings    | ✅             | ✅              | ✅               | ✅       |
|                                      | Email Notifications             | ✅             | ✅              | ✅               | ✅       |
|                                      | Push Notifications              | ✅             | ✅              | ✅               | ✅       |
| **📁 File Management**               |
|                                      | Upload Company Files            | ✅             | ✅              | ❌               | ❌       |
|                                      | Upload Department Files         | ✅             | ❌              | ✅               | ❌       |
|                                      | Upload Personal Files           | ✅             | ❌              | ✅               | ✅       |
|                                      | Upload Course Thumbnails        | ✅             | ❌              | ❌               | ❌       |
|                                      | Upload Tutorial Assets          | ✅             | ❌              | ❌               | ❌       |
|                                      | Upload Video Content            | ✅             | ❌              | ❌               | ❌       |
|                                      | Upload CSV Files                | ✅             | ✅              | ❌               | ❌       |
|                                      | Resize Images                   | ✅             | ❌              | ❌               | ❌       |
|                                      | Generate Thumbnails             | ✅             | ❌              | ❌               | ❌       |
| **🔒 Security & Access Control**     |
|                                      | View Audit Logs                 | ✅             | ❌              | ❌               | ❌       |
|                                      | Manage User Permissions         | ✅             | ❌              | ❌               | ❌       |
|                                      | System Configuration            | ✅             | ❌              | ❌               | ❌       |
|                                      | Access Control Validation       | ✅             | ✅              | ✅               | ✅       |
|                                      | Department Access Validation    | ✅             | ✅              | ✅               | ❌       |
|                                      | Company Access Validation       | ✅             | ✅              | ❌               | ❌       |
|                                      | Input Sanitization              | ✅             | ✅              | ✅               | ✅       |
|                                      | Request Metadata Collection     | ✅             | ✅              | ✅               | ✅       |
|                                      | Cache Management                | ✅             | ✅              | ❌               | ❌       |
|                                      | Rate Limiting                   | ✅             | ✅              | ✅               | ✅       |
| **⚙️ System & Platform Management**  |
|                                      | Admin Dashboard Access          | ✅             | ❌              | ❌               | ❌       |
|                                      | System Monitoring               | ✅             | ❌              | ❌               | ❌       |
|                                      | Database Management             | ✅             | ❌              | ❌               | ❌       |
|                                      | Backup & Recovery               | ✅             | ❌              | ❌               | ❌       |
|                                      | System Updates                  | ✅             | ❌              | ❌               | ❌       |
|                                      | Performance Optimization        | ✅             | ❌              | ❌               | ❌       |
| **🔄 Business Workflows**            |
|                                      | Employee Registration           | ✅             | ✅              | ✅               | ❌       |
|                                      | Course Assignment               | ✅             | ✅              | ❌               | ❌       |
|                                      | Progress Tracking               | ✅             | ✅              | ✅               | ✅       |
|                                      | Department Management           | ✅             | ✅              | ✅               | ❌       |
|                                      | Quiz Completion                 | ✅             | ❌              | ✅               | ✅       |
|                                      | Notification System             | ✅             | ✅              | ✅               | ✅       |
| **📱 Platform Access**               |
|                                      | Web Application                 | ✅             | ✅              | ✅               | ✅       |
|                                      | Mobile Application              | ✅             | ✅              | ✅               | ✅       |
|                                      | API Access                      | ✅             | ✅              | ✅               | ✅       |
|                                      | Admin Dashboard                 | ✅             | ❌              | ❌               | ❌       |
|                                      | Company Portal                  | ✅             | ✅              | ❌               | ❌       |
|                                      | Department Portal               | ✅             | ✅              | ✅               | ❌       |
|                                      | User Portal                     | ✅             | ✅              | ✅               | ✅       |

---

## 📊 **Access Summary**

| User Type               | Total Features | Access Level     | Description                               |
| ----------------------- | -------------- | ---------------- | ----------------------------------------- |
| **👑 Platform Owner**   | 100%           | Full Access      | Complete control over the entire platform |
| **🏢 Company Account**  | ~60%           | Company Level    | Company-wide management and operations    |
| **🎯 Department Admin** | ~40%           | Department Level | Department-level management and oversight |
| **👤 Employee**         | ~25%           | Individual Level | Personal learning and profile management  |

---

## 🔑 **Key Permission Patterns**

- **Platform Owner**: Has access to all features and can perform any action
- **Company Account**: Can manage company-wide operations, departments, and employees
- **Department Admin**: Can manage their own department and department employees
- **Employee**: Can only access personal features and assigned learning content

## 📝 **Legend**

- ✅ = **Full Access** - Can perform this action
- ❌ = **No Access** - Cannot perform this action
