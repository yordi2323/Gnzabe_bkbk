import { NextFunction, Request, Response } from 'express';
import User from '../model/userModel';
import dbFactory from '../dbOperations/dbFactory';
import { catchAsync } from '../utilities/catchAsync';
import { AppError } from '../utilities/appError';
import { Types } from 'mongoose';
import { logAction } from '../utilities/auditLogger';
import Department from '../model/departmentModel';
import { IDepartment } from '../interfaces/departmentInterface';

export const getAllUsers = dbFactory.getAll(User);
export const getUser = dbFactory.getOne(User);
export const updateUser = dbFactory.updateOne(User, [
  'email',
  'password',
  'role',
  'isActive',
  'isVerified',
  'failedLoginAttempts',
  'verificationToken',
  'verificationTokenExpiry',
  'resetPasswordToken',
  'resetPasswordTokenExpiry',
  'isApproved',
  'createdAt',
  'updatedAt',
]);

export const approveUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { employeeId } = req.query;
    console.log(employeeId);
    const employee = await User.findById(employeeId);
    if (!employee) {
      return next(new AppError('Employee not found', 404));
    }
    console.log(employee);
    if (
      employee.companyId.toString() !== req.department?.companyId.toString()
    ) {
      return next(
        new AppError(
          'Unauthorized action, Employee does not belong to this company!',
          403,
        ),
      );
    }
    if (employee.isApproved) {
      return next(new AppError('Employee is already approved', 400));
    }
    if (req.user) {
      if (employee.departmentId?.toString() !== req.department.id.toString()) {
        return next(
          new AppError(
            'Unauthorized action, Employee does not belong to this department!',
            403,
          ),
        );
      }
    }
    employee.isApproved = true;
    await employee.save({ validateBeforeSave: false });
    res.status(200).json({
      status: 'success',
      message: 'Employee approved successfully',
      data: {
        document: employee,
      },
    });
  },
);

export const disApproveUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { employeeId } = req.query;
    const employee = await User.findById(employeeId);
    if (!employee) {
      return next(new AppError('Employee not found', 404));
    }
    if (
      employee.companyId.toString() !== req.department?.companyId.toString()
    ) {
      return next(
        new AppError(
          'Unauthorized action, Employee does not belong to this company!',
          403,
        ),
      );
    }
    if (!employee.isApproved) {
      return next(new AppError('Employee is not approved!', 400));
    }
    employee.isApproved = false;
    await employee.save({ validateBeforeSave: false });

    // Log the disapproval action
    const error = await logAction({
      performedBy: {
        id:
          (req.company?._id as Types.ObjectId) ||
          (req.user?._id as Types.ObjectId),
        name: req.user?.fullName || req.company?.name,
        email: req.user?.email || req.company?.primaryEmail,
      },
      action: 'DISAPPROVE_EMPLOYEE',
      employeeId: employee._id as Types.ObjectId,
      companyId: employee.companyId as Types.ObjectId,
      timestamp: new Date(),
      requestMetadData: req.requestMetaData,
    });
    if (error) {
      console.log(req.requestMetaData);
      return next(error);
    }
    res.status(200).json({
      status: 'success',
      message: 'Employee disapproved successfully',
      data: {
        document: employee,
      },
    });
  },
);

export const updateMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id = req.user!._id;
    if (id !== req.user?._id) {
      return next(new AppError('You can only update your own profile', 403));
    }
    const { fullName, photo } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { fullName, photo },
      {
        new: true,
        runValidators: false,
      },
    );
    if (!updatedUser) {
      return next(new AppError('User not found', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        document: updatedUser,
      },
    });
  },
);

export const getCurrentUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('No User found with this id', 404));
    }
    console.log(req.user);
    res.status(200).json({
      status: 'success',
      data: {
        document: req.user,
      },
    });
  },
);

