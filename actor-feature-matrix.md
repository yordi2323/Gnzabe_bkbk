# Gnezabe Security Training Platform - Actor Feature Matrix

## Overview

This document outlines the different user types (actors) in the Gnezabe Security Training Platform, their capabilities, and restrictions. The platform supports four main actor types with distinct roles and permissions.

## Actor Types

### 1. 🏢 **Company Account**

- **Role**: Company Administrator
- **Description**: Represents an organization that uses the platform
- **Authentication**: Company-specific login credentials

### 2. 👤 **Employee**

- **Role**: Regular Employee
- **Description**: Individual user within a company department
- **Authentication**: Personal login credentials
- **Scope**: Limited to their assigned department and courses

### 3. 🎯 **Department Admin**

- **Role**: Department Administrator
- **Description**: Employee with administrative privileges for their department
- **Authentication**: Personal login credentials (same as employee)
- **Scope**: Department-level management within their assigned department

### 4. 👑 **Platform Owner**

- **Role**: System Administrator
- **Description**: Platform-level administrator with global access
- **Authentication**: Platform-level credentials
- **Scope**: Global platform management

---

## Feature Matrix

| Feature Category                 | Feature | Company Account | Employee | Department Admin | Platform Owner |
| -------------------------------- | ------- | --------------- | -------- | ---------------- | -------------- |
| **🔐 Authentication & Profile**  |
| Login/Logout                     | ✅      | ✅              | ✅       | ✅               |
| Password Reset                   | ✅      | ✅              | ✅       | ✅               |
| MFA Management                   | ✅      | ✅              | ✅       | ✅               |
| Profile Update                   | ✅      | ✅              | ✅       | ✅               |
| Language Preferences             | ✅      | ✅              | ✅       | ✅               |
| Theme Preferences                | ✅      | ✅              | ✅       | ✅               |
| **👥 User Management**           |
| View Own Profile                 | ✅      | ✅              | ✅       | ✅               |
| Update Own Profile               | ✅      | ✅              | ✅       | ✅               |
| View Company Employees           | ✅      | ❌              | ❌       | ✅               |
| View Department Employees        | ❌      | ❌              | ✅       | ✅               |
| Approve Employee Registration    | ❌      | ❌              | ✅       | ✅               |
| Disapprove Employee              | ❌      | ❌              | ✅       | ✅               |
| Terminate Employee               | ❌      | ❌              | ❌       | ✅               |
| **🏢 Company Management**        |
| View Company Info                | ✅      | ❌              | ❌       | ✅               |
| Update Company Info              | ✅      | ❌              | ❌       | ✅               |
| Manage Company Logo              | ✅      | ❌              | ❌       | ✅               |
| **🏗️ Department Management**     |
| View Company Departments         | ✅      | ❌              | ❌       | ✅               |
| Create Departments               | ✅      | ❌              | ❌       | ✅               |
| Update Departments               | ✅      | ❌              | ❌       | ✅               |
| Delete Departments               | ✅      | ❌              | ❌       | ✅               |
| Assign Department Admin          | ✅      | ❌              | ❌       | ✅               |
| **📚 Course Management**         |
| View Available Courses           | ✅      | ✅              | ✅       | ✅               |
| Create Courses                   | ❌      | ❌              | ❌       | ✅               |
| Update Courses                   | ❌      | ❌              | ❌       | ✅               |
| Delete Courses                   | ❌      | ❌              | ❌       | ✅               |
| Assign Courses to Departments    | ✅      | ❌              | ❌       | ✅               |
| Remove Courses from Departments  | ✅      | ❌              | ❌       | ✅               |
| **🎯 Course Access**             |
| Access Department Courses        | ❌      | ✅              | ✅       | ✅               |
| Access All Courses               | ❌      | ❌              | ❌       | ✅               |
| **📖 Learning & Progress**       |
| View Course Content              | ❌      | ✅              | ✅       | ✅               |
| Take Tutorials                   | ❌      | ✅              | ✅       | ✅               |
| Take Quizzes                     | ❌      | ✅              | ✅       | ✅               |
| View Own Progress                | ❌      | ✅              | ✅       | ✅               |
| View Department Progress         | ❌      | ❌              | ✅       | ✅               |
| View Company Progress            | ✅      | ❌              | ❌       | ✅               |
| View Global Progress             | ❌      | ❌              | ❌       | ✅               |
| **📊 Analytics & Reporting**     |
| View Own Analytics               | ❌      | ✅              | ✅       | ✅               |
| View Department Analytics        | ❌      | ❌              | ✅       | ✅               |
| View Company Analytics           | ✅      | ❌              | ❌       | ✅               |
| View Global Analytics            | ❌      | ❌              | ❌       | ✅               |
| Export Reports                   | ❌      | ❌              | ✅       | ✅               |
| **📧 Communication**             |
| Receive Notifications            | ✅      | ✅              | ✅       | ✅               |
| Send Company Notifications       | ✅      | ❌              | ❌       | ✅               |
| Send Department Notifications    | ❌      | ❌              | ✅       | ✅               |
| Send Global Notifications        | ❌      | ❌              | ❌       | ✅               |
| **🔒 Security & Access Control** |
| View Audit Logs                  | ❌      | ❌              | ❌       | ✅               |
| Manage User Permissions          | ❌      | ❌              | ❌       | ✅               |
| System Configuration             | ❌      | ❌              | ❌       | ✅               |
| **📁 File Management**           |
| Upload Company Files             | ✅      | ❌              | ❌       | ✅               |
| Upload Department Files          | ❌      | ❌              | ✅       | ✅               |
| Upload Personal Files            | ❌      | ✅              | ✅       | ✅               |
| View Company Files               | ✅      | ❌              | ❌       | ✅               |
| View Department Files            | ❌      | ❌              | ✅       | ✅               |
| View Personal Files              | ❌      | ✅              | ✅       | ✅               |

