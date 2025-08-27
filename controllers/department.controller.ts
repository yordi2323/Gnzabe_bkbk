import Department from '../model/departmentModel';
import dbFactory from '../dbOperations/dbFactory';
import { catchAsync } from '../utilities/catchAsync';
import { AppError } from '../utilities/appError';
import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import User from '../model/userModel';
import { logAction } from '../utilities/auditLogger';
import { sendNotification } from '../services/notification.service';
import redisClient from '../services/redis/redis.service';
import { clearCache } from '../services/redis/cache.service';
import RedisClient from '../services/redis/redis.service';

// export const getAllDepartments = dbFactory.getAll(Department);
export const getDepartment = dbFactory.getOne(Department);

// export const createDepartment = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const companyId = req.company?._id;
//     if (!companyId) return next(new AppError('Company ID is required', 400));
//     const company = await Company.findById(companyId);
//     const { name } = req.body;

//     const department = await Department.create({ name, companyId });

//     company!.departments.push({ id: department.id, name: department.name });
//     await company!.save();

//     res.status(201).json({
//       status: 'success',
//       message: 'Department created successfully',
//       data: {
//         department,
//       },
//     });
//   },
// );

export const createDepartment = dbFactory.createOne(Department);

export const assignDepartmentAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    console.log('high');
    console.log('req.query:', req.query); // Debugging line
    const { departmentId, employeeId } = req.query;
    const company = req.company; // Populate employees with specific fields
    console.log(company);
    if (!company) {
      return next(new AppError('Company not found', 404));
    }
    console.log(company.departments, departmentId); // Fixed variable name
    const isDeparmtentBelognToCompany = company.departments.find(
      (department) => department.id.toString() === departmentId,
    );
    if (!isDeparmtentBelognToCompany) {
      return next(
        new AppError(
          'Unauthorized action, Department does not belong to this company!',
          403,
        ),
      );
    }

    const doesEmployeeBelongToCompany = company?.employees?.find(
      (employee) => employee.id.toString() === employeeId,
    );
    if (!doesEmployeeBelongToCompany) {
      return next(
        new AppError(
          'Unauthorized action, Employee does not belong to this company!',
          403,
        ),
      );
    }
    const employee = await User.findById(employeeId);
    if (!employee) {
      return next(new AppError('Employee not found', 404));
    }
    // if (!employee.isVerified) {
    //   return next(new AppError('Employee is not verified', 403));
    // }
    // if (!employee.isApproved) {
    //   return next(new AppError('Employee is not approved by company', 403));
    // }
    if (employee.departmentId?.toString() !== departmentId) {
      return next(
        new AppError(
          'Unauthorized action, Employee does not belong to this department!',
          403,
        ),
      );
    }
    if (employee.role === 'departmentAdmin') {
      return next(new AppError('Employee is already a department admin', 400));
    }

    const department = await Department.findById(departmentId);
    if (!department) {
      return next(new AppError('Department not found', 404));
    }

    if (department.departmentAdmin?.id) {
      return next(new AppError('Department already has an admin', 400));
    }

    department.departmentAdmin = {
      id: employee._id as Types.ObjectId,
      name: employee.fullName,
      email: employee.email,
      phoneNumber: employee.phoneNumber,
      role: 'departmentAdmin',
      isApproved: employee.isApproved,
    };

    department.save({ validateBeforeSave: false });
    employee.role = 'departmentAdmin';
    employee.save({ validateBeforeSave: false });
    const error = await logAction({
      performedBy: {
        id: req.company?._id as Types.ObjectId,
        name: req.company?.name,
        email: req.user?.email,
      },
      action: 'ASSIGN_DEPARTMENT_ADMIN',
      departmentId: department._id as Types.ObjectId,
      companyId: req.company?._id as Types.ObjectId,
      timeStamp: new Date(),
      requestMetadData: req.requestMetaData,
    });
    if (error) {
      return next(error);
    }
    await clearCache(`departments_${department.companyId}`);

    res.status(200).json({
      status: 'success',
      message: 'Department admin assigned successfully',
      data: {
        document: department,
      },
    });
  },
);

export const revokeDepartmentAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { departmentId, employeeId } = req.query;
    const company = req.company;

    if (!company) {
      return next(new AppError('Company not found', 404));
    }

    const department = await Department.findById(departmentId);
    if (!department) {
      return next(new AppError('Department not found', 404));
    }

    if (department.departmentAdmin?.id.toString() !== employeeId) {
      return next(
        new AppError(
          'Unauthorized action, Employee is not the department admin of this department!',
          403,
        ),
      );
    }

    const isDeparmtentBelognToCompany = company.departments.find(
      (department) => department.id.toString() === departmentId,
    );
    if (!isDeparmtentBelognToCompany) {
      return next(
        new AppError(
          'Unauthorized action, Department does not belong to this company!',
          403,
        ),
      );
    }

    const employee = await User.findById(employeeId);
    if (!employee) {
      return next(new AppError('Employee not found', 404));
    }
    employee.role = 'employee';
    employee.save({ validateBeforeSave: false });

    const error = await logAction({
      performedBy: {
        id: req.company?._id as Types.ObjectId,
        name: req.company?.name,
        email: req.user?.email,
      },
      action: 'REVOKE_DEPARTMENT_ADMIN',
      departmentId: department._id as Types.ObjectId,
      companyId: req.company?._id as Types.ObjectId,
      timeStamp: new Date(),
      requestMetadData: req.requestMetaData,
    });
    if (error) {
      return next(error);
    }

    res.status(200).json({
      status: 'success',
      message: 'Department admin revoked successfully',
      data: {
        document: department,
      },
    });
  },
);

