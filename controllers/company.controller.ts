import { Response, Request, NextFunction } from 'express-serve-static-core';
import dbFactory from '../dbOperations/dbFactory';
import Company from '../model/companyModel';
import { catchAsync } from '../utilities/catchAsync';
import { filterCompanyForRegistration } from '../utilities/helper';
import { AppError } from '../utilities/appError';
import User from '../model/userModel';
import Tutorial from '../model/tutorialModel';
import Department from '../model/departmentModel';

export const getAllCompanies = dbFactory.getAll(Company);

export const getCompany = dbFactory.getOne(Company, {
  path: 'employees',
  select:
    '_id fullName email phoneNumber role departmentId isActive isApproved learningProgress',
});

export const updateCompany = dbFactory.updateOne(Company, [
  'primaryEmail',
  'secondaryEmail',
  'password',
  'passwordChangedAt',
  'isActive',
  'isVerified',
  'verificationToken',
  'verificationTokenExpiry',
  'resetPasswordToken',
  'resetPasswordTokenExpiry',
  'failedLoginAttempts',
  'isApproved',
]);

export const getCompaniesFroRegistration = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const documents = await Company.find();
    const filtered = documents.map(filterCompanyForRegistration);
    res.status(200).json({
      status: 'success',
      data: filtered,
    });
  },
);

export const getCurrentCompany = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.company) {
      return next(new AppError('No company found with this id', 404));
    }
    console.log(req.company);
    res.status(200).json({
      status: 'success',
      data: {
        document: req.company,
      },
    });
  },
);

export const getCourseStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { courseId } = req.params;
    if (!courseId) return next(new AppError('Course id required!', 400));

    // 1. Get all tutorials for that course
    const tutorials = await Tutorial.find({ courseId }).select('_id');
    const tutorialIds = tutorials.map((t) =>
      (t._id as string | number | { toString(): string }).toString(),
    );

    // 2. Get all departments assigned to this course
    let departments;
    if (req.company)
      departments = await Department.find({
        coursesAssignedToDepartment: courseId,
        companyId: req.company!._id,
      }).select('employees');
    else
      departments = await Department.find({
        coursesAssignedToDepartment: courseId,
        _id: req.user?.departmentId,
        companyId: req.user?.companyId,
      }).select('employees');
    // 3. Get all employees in those departments
    const employeeIds = departments.flatMap((dept: any) =>
      (dept.employees || []).map((emp: any) => emp.id),
    );
    if (employeeIds.length === 0) {
      return res.status(200).json({
        status: 'success',
        data: {
          completed: 0,
          inProgress: 0,
          notStarted: 0,
          totalEmployees: 0,
        },
      });
    }
    // 4. Get learningProgress for each employee
    const employees = await User.find({ _id: { $in: employeeIds } }).select(
      'learningProgress',
    );

    console.log(employees);

    let completed = 0;
    let inProgress = 0;
    let notStarted = 0;

    employees.forEach((user: any) => {
      // Find learningProgress entry for this course
      const lp = user.learningProgress?.find(
        (lp: any) => lp.courseId?.toString() === courseId,
      );
      if (!lp) {
        notStarted++;
        return;
      }
      // Map of tutorialId to progress
      const tutorialProgress = new Map(
        (lp.tutorials || []).map((t: any) => [t.tutorialId?.toString(), t]),
      );
      // Check if all tutorials are completed
      const allCompleted =
        tutorialIds.length > 0 &&
        tutorialIds.every(
          (id) =>
            tutorialProgress.has(id) &&
            (tutorialProgress.get(id) as any).isCompleted === true &&
            (tutorialProgress.get(id) as any).progress === 100,
        );
      if (allCompleted) {
        completed++;
        return;
      }
      // Check if at least one tutorial is started (progress > 0 or isCompleted true)
      const anyStarted = tutorialIds.some(
        (id) =>
          tutorialProgress.has(id) &&
          ((tutorialProgress.get(id) as any).progress > 0 ||
            (tutorialProgress.get(id) as any).isCompleted === true),
      );
      if (anyStarted) {
        inProgress++;
        return;
      }
      // Otherwise, not started
      notStarted++;
    });

    res.status(200).json({
      status: 'success',
      data: {
        completed,
        inProgress,
        notStarted,
        totalEmployees: employees.length,
      },
    });
  },
);

// export const getCourseStatus = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { courseId } = req.params;
//     if (!courseId) return next(new AppError('Course id required!', 400));