export const getAssignedCourses = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError('No User found with this id', 404));

    const assignedCourses = await Department.findById(
      req.user.departmentId,
    ).select('assignedCourses');
  },
);

export const terminateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    if (req.user?.id.toString() === id)
      return next(new AppError('You are not allowed to remove your self', 403));

    // if (user.departmentId) {
    //   return next(
    //     new AppError(
    //       'User is part of a department please first remove user from department',
    //       403,
    //     ),
    //   );
    // }
    if (req.company) {
      if (req.company.id.toString() !== user.companyId.toString())
        return next(new AppError('User does not belong to this company', 400));
      let department: IDepartment | null = null;

      if (user.departmentId)
        department = await Department.findById(user.departmentId);

      if (department) {
        if (department?.departmentAdmin?.id?.toString() === user.id.toString())
          return next(
            new AppError(
              'Cannot remove department admin from the department. Please revoke admin preivilage fisrt.',
              400,
            ),
          );

        const employeeIndex = department.employees.findIndex(
          (employee) => employee.id.toString() === user.id.toString(),
        );
        console.log(employeeIndex);
        if (employeeIndex !== -1) {
          department.employees.splice(employeeIndex, 1);
          await department.save();
        }
      }
      await user.deleteOne();
    } else if (req.user) {
      if (req.user.companyId.toString() !== user.companyId.toString())
        return next(new AppError('User does not belong to this company', 400));
      if (req.user.role !== 'departmentAdmin')
        return next(
          new AppError('You are not authorized to terminate this user', 403),
        );
      let department: IDepartment | null = null;

      if (user.departmentId)
        department = await Department.findById(user.departmentId);

      if (department) {
        if (department?.departmentAdmin?.id?.toString() === user.id.toString())
          return next(
            new AppError(
              'Cannot remove department admin from the department. Please revoke admin preivilage fisrt.',
              400,
            ),
          );

        const employeeIndex = department.employees.findIndex(
          (employee) => employee.id.toString() === user.id.toString(),
        );

        console.log(employeeIndex, 'employee index');

        if (employeeIndex !== -1) {
          department.employees.splice(employeeIndex, 1);
          await department.save();
        }
      }
      await user.deleteOne();
    }

    res.status(200).json({
      status: 'success',
      message: 'User terminated successfully',
      data: {
        document: null,
      },
    });
  },
);

// NOTE to be implemented
export const getMyRanking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('No user found', 404));
    }
    if (!req.user.departmentId) {
      return next(new AppError('User does not belong to a department', 400));
    }

    const department = await Department.findById(
      req.user.departmentId,
    ).populate('employees');
    if (!department) {
      return next(new AppError('Department not found', 404));
    }

    // Assume each employee has a learningProgress array with quizScore property
    const employeesWithScores = await Promise.all(
      department.employees.map(async (employee: any) => {
        // If employee is just an ObjectId, populate it
        if (!employee.learningProgress) {
          const userDoc = await User.findById(employee.id);
          return {
            id: employee.id,
            totalScore:
              userDoc?.learningProgress?.reduce(
                (sum: number, lp: any) => sum + (lp.quizScore || 0),
                0,
              ) || 0,
          };
        }
        return {
          id: employee.id,
          totalScore: employee.learningProgress.reduce(
            (sum: number, lp: any) => sum + (lp.quizScore || 0),
            0,
          ),
        };
      }),
    );

    // Sort employees by totalScore descending
    employeesWithScores.sort((a, b) => b.totalScore - a.totalScore);

    // Find current user's rank (1-based)
    const myIndex = employeesWithScores.findIndex(
      (emp) => emp.id.toString() === req.user?.id.toString(),
    );
    const myRank = myIndex !== -1 ? myIndex + 1 : null;

    res.status(200).json({
      status: 'success',
      data: {
        rank: myRank,
        totalEmployees: employeesWithScores.length,
        scores: employeesWithScores,
      },
    });
  },
);