export const removeEmployeeFromDepartment = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // const { id } = req.params;
    const { employeeId } = req.query;

    if (!employeeId) {
      return next(new AppError('Employee ID is required', 400));
    }

    if (req.user?.id.toString() === employeeId.toString())
      return next(new AppError('You are not allowed to remove your self', 403));

    const department = req.department;
    if (!department) {
      return next(new AppError('Department not found', 404));
    }

    const employee = await User.findById(employeeId);
    if (!employee) return next(new AppError('Employee not found!', 404));

    const employeeIndex = department.employees.findIndex(
      (emp) => emp.id.toString() === employeeId,
    );

    if (employeeIndex === -1) {
      return next(new AppError('Employee not found in this department', 404));
    }
    if (department?.departmentAdmin?.id?.toString() === employeeId)
      return next(
        new AppError(
          'Cannot remove department admin from the department. Please revoke admin preivilage fisrt.',
          400,
        ),
      );

    department.employees.splice(employeeIndex, 1);
    employee.departmentId = null;
    await department.save({ validateBeforeSave: false });
    await employee.save({ validateBeforeSave: false });

    const error = await logAction({
      performedBy: {
        id: req.company?._id as Types.ObjectId,
        name: req.company?.name,
        email: req.user?.email,
      },
      action: 'REMOVE_EMPLOYEE_FROM_DEPARTMENT',
      departmentId: department._id as Types.ObjectId,
      companyId: req.company?._id as Types.ObjectId,
      timeStamp: new Date(),
      requestMetadData: req.requestMetaData,
    });
    if (error) {
      return next(error);
    }

    res.status(200).json({
      status: 'success',
      message: 'Employee removed from department successfully',
      data: {
        document: department,
      },
    });
  },
);

export const addEmployeeToDepartment = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { employeeId, departmentId } = req.query;
    if (!employeeId) {
      return next(new AppError('Employee ID is required', 400));
    }

    const department = await Department.findById(departmentId);
    if (!department) {
      return next(new AppError('Department not found', 404));
    }

    const company = req.company;
    if (!company) {
      return next(new AppError('Company not found', 404));
    }

    const doesEmployeeBelongToCompany = company?.employees?.find(
      (employee) => employee.id.toString() === employeeId,
    );

    if (!doesEmployeeBelongToCompany) {
      return next(
        new AppError(
          'Unauthorized action, Employee does not belong to this company!',
          403,
        ),
      );
    }

    const doesDepartmentBelongToCompany = company?.departments?.find(
      (dept) => dept.id.toString() === department.id.toString(),
    );
    if (!doesDepartmentBelongToCompany) {
      return next(
        new AppError(
          'Unauthorized action, Department does not belong to this company!',
          403,
        ),
      );
    }

    const employee = await User.findById(employeeId);
    if (!employee) return next(new AppError('Employee not found!', 404));

    if (employee.departmentId) {
      return next(new AppError('Employee already assigned to department', 400));
    }

    employee.departmentId = department.id;
    await employee.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      message: 'Employee added to department successfully',
      data: {
        document: employee,
      },
    });
  },
);

export const deactiveDepartment = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const departmentId = req.query.departmentId || req.params.id;
    const department = await Department.findById(departmentId);
    if (!department) {
      return next(new AppError('Department not found', 404));
    }
    if (department.isActive === false) {
      return next(new AppError('Department is already deactivated', 400));
    }
    department.isActive = false;
    await department.save({ validateBeforeSave: false });
    const error = await logAction({
      performedBy: {
        id: req.company?._id as Types.ObjectId,
        name: req.company?.name,
        email: req.user?.email,
      },
      action: 'DEACTIVATE_DEPARTMENT',
      departmentId: department._id as Types.ObjectId,
      companyId: req.company?._id as Types.ObjectId,
      timeStamp: new Date(),
      requestMetadData: req.requestMetaData,
    });
    if (error) {
      return next(error);
    }
    // NOTE send notification to company account
    await sendNotification({
      recipient: department.companyId.toString(),
      title: 'Department Deactivated',
      type: 'departmentDeactivated',
      message: `${department.name} has been deactivated successfully.`,
    });
    // NOTE send notification to department admin
    if (department.departmentAdmin?.id) {
      await sendNotification({
        recipient: department.departmentAdmin.id.toString(),
        title: 'Department Deactivated',
        type: 'departmentDeactivated',
        message: `${department.name} has been deactivated successfully.`,
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Department deactivated successfully',
      data: {
        document: department,
      },
    });
  },
);