//     // Get all tutorial IDs for the course
//     const tutorials = await Tutorial.find({ courseId }).select('_id');
//     const tutorialIds = tutorials.map((t) =>
//       typeof t._id === 'object' && t._id !== null && 'toString' in t._id
//         ? t._id.toString()
//         : String(t._id),
//     );

//     // Get all employees' learning progress
//     let employeesLearningProgress;

//     if (req.company)
//       employeesLearningProgress = await User.find({
//         companyId: req.company!._id,
//       }).select('learningProgress');
//     else {
//       employeesLearningProgress = await User.find({
//         departmentId: req.user?.departmentId,
//       }).select('learningProgress');
//     }

//     let completed = 0;
//     let inProgress = 0;
//     let notStarted = 0;

//     employeesLearningProgress.forEach((user) => {
//       // Find learningProgress entry for this course
//       const lp = user.learningProgress?.find(
//         (lp: any) => lp.courseId?.toString() === courseId,
//       );
//       if (!lp) {
//         notStarted += tutorialIds.length;
//         return;
//       }
//       // Map of tutorialId to progress
//       const tutorialProgress = new Map(
//         (lp.tutorials || []).map((t: any) => [t.tutorialId?.toString(), t]),
//       );
//       // Check if all tutorials are completed
//       const allCompleted =
//         tutorialIds.length > 0 &&
//         tutorialIds.every(
//           (id) =>
//             tutorialProgress.has(id) &&
//             tutorialProgress.get(id).isCompleted === true &&
//             tutorialProgress.get(id).progress === 100,
//         );
//       if (allCompleted) {
//         completed++;
//         return;
//       }
//       // Check if at least one tutorial is started (progress > 0 or isCompleted true)
//       const anyStarted = tutorialIds.some(
//         (id) =>
//           tutorialProgress.has(id) &&
//           (tutorialProgress.get(id).progress > 0 ||
//             tutorialProgress.get(id).isCompleted),
//       );
//       if (anyStarted) {
//         inProgress++;
//         return;
//       }
//       // Otherwise, not started
//       notStarted++;
//     });

//     res.status(200).json({
//       status: 'success',
//       data: {
//         completed,
//         inProgress,
//         notStarted,
//         totalEmployees: employeesLearningProgress.length,
//       },
//     });
//   },
// );

export const getCourseTopPerformers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { courseId } = req.params;
    if (!courseId) return next(new AppError('Course id required!', 400));

    // Get all employees with their learning progress, fullName, and departmentId

    let employees;
    if (req.company)
      employees = await User.find({
        companyId: req.company!._id,
      }).select('learningProgress fullName departmentId');
    else
      employees = await User.find({
        departmentId: req.user?.departmentId,
      }).select('learningProgress fullName departmentId');

    // Collect all unique departmentIds
    const departmentIds = [
      ...new Set(
        employees.map((e: any) => e.departmentId?.toString()).filter(Boolean),
      ),
    ];
    // Query all departments at once, including coursesAssignedToDepartment
    const departments = await Department.find({
      _id: { $in: departmentIds },
    }).select('name coursesAssignedToDepartment');
    const departmentMap = new Map(
      departments.map((d: any) => [d._id.toString(), d.name]),
    );

    // Filter employees whose department is assigned to the course
    const filteredEmployees = employees.filter((user: any) => {
      const deptId = user.departmentId?.toString();
      const department = deptId
        ? departments.find((d: any) => d._id.toString() === deptId)
        : null;
      // Check if department has coursesAssignedToDepartment and includes courseId
      return department && Array.isArray(department.coursesAssignedToDepartment)
        ? department.coursesAssignedToDepartment
            .map((c: any) => c.toString())
            .includes(courseId)
        : false;
    });

    // Build performers array for filtered employees
    const performers = filteredEmployees.map((user: any) => {
      // Find learningProgress entry for this course
      const lp = user.learningProgress?.find(
        (lp: any) => lp.courseId?.toString() === courseId,
      );
      // Sum quiz scores and count completed tutorials
      let score = 0;
      let completed = 0;
      if (lp) {
        if (Array.isArray(lp.quizzes)) {
          score = lp.quizzes.reduce(
            (sum: number, q: any) =>
              sum + (typeof q.score === 'number' ? q.score : 0),
            0,
          );
        }
        if (Array.isArray(lp.tutorials)) {
          completed = lp.tutorials.filter((t: any) => t.isCompleted).length;
        }
      }
      return {
        name: user.fullName,
        department: departmentMap.get(user.departmentId?.toString()) || '',
        score,
        completed,
      };
    });

    // Sort by score descending, then completed descending
    performers.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.completed - a.completed;
    });

    res.status(200).json({
      status: 'success',
      data: performers,
    });
  },
);

