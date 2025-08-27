import { Request, Response, NextFunction } from 'express';
import dbFactory from '../dbOperations/dbFactory';
import Course from '../model/courseModel';
import Department from '../model/departmentModel';
import { AppError } from '../utilities/appError';
import { catchAsync } from '../utilities/catchAsync';

export const getAllCourses = dbFactory.getAll(Course);
export const getCourse = dbFactory.getOne(Course, { path: 'tutorials' });
export const createCourse = dbFactory.createOne(Course);
export const updateCourse = dbFactory.updateOne(Course);

export const getCourseForDepartmen = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.company) return next();
    if (req.platformOwner) return next();
    if (req.user?.role === 'departmentAdmin') return next();

    const user = req.user;
    if (!user) {
      return next(new AppError('User not authenticated', 401));
    }
    const departmentId = user.departmentId;
    if (!departmentId) {
      return next(new AppError('User does not belong to a department', 400));
    }
    // Department is in cloud DB
    const department = await Department.findById(departmentId).populate(
      'coursesAssignedToDepartment',
    );
    if (!department) {
      return next(new AppError('Department not found', 404));
    }
    console.log('We are on get course for department');
    res.status(200).json({
      status: 'success',
      results: department.coursesAssignedToDepartment.length,
      data: {
        documents: department.coursesAssignedToDepartment,
      },
    });
  },
);
// export const deleteCourse = dbFactory.deleteOne(Course);