export const activateDepartment = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const departmentId = req.query.departmentId || req.params.id;
    const department = await Department.findById(departmentId);
    if (!department) {
      return next(new AppError('Department not found', 404));
    }
    if (department.isActive === true) {
      return next(new AppError('Department is already active', 400));
    }
    department.isActive = true;
    await department.save({ validateBeforeSave: false });
    const error = await logAction({
      performedBy: {
        id: req.company?._id as Types.ObjectId,
        name: req.company?.name,
        email: req.user?.email,
      },
      action: 'ACTIVATE_DEPARTMENT',
      departmentId: department._id as Types.ObjectId,
      companyId: req.company?._id as Types.ObjectId,
      timeStamp: new Date(),
      requestMetadData: req.requestMetaData,
    });
    if (error) {
      return next(error);
    }
    // NOTE send notification to company account
    await sendNotification({
      recipient: department.companyId.toString(),
      title: 'Department Activated',
      type: 'departmentActivated',
      message: `You have successfully verified otp verification in at`,
    });
    // NOTE send notification to department admin
    if (department.departmentAdmin?.id) {
      await sendNotification({
        recipient: department.departmentAdmin.id.toString(),
        title: 'Department Activated',
        type: 'departmentActivated',
        message: `Your department ${department.name} has been activated successfully.`,
      });
    }
    res.status(200).json({
      status: 'success',
      message: 'Department activated successfully',
      data: {
        document: department,
      },
    });
  },
);

export const getAllDepartments = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { key } = req.query;
    const company = req.company;
    if (!company) {
      return next(new AppError('Company not found', 404));
    }

    const departments = await Department.find({
      companyId: req.company?._id,
    }).lean();

    if (key && typeof key === 'string') {
      const redisInstance = await RedisClient.getInstance();
      const redisClient = redisInstance.getClient();
      await redisClient.set(key, JSON.stringify(departments), {
        EX: 300,
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        departments,
      },
    });
  },
);

export const assignCourseToDepartment = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.company) {
      const { departmentId, courseId } = req.body;
      if (!departmentId || !courseId) {
        return next(
          new AppError('departmentId and courseId are required', 400),
        );
      }
      const department = await Department.findById(departmentId);
      if (!department) {
        return next(new AppError('Department not found', 404));
      }
      // Check if course is already assigned
      const alreadyAssigned = department.coursesAssignedToDepartment.some(
        (id) => id.toString() === courseId.toString(),
      );
      if (alreadyAssigned) {
        return next(new AppError('Course already assigned to department', 400));
      }
      department.coursesAssignedToDepartment.push(
        new Types.ObjectId(courseId as string),
      );
      await department.save({ validateBeforeSave: false });
      res.status(200).json({
        status: 'success',
        message: 'Course assigned to department successfully',
        data: {
          document: department,
        },
      });
    } else if (req.user?.role === 'departmentAdmin') {
      const { courseId } = req.body;
      const departmentId = req.user?.departmentId;
      if (!departmentId || !courseId) {
        return next(
          new AppError('departmentId and courseId are required', 400),
        );
      }
      const department = await Department.findById(departmentId);
      if (!department) {
        return next(new AppError('Department not found', 404));
      }
      // Check if course is already assigned
      const alreadyAssigned = department.coursesAssignedToDepartment.some(
        (id) => id.toString() === courseId.toString(),
      );
      if (alreadyAssigned) {
        return next(new AppError('Course already assigned to department', 400));
      }
      department.coursesAssignedToDepartment.push(
        new Types.ObjectId(courseId as string),
      );
      await department.save({ validateBeforeSave: false });
      res.status(200).json({
        status: 'success',
        message: 'Course assigned to department successfully',
        data: {
          document: department,
        },
      });
    }
  },
);

export const getDepartmentProgress = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const department = await Department.findById(id);
    if (!department) {
      return next(new AppError('Department not found', 404));
    }
    const courseIds = department.coursesAssignedToDepartment.map((id) => id);

    // Aggregate user progress for employees in this department and assigned courses
    const progress = await User.aggregate([
      { $match: { departmentId: department._id } },
      { $unwind: '$learningProgress' },
      { $match: { 'learningProgress.courseId': { $in: courseIds } } },
      {
        $group: {
          _id: '$learningProgress.courseId',
          avgProgress: { $avg: '$learningProgress.progress' },
          completedCount: {
            $sum: {
              $cond: [{ $gte: ['$learningProgress.progress', 100] }, 1, 0],
            },
          },
          totalEmployees: { $sum: 1 },
          employees: { $push: '$_id' },
        },
      },
      {
        $project: {
          courseId: '$_id',
          avgProgress: 1,
          completedCount: 1,
          totalEmployees: 1,
          employees: 1,
          _id: 0,
        },
      },
    ]);
    const document = {
      department: department.name,
      departmentId: department._id,
      courses: progress,
    };
    res.status(200).json({
      status: 'success',
      data: document,
    });
  },
);