export const getDepartmentComparision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.company) return next(new AppError('Unauthorized action', 400));
    const departments = await Department.find({ companyId: req.company!._id });

    // 1. Get employeesId for the department employees
    const results = [];
    for (const department of departments) {
      const employeeIds = (department.employees || []).map(
        (emp: any) => emp.id,
      );
      if (employeeIds.length === 0) {
        results.push({
          departmentName: department.name,
          totalScore: 0,
          employeeCount: 0,
        });
        continue;
      }
      // 2. Get learningProgress of employees of department by querying using employeeId and only selecting learningProgress
      const users = await User.find({ _id: { $in: employeeIds } }).select(
        'learningProgress',
      );
      // 3. Sum up their quiz result for employees individually and then collectively
      let departmentTotalScore = 0;
      for (const user of users) {
        let userScore = 0;
        if (Array.isArray(user.learningProgress)) {
          for (const lp of user.learningProgress) {
            if (Array.isArray(lp.quizzes)) {
              userScore += lp.quizzes.reduce(
                (sum: number, q: any) =>
                  sum + (typeof q.score === 'number' ? q.score : 0),
                0,
              );
            }
          }
        }
        departmentTotalScore += userScore;
      }
      // 4. Return department name and score which is total score from sum of department employees
      results.push({
        departmentName: department.name,
        totalScore: departmentTotalScore,
        employeeCount: users.length,
      });
    }
    res.status(200).json({
      status: 'success',
      data: results,
    });
  },
);

//NOTE Approve all employees to be emplemented

export const getCompletedCourses = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let employees;
    if (req.company) {
      employees = await User.find({ companyId: req.company._id }).select(
        'learningProgress',
      );
    } else {
      employees = await User.find({
        departmentId: req.user!.departmentId,
      }).select('learningProgress');
    }

    console.log(employees);
    // Only include completions from the last 12 months, group by 3-letter month (capitalized)
    const now = new Date();
    const last12Months: Set<string> = new Set();
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const m = d.toLocaleString('en-US', { month: 'short' });
      last12Months.add(m.charAt(0).toUpperCase() + m.slice(1));
    }

    const monthMap: Record<string, number> = {};

    employees.forEach((user: any) => {
      if (!Array.isArray(user.learningProgress)) return;
      user.learningProgress.forEach((lp: any) => {
        if (lp.progress === 100 && lp.completedAt) {
          const date = new Date(lp.completedAt);
          if (!isNaN(date.getTime())) {
            const month = date.toLocaleString('en-US', { month: 'short' });
            const key = month.charAt(0).toUpperCase() + month.slice(1);
            // Only count if in last 12 months
            if (last12Months.has(key)) {
              monthMap[key] = (monthMap[key] || 0) + 1;
            }
          }
        }
      });
    });

    // Ensure all last 12 months are present in the result, even if 0
    const result: Record<string, number> = {};
    Array.from(last12Months)
      .reverse()
      .forEach((m) => {
        result[m] = monthMap[m] || 0;
      });

    res.status(200).json({
      status: 'success',
      data: result,
    });
  },
);

export const getTopPerformersOfEachDepartment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let companyId;
    if (req.company) companyId = req.company?._id;
    else companyId = req.user?.companyId;

    const departments = await Department.find({ companyId });
    //1 get employees of each department
    const departmentEmployees = await Promise.all(
      departments.map(async (department) => {
        const employees = await User.find({
          departmentId: department._id,
        }).select('fullName learningProgress');
        return { department, employees };
      }),
    );

    // For each department, find the top performer by quiz score sum, then least attempts, then alphabetically
    type Performer = {
      name: string;
      department: string;
      quizScore: number;
      totalAttempts: number;
    };
    const topPerformers = departmentEmployees
      .map(({ department, employees }) => {
        let topPerformer: Performer | null = null;
        employees.forEach((employee: any) => {
          let quizScore = 0;
          let totalAttempts = 0;
          if (Array.isArray(employee.learningProgress)) {
            for (const lp of employee.learningProgress) {
              if (Array.isArray(lp.quizzes)) {
                quizScore += lp.quizzes.reduce(
                  (sum: number, q: any) =>
                    sum + (typeof q.score === 'number' ? q.score : 0),
                  0,
                );
                totalAttempts += lp.quizzes.reduce(
                  (sum: number, q: any) =>
                    sum + (typeof q.attempts === 'number' ? q.attempts : 0),
                  0,
                );
              }
            }
          }
          const name = employee.fullName;
          if (!topPerformer) {
            topPerformer = {
              name,
              department: department.name,
              quizScore,
              totalAttempts,
            };
          } else {
            if (quizScore > topPerformer.quizScore) {
              topPerformer = {
                name,
                department: department.name,
                quizScore,
                totalAttempts,
              };
            } else if (quizScore === topPerformer.quizScore) {
              if (totalAttempts < topPerformer.totalAttempts) {
                topPerformer = {
                  name,
                  department: department.name,
                  quizScore,
                  totalAttempts,
                };
              } else if (totalAttempts === topPerformer.totalAttempts) {
                if (
                  name &&
                  topPerformer.name &&
                  name.localeCompare(topPerformer.name) < 0
                ) {
                  topPerformer = {
                    name,
                    department: department.name,
                    quizScore,
                    totalAttempts,
                  };
                }
              }
            }
          }
        });
        // If no employees, return null for this department
        if (!topPerformer) return null;
        // Remove totalAttempts from result
        const {
          name,
          department: deptName,
          quizScore,
        } = topPerformer as Performer;

        console.log(name, deptName, quizScore, 'top performer');
        return {
          name,
          department: deptName,
          quizScore,
        };
      })
      .filter(Boolean); // Remove nulls

    res.status(200).json({
      status: 'success',
      data: topPerformers,
    });
  },
);

