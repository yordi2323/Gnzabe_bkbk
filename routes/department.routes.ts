import express from 'express';
import {
  activateDepartment,
  addEmployeeToDepartment,
  assignCourseToDepartment,
  assignDepartmentAdmin,
  createDepartment,
  deactiveDepartment,
  getAllDepartments,
  getDepartment,
  getDepartmentProgress,
  removeEmployeeFromDepartment,
  revokeDepartmentAdmin,
} from '../controllers/department.controller';
import {
  protectCompany,
  protectUserOrCompany,
} from '../middlewares/auth.company.middleware';
import {
  addCompanyIdToRequest,
  allowedToCompanyOrDepartmentAdmin,
  doesDepartmentBelongToCompany,
} from '../middlewares/middlewares';
import { cachedMiddleware } from '../middlewares/cache.middlware';

const router = express.Router();

router.route('/:id').get(allowedToCompanyOrDepartmentAdmin, getDepartment);
router
  .route('/remove-employee')
  .post(allowedToCompanyOrDepartmentAdmin, removeEmployeeFromDepartment);
router
  .route('/progress/:id')
  .get(allowedToCompanyOrDepartmentAdmin, getDepartmentProgress);

// router.use()
// router.use(allowedToCompanyOrDepartmentAdmin)

router
  .route('/assign-course')
  .post(protectUserOrCompany, assignCourseToDepartment);

router.use(protectCompany);
router
  .route('/')
  .get(cachedMiddleware, getAllDepartments)
  .post(addCompanyIdToRequest, createDepartment);

router.route('/add-employee').post(addEmployeeToDepartment);
router.route('/assign-admin').post(assignDepartmentAdmin);
router.route('/revoke-admin').post(revokeDepartmentAdmin);

router
  .route('/activate/:id')
  .post(doesDepartmentBelongToCompany, activateDepartment);
router
  .route('/deactivate/:id')
  .post(doesDepartmentBelongToCompany, deactiveDepartment);

// router.route('/').get(getAllDepartments);

export default router;