---

## Detailed Capabilities by Actor

### 🏢 **Company Account Capabilities**

#### ✅ **Can Do:**

- Manage company profile and settings
- Create, update, and delete departments
- Assign courses to departments
- View all company employees and their progress
- Manage company-wide notifications
- Upload and manage company-level files
- View company-wide analytics and reports
- Approve/disapprove employee registrations (through department admins)

#### ❌ **Cannot Do:**

- Access individual course content
- Take quizzes or tutorials
- View individual employee profiles in detail
- Manage platform-level settings
- Access other companies' data
- Create or modify course content

### 👤 **Employee Capabilities**

#### ✅ **Can Do:**

- Access courses assigned to their department
- Take tutorials and quizzes
- View own learning progress
- Update personal profile
- Manage personal preferences
- Upload personal files
- Receive notifications
- View own analytics

#### ❌ **Cannot Do:**

- Access courses not assigned to their department
- View other employees' progress
- Manage department settings
- Approve other employees
- Access company-level settings
- View company-wide analytics
- Send company or department notifications

### 🎯 **Department Admin Capabilities**

#### ✅ **Can Do:**

- All Employee capabilities
- View department employee progress
- Approve/disapprove department employees
- View department analytics and reports
- Send department notifications
- Upload department files
- Export department reports
- Manage department-specific settings

#### ❌ **Cannot Do:**

- Access other departments' data
- Manage company-level settings
- Create or delete departments
- Assign courses to departments
- View company-wide analytics
- Access platform-level settings
- Manage other departments' employees

### 👑 **Platform Owner Capabilities**

#### ✅ **Can Do:**

- All capabilities of other actors
- Create, update, and delete courses
- Manage all companies and departments
- View global platform analytics
- Access audit logs and system logs
- Manage platform configuration
- Send global notifications
- Manage all user permissions
- Access all data across the platform
- System maintenance and monitoring

#### ❌ **Cannot Do:**

- No restrictions (full platform access)

---

## Access Control Matrix

| Resource Type       | Company Account | Employee    | Department Admin | Platform Owner |
| ------------------- | --------------- | ----------- | ---------------- | -------------- |
| **Own Profile**     | ✅ Full         | ✅ Full     | ✅ Full          | ✅ Full        |
| **Company Data**    | ✅ Full         | ❌ None     | ❌ None          | ✅ Full        |
| **Department Data** | ✅ Full         | ❌ None     | ✅ Own Dept      | ✅ Full        |
| **Employee Data**   | ✅ Company Only | ❌ None     | ✅ Own Dept      | ✅ Full        |
| **Course Content**  | ❌ None         | ✅ Assigned | ✅ Assigned      | ✅ Full        |
| **Progress Data**   | ✅ Company Only | ✅ Own Only | ✅ Own + Dept    | ✅ Full        |
| **Analytics**       | ✅ Company Only | ✅ Own Only | ✅ Own + Dept    | ✅ Full        |
| **System Settings** | ❌ None         | ❌ None     | ❌ None          | ✅ Full        |

---

## Security Considerations

### 🔐 **Authentication Levels**

- **Company Account**: Company-level authentication
- **Employee**: Individual authentication with company scope
- **Department Admin**: Individual authentication with department scope
- **Platform Owner**: Platform-level authentication

### 🛡️ **Data Isolation**

- **Company Data**: Isolated by company ID
- **Department Data**: Isolated by department ID within company
- **User Data**: Isolated by user ID within department
- **Platform Data**: Accessible only to platform owners

### 🔒 **Permission Inheritance**

- Platform Owner > Company Account > Department Admin > Employee
- Higher-level actors inherit capabilities of lower-level actors
- Strict isolation prevents unauthorized cross-access

This actor feature matrix ensures proper access control and data security while providing appropriate functionality for each user type in the Gnezabe Security Training Platform.