export const getDepartmentRanking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let companyId;
    if (req.company) companyId = req.company?._id;
    else companyId = req.user?.companyId;

    // 1. Get all departments for the company
    const departments = await Department.find({ companyId });
    const departmentStats = await Promise.all(
      departments.map(async (department) => {
        // 2. Get employees of each department
        const employeeIds = (department.employees || []).map(
          (emp: any) => emp.id,
        );
        // 3. Get learningProgress of each employee
        const users = await User.find({ _id: { $in: employeeIds } }).select(
          'learningProgress',
        );
        // 4. Sum up their quiz result for employees individually and then collectively
        let totalScore = 0;
        let memberCount = users.length;
        let scores: number[] = [];
        for (const user of users) {
          let userScore = 0;
          if (Array.isArray(user.learningProgress)) {
            for (const lp of user.learningProgress) {
              if (Array.isArray(lp.quizzes)) {
                userScore += lp.quizzes.reduce(
                  (sum: number, q: any) =>
                    sum + (typeof q.score === 'number' ? q.score : 0),
                  0,
                );
              }
            }
          }
          totalScore += userScore;
          scores.push(userScore);
        }
        // 6. Calculate average score for each department
        const averageScore = memberCount > 0 ? totalScore / memberCount : 0;
        return {
          department: department.name,
          members: memberCount,
          averageScore: Number(averageScore.toFixed(2)),
          totalScore,
        };
      }),
    );
    // 8. Rank departments by average score (descending)
    departmentStats.sort((a, b) => b.averageScore - a.averageScore);
    // 9. Return department name as department, number of employees as members, average score as averageScore, and total score as totalScore
    res.status(200).json({
      status: 'success',
      data: departmentStats,
    });
  },
);
// protectUserOrCompany

export const approveCompany = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { companyId } = req.query;
    console.log(companyId, 'companyId');
    const company = await Company.findById(companyId);
    if (!company) {
      return next(new AppError('Company could not found', 404));
    }
    console.log(company);

    if (company.isApproved) {
      return next(new AppError('Company is already approved', 400));
    }

    company.isApproved = true;
    await company.save({ validateBeforeSave: false });
    res.status(200).json({
      status: 'success',
      message: 'Company approved successfully',
      data: {
        document: company,
      },
    });
  },
);

export const disApproveCompany = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { companyId } = req.query;
    console.log(companyId, 'companyId');
    const company = await Company.findById(companyId);
    if (!company) {
      return next(new AppError('Company could not found', 404));
    }
    console.log(company);

    if (!company.isApproved) {
      return next(new AppError('Company is already not approved', 400));
    }

    company.isApproved = false;
    await company.save({ validateBeforeSave: false });
    res.status(200).json({
      status: 'success',
      message: 'Company disapproved successfully',
      data: {
        document: company,
      },
    });
  },
);

export const updateMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.company?.id;
    // const { name, logo } = req.body;
    const name = req.body?.name;
    const logo = req.body?.logo;

    if (!name && !logo) {
      return next(new AppError('No valid fields to update', 400));
    }

    const updatedCompany = await Company.findByIdAndUpdate(
      id,
      { name, logo },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedCompany) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        company: updatedCompany,
      },
    });
  },
);
